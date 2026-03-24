import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { stopSpeaking, speakChatMessage } from '@/lib/audio';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type TeacherGender = 'female' | 'male';

const TEACHERS = {
  female: {
    name: 'Minji',
    nameKorean: '민지 선생님',
    avatar: 'M',
    gradient: [colors.primary, colors.primaryDark] as const,
    voice: 'coral' as const,
    personality: `You are 민지 (Minji), a warm, bubbly 28-year-old Korean language teacher from Seoul. You LOVE K-dramas and K-pop and often reference them. You are like a caring older sister (언니/누나) to your students. You get excited when students get things right ("Oh my gosh, yes! Perfect!"). You use a mix of English and Korean naturally. You have little catchphrases like "Aigoo!" when something is cute or surprising, and "Daebak!" when impressed. You sometimes share fun Korean culture facts. You are patient but playful - if a student makes a mistake you laugh gently and help them. Keep responses conversational and short (2-4 sentences). Always include Korean with romanization. You ONLY teach Korean - if asked about anything else, cutely redirect: "Hmm, let's save that for later! Right now, Korean time!" Teach like a friend, not a textbook. Start simple and get harder as the student improves.`,
  },
  male: {
    name: 'Junwoo',
    nameKorean: '준우 선생님',
    avatar: 'J',
    gradient: ['#7C4DFF', '#3D5AFE'] as const,
    voice: 'ash' as const,
    personality: `You are 준우 (Junwoo), a cool, laid-back 30-year-old Korean teacher from Busan. You have a chill energy but get passionate about Korean language. You use humor a lot and make dad jokes mixing Korean and English. You're like a supportive older brother (형/오빠). You say things like "Niiice!" and "Let's gooo!" when students do well. You love Korean food and BBQ and often use food examples. You sometimes use Busan satoori (dialect) as fun extras. You're patient and encouraging - when students struggle you say "No worries, we got this." Keep responses natural and short (2-4 sentences). Always include Korean with romanization. You ONLY teach Korean - if asked about anything else, redirect casually: "Haha, that's cool but let's focus on Korean right now!" Teach conversationally. Start simple, get harder as student improves.`,
  },
};

const API_URL = 'https://text.pollinations.ai/';

function speakFull(text: string, _gender: TeacherGender): void {
  const voice = _gender === 'female' ? 'coral' : 'ash';
  speakChatMessage(text, voice);
}

function stopChatAudio() {
  stopSpeaking();
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [teacherGender, setTeacherGender] = useState<TeacherGender | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const hapticEnabled = useAppStore((s) => s.hapticEnabled);

  const teacher = teacherGender ? TEACHERS[teacherGender] : null;

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const selectTeacher = (gender: TeacherGender) => {
    setTeacherGender(gender);
    const t = TEACHERS[gender];
    const welcome: Message = {
      id: 'welcome',
      role: 'assistant',
      content: gender === 'female'
        ? `Annyeonghaseyo! I'm Minji, your Korean teacher! So excited to meet you! We're going to have so much fun learning Korean together. Let's start easy - can you say 안녕 (annyeong)? That means "hi" between friends!`
        : `Hey! What's up! I'm Junwoo, your Korean teacher. Welcome! Let's make learning Korean fun and chill. First things first - try saying 안녕 (annyeong). It's the casual way to say "hi"!`,
    };
    setMessages([welcome]);
    setTimeout(() => speakFull(welcome.content, gender), 500);
  };

  const handlePlayMessage = (message: Message) => {
    if (!teacherGender) return;
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPlayingId(message.id);
    speakFull(message.content, teacherGender);
    // Estimate duration: ~80ms per character
    const duration = Math.min(message.content.length * 80, 15000);
    setTimeout(() => setPlayingId(null), duration);
  };

  const sendMessage = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isLoading || !teacher) return;

    setError(null);
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const apiMessages = updatedMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          model: 'openai',
          system: teacher!.personality,
        }),
      });

      if (!response.ok) throw new Error(`Server error ${response.status}`);
      const responseText = await response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText.trim(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Auto-speak the full response
      setTimeout(() => {
        setPlayingId(assistantMessage.id);
        speakFull(assistantMessage.content, teacherGender!);
        const duration = Math.min(assistantMessage.content.length * 80, 15000);
        setTimeout(() => setPlayingId(null), duration);
      }, 300);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Teacher selection screen
  if (!teacherGender) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={colors.gradientDark} style={[styles.selectHeader, { paddingTop: insets.top + spacing.md }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ alignSelf: 'flex-end', padding: spacing.md, marginRight: spacing.sm }}>
            <Ionicons name="close-circle" size={32} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <Text style={styles.selectTitle}>Choose Your Teacher</Text>
          <Text style={styles.selectSub}>선생님을 선택하세요</Text>
        </LinearGradient>

        <View style={styles.selectContent}>
          <TouchableOpacity onPress={() => selectTeacher('female')} activeOpacity={0.8}>
            <LinearGradient colors={TEACHERS.female.gradient} style={styles.teacherCard}>
              <View style={styles.teacherAvatar}>
                <Text style={styles.teacherAvatarText}>M</Text>
              </View>
              <Text style={styles.teacherName}>Minji</Text>
              <Text style={styles.teacherNameKr}>민지 선생님</Text>
              <Text style={styles.teacherDesc}>Warm, bubbly, K-drama lover</Text>
              <Text style={styles.teacherDesc}>Like a caring older sister</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => selectTeacher('male')} activeOpacity={0.8}>
            <LinearGradient colors={TEACHERS.male.gradient} style={styles.teacherCard}>
              <View style={styles.teacherAvatar}>
                <Text style={styles.teacherAvatarText}>J</Text>
              </View>
              <Text style={styles.teacherName}>Junwoo</Text>
              <Text style={styles.teacherNameKr}>준우 선생님</Text>
              <Text style={styles.teacherDesc}>Cool, laid-back, funny</Text>
              <Text style={styles.teacherDesc}>Like a supportive older brother</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // At this point teacher is guaranteed non-null (guarded by early return above)
  const t = teacher!;

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    const isPlaying = playingId === item.id;

    return (
      <View style={[styles.messageBubbleRow, isUser ? styles.userRow : styles.assistantRow]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <LinearGradient colors={t.gradient} style={styles.avatar}>
              <Text style={styles.avatarText}>{t.avatar}</Text>
            </LinearGradient>
          </View>
        )}
        <View style={{ flexShrink: 1 }}>
          <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble, isPlaying && styles.playingBubble]}>
            {!isUser && <Text style={styles.senderName}>{t.name}</Text>}
            <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
              {item.content}
            </Text>
          </View>
          {!isUser && (
            <TouchableOpacity onPress={() => handlePlayMessage(item)} style={styles.playBtn}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={12} color={isPlaying ? colors.primary : colors.textTertiary} />
              <Text style={[styles.playText, isPlaying && { color: colors.primary }]}>
                {isPlaying ? 'Speaking...' : 'Replay'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <LinearGradient colors={t.gradient} style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => { stopChatAudio(); setTeacherGender(null); setMessages([]); }} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{t.avatar}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t.nameKorean}</Text>
            <Text style={styles.headerSubtitle}>Voice Chat</Text>
          </View>
          <TouchableOpacity onPress={() => { stopChatAudio(); router.back(); }} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>{t.name} is thinking...</Text>
          </View>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => setError(null)}>
            <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Input */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Talk to ${t.name}...`}
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={500}
            editable={!isLoading}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && { opacity: 0.4 }]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={inputText.trim() && !isLoading ? t.gradient : [colors.borderLight, colors.borderLight]}
              style={styles.sendButtonGradient}
            >
              <Ionicons name="send" size={18} color={inputText.trim() && !isLoading ? '#fff' : colors.textTertiary} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Teacher Selection
  selectHeader: { paddingBottom: spacing.xxxl, paddingHorizontal: spacing.xl, alignItems: 'center', borderBottomLeftRadius: borderRadius.xxl, borderBottomRightRadius: borderRadius.xxl },
  selectTitle: { fontSize: 28, fontFamily: 'Poppins-ExtraBold', color: '#fff' },
  selectSub: { fontSize: 14, fontFamily: 'Poppins-Medium', color: 'rgba(255,255,255,0.6)' },
  selectContent: { padding: spacing.xl, gap: spacing.lg, marginTop: -spacing.lg },
  teacherCard: { borderRadius: borderRadius.xxl, padding: spacing.xxl, alignItems: 'center', gap: spacing.sm, ...shadows.lg },
  teacherAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  teacherAvatarText: { fontSize: 32, fontFamily: 'Poppins-Bold', color: '#fff' },
  teacherName: { fontSize: 24, fontFamily: 'Poppins-ExtraBold', color: '#fff' },
  teacherNameKr: { fontSize: 14, fontFamily: 'Poppins-Medium', color: 'rgba(255,255,255,0.8)' },
  teacherDesc: { fontSize: 13, fontFamily: 'Poppins-Regular', color: 'rgba(255,255,255,0.7)' },

  // Chat Header
  header: { paddingBottom: spacing.md, paddingHorizontal: spacing.lg },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  backBtn: { padding: spacing.xs },
  closeBtn: { padding: spacing.xs },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  headerAvatarText: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#fff' },
  headerTitle: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#fff' },
  headerSubtitle: { fontSize: 10, fontFamily: 'Poppins-Medium', color: 'rgba(255,255,255,0.7)' },
  onlineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00E676' },

  // Messages
  messagesList: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  messageBubbleRow: { flexDirection: 'row', marginBottom: spacing.md, maxWidth: '85%' },
  userRow: { alignSelf: 'flex-end' },
  assistantRow: { alignSelf: 'flex-start' },
  avatarContainer: { marginRight: spacing.sm, alignSelf: 'flex-start', marginTop: 4 },
  avatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 13, fontFamily: 'Poppins-Bold', color: '#fff' },
  messageBubble: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: borderRadius.xl },
  userBubble: { backgroundColor: colors.primaryDark, borderBottomRightRadius: borderRadius.sm, ...shadows.sm },
  assistantBubble: { backgroundColor: colors.surface, borderBottomLeftRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm },
  playingBubble: { borderColor: colors.primary, borderWidth: 2 },
  senderName: { fontSize: 10, fontFamily: 'Poppins-Bold', color: colors.primary, marginBottom: 2 },
  messageText: { fontSize: 15, fontFamily: 'Poppins-Regular', lineHeight: 22 },
  userText: { color: '#fff' },
  assistantText: { color: colors.textPrimary },
  playBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3, marginLeft: spacing.xs },
  playText: { fontSize: 10, fontFamily: 'Poppins-Medium', color: colors.textTertiary },

  // Loading / Error
  loadingContainer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  loadingBubble: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.lg, gap: spacing.sm, borderWidth: 1, borderColor: colors.borderLight },
  loadingText: { fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.textSecondary, fontStyle: 'italic' },
  errorContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.lg, marginBottom: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.dangerLight, borderRadius: borderRadius.md, gap: spacing.sm },
  errorText: { fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.danger, flex: 1 },

  // Input
  inputContainer: { backgroundColor: colors.surface, paddingTop: spacing.sm, paddingHorizontal: spacing.lg, borderTopWidth: 1, borderTopColor: colors.borderLight },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  textInput: { flex: 1, fontSize: 15, fontFamily: 'Poppins-Regular', color: colors.textPrimary, backgroundColor: colors.background, borderRadius: borderRadius.xl, paddingHorizontal: spacing.lg, paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.sm, paddingBottom: Platform.OS === 'ios' ? spacing.md : spacing.sm, maxHeight: 100, borderWidth: 1, borderColor: colors.borderLight },
  sendButton: { marginBottom: Platform.OS === 'ios' ? 2 : 0 },
  sendButtonGradient: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});
