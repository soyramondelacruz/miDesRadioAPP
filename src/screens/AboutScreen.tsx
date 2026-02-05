import { View, Text } from 'react-native';
import { Header } from '../components/ui/Header';
import { spacing } from '../theme';

export function AboutScreen() {
  return (
    <View style={{ flex: 1, padding: spacing.lg }}>
      <Header title="Sobre miDes" />
      <Text>Misión, visión, identidad</Text>
    </View>
  );
}