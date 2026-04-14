import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { AudioButton } from '@/components/common/AudioButton';
import { searchDictionary, allDictionaryEntries, DictionaryEntry } from '@/data/dictionary';
import { searchDictionaryApi } from '@/lib/dictionaryApi';

const POPULAR_WORDS = [
  '안녕하세요', '감사합니다', '사랑', '먹다', '가다', '좋다',
  '학교', '친구', '물', '예쁘다', '집', '시간',
];

// Debounce delay for API search (ms)
const API_DEBOUNCE = 600;

type ListItem =
  | { type: 'entry'; entry: DictionaryEntry; source: 'local' | 'api' }
  | { type: 'section'; title: string }
  | { type: 'loading' }
  | { type: 'apiError'; message: string };

export default function DictionaryScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [apiResults, setApiResults] = useState<DictionaryEntry[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const savedWords = useAppStore((s) => s.savedWords);
  const addSavedWord = useAppStore((s) => s.addSavedWord);
  const removeSavedWord = useAppStore((s) => s.removeSavedWord);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const localResults = useMemo(() => searchDictionary(query), [query]);

  const popularEntries = useMemo(() => {
    return POPULAR_WORDS.map((korean) =>
      allDictionaryEntries.find((e) => e.korean === korean)
    ).filter(Boolean) as DictionaryEntry[];
  }, []);

  // Trigger API search with debounce when query changes
  useEffect(() => {
    const q = query.trim();

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }

    // Reset API state when query is cleared
    if (!q || q.length < 2) {
      setApiResults([]);
      setApiLoading(false);
      setApiError(null);
      return;
    }

    // If local results are plentiful, skip API
    if (localResults.length >= 10) {
      setApiResults([]);
      setApiLoading(false);
      setApiError(null);
      return;
    }

    // Show loading state immediately for user feedback
    setApiLoading(true);
    setApiError(null);

    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await searchDictionaryApi(q);
        // Filter out duplicates that already exist in local results
        const localKoreanSet = new Set(localResults.map((e) => e.korean));
        const uniqueApiResults = results.filter((e) => !localKoreanSet.has(e.korean));
        setApiResults(uniqueApiResults);
        setApiError(null);
      } catch {
        setApiError('Could not reach online dictionary');
        setApiResults([]);
      } finally {
        setApiLoading(false);
      }
    }, API_DEBOUNCE);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, localResults]);

  // Build the flat list data with section headers
  const displayData: ListItem[] = useMemo(() => {
    const q = query.trim();
    if (!q) {
      return popularEntries.map((entry) => ({
        type: 'entry' as const,
        entry,
        source: 'local' as const,
      }));
    }

    const items: ListItem[] = [];

    // Local results
    if (localResults.length > 0) {
      items.push(...localResults.map((entry) => ({
        type: 'entry' as const,
        entry,
        source: 'local' as const,
      })));
    }

    // API section
    if (apiLoading) {
      items.push({ type: 'loading' });
    } else if (apiError) {
      items.push({ type: 'apiError', message: apiError });
    } else if (apiResults.length > 0) {
      items.push({ type: 'section', title: 'Online Results' });
      items.push(...apiResults.map((entry) => ({
        type: 'entry' as const,
        entry,
        source: 'api' as const,
      })));
    }

    return items;
  }, [query, localResults, apiResults, apiLoading, apiError, popularEntries]);

  const headerText = useMemo(() => {
    const q = query.trim();
    if (!q) return 'Popular Words';
    const total = localResults.length + apiResults.length;
    return `${total} result${total !== 1 ? 's' : ''}`;
  }, [query, localResults.length, apiResults.length]);

  const toggleExpand = useCallback((key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  }, []);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    if (item.type === 'section') {
      return (
        <View style={styles.sectionHeader}>
          <View style={styles.sectionDivider} />
          <View style={styles.sectionBadge}>
            <Ionicons name="globe-outline" size={12} color={colors.secondary} />
            <Text style={styles.sectionText}>{item.title}</Text>
          </View>
          <View style={styles.sectionDivider} />
        </View>
      );
    }

    if (item.type === 'loading') {
      return (
        <View style={styles.apiLoadingContainer}>
          <View style={styles.sectionDivider} />
          <View style={styles.apiLoadingRow}>
            <ActivityIndicator size="small" color={colors.secondary} />
            <Text style={styles.apiLoadingText}>Searching online dictionary...</Text>
          </View>
        </View>
      );
    }

    if (item.type === 'apiError') {
      return (
        <View style={styles.apiErrorContainer}>
          <Ionicons name="cloud-offline-outline" size={16} color={colors.textTertiary} />
          <Text style={styles.apiErrorText}>{item.message}</Text>
        </View>
      );
    }

    const { entry, source } = item;
    const itemKey = `${source}-${entry.korean}-${entry.english}`;
    const isSaved = savedWords.includes(entry.korean);
    const isExpanded = expandedKey === itemKey;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => toggleExpand(itemKey)}
        style={[styles.resultCard, source === 'api' && styles.apiResultCard]}
      >
        <View style={styles.resultRow}>
          <View style={styles.resultLeft}>
            <Text style={styles.resultKorean}>{entry.korean}</Text>
            <Text style={styles.resultRomanization}>{entry.romanization}</Text>
            <Text style={styles.resultEnglish}>{entry.english}</Text>
          </View>
          <View style={styles.resultRight}>
            <View style={[styles.posBadge, source === 'api' && styles.apiPosBadge]}>
              <Text style={[styles.posText, source === 'api' && styles.apiPosText]}>
                {entry.partOfSpeech}
              </Text>
            </View>
            <View style={styles.resultActions}>
              <AudioButton text={entry.korean} size="sm" color={colors.primary} />
              <TouchableOpacity
                onPress={() => isSaved ? removeSavedWord(entry.korean) : addSavedWord(entry.korean)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={isSaved ? 'star' : 'star-outline'}
                  size={22}
                  color={isSaved ? colors.secondary : colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {isExpanded && entry.example && (
          <View style={styles.exampleContainer}>
            <View style={styles.exampleDivider} />
            <Text style={styles.exampleLabel}>Example</Text>
            <Text style={styles.exampleKorean}>{entry.example.korean}</Text>
            <Text style={styles.exampleEnglish}>{entry.example.english}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [savedWords, expandedKey, addSavedWord, removeSavedWord, toggleExpand]);

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.type === 'entry') {
      return `${item.source}-${item.entry.korean}-${item.entry.english}-${index}`;
    }
    return `${item.type}-${index}`;
  }, []);

  const hasQuery = query.trim().length > 0;
  const noResults = hasQuery && localResults.length === 0 && apiResults.length === 0 && !apiLoading;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { paddingTop: spacing.md }]}>
        <View style={[styles.searchBar, focused && styles.searchBarFocused]}>
          <Ionicons name="search" size={20} color={focused ? colors.primaryDark : colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Korean, English, or romanization..."
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); Keyboard.dismiss(); }}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsHeaderText}>{headerText}</Text>
        {hasQuery && apiLoading && (
          <ActivityIndicator size="small" color={colors.secondary} style={styles.headerSpinner} />
        )}
      </View>

      {/* Results List */}
      <FlatList
        data={displayData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          noResults ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>Try searching with different keywords</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    height: 52,
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.sm,
  },
  searchBarFocused: {
    borderColor: colors.primaryDark,
    ...shadows.glow,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  resultsHeaderText: {
    ...typography.caption,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerSpinner: {
    marginLeft: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  // Section header for "Online Results"
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  sectionText: {
    ...typography.caption,
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // API loading indicator
  apiLoadingContainer: {
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  apiLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  apiLoadingText: {
    ...typography.footnote,
    color: colors.textTertiary,
  },
  // API error
  apiErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  apiErrorText: {
    ...typography.footnote,
    color: colors.textTertiary,
  },
  // Result cards
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  apiResultCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  resultKorean: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: colors.textPrimary,
    lineHeight: 30,
  },
  resultRomanization: {
    ...typography.footnote,
    color: colors.textTertiary,
    fontStyle: 'italic',
    marginTop: 1,
  },
  resultEnglish: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  resultRight: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  posBadge: {
    backgroundColor: colors.primaryPale,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  apiPosBadge: {
    backgroundColor: colors.secondaryLight,
  },
  posText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  apiPosText: {
    color: colors.secondary,
  },
  resultActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  exampleContainer: {
    marginTop: spacing.sm,
  },
  exampleDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: spacing.sm,
  },
  exampleLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  exampleKorean: {
    ...typography.subhead,
    color: colors.textPrimary,
  },
  exampleEnglish: {
    ...typography.footnote,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: spacing.huge,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.headline,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    ...typography.footnote,
    color: colors.textTertiary,
  },
});
