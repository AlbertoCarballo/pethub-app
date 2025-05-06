import { ColorSchemeName, useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

export function useTheme() {
  const colorScheme: ColorSchemeName = useColorScheme() || 'light';
  return Colors[colorScheme];
}