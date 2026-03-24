import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, typography } from '@/lib/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({ title, onPress, variant = 'primary', size = 'md', disabled, loading, style, textStyle, icon }: ButtonProps) {
  const sizeStyles = sizes[size];
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.8} style={[{ opacity: isDisabled ? 0.5 : 1 }, style]}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.base, sizeStyles.container, { borderRadius: borderRadius.xl }]}>
          {loading ? <ActivityIndicator color="#fff" /> : (
            <>
              {icon}
              <Text style={[styles.textPrimary, sizeStyles.text, textStyle]}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyle = variantStyles[variant];
  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.7} style={[styles.base, sizeStyles.container, variantStyle.container, { opacity: isDisabled ? 0.5 : 1, borderRadius: borderRadius.xl }, style]}>
      {loading ? <ActivityIndicator color={variantStyle.textColor} /> : (
        <>
          {icon}
          <Text style={[sizeStyles.text, { color: variantStyle.textColor, fontWeight: '600' }, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  textPrimary: {
    color: '#fff',
    fontWeight: '700',
  },
});

const sizes = {
  sm: { container: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg } as ViewStyle, text: { fontSize: 14 } as TextStyle },
  md: { container: { paddingVertical: spacing.md + 2, paddingHorizontal: spacing.xl } as ViewStyle, text: { fontSize: 16 } as TextStyle },
  lg: { container: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl } as ViewStyle, text: { fontSize: 18 } as TextStyle },
};

const variantStyles = {
  secondary: { container: { backgroundColor: colors.primaryPale } as ViewStyle, textColor: colors.primaryDark },
  outline: { container: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary } as ViewStyle, textColor: colors.primary },
  ghost: { container: { backgroundColor: 'transparent' } as ViewStyle, textColor: colors.primary },
  danger: { container: { backgroundColor: colors.dangerLight } as ViewStyle, textColor: colors.danger },
};
