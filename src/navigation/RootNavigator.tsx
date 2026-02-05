import { NavigationContainer } from '@react-navigation/native';
import { AppTabs } from './AppTabs';

export function RootNavigator() {
  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>
  );
}