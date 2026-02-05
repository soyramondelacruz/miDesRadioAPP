import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '@/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({
  label,
  onPress,
  variant = 'primary',
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  text: {
    color: '#FFF',
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.md,
  },
});