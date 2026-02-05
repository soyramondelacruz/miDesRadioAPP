import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export function Header({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: typography.size.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
});