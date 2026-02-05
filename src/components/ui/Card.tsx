import { View, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '@/theme';

export function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
});