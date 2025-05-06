import { View, TextInput, Text, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function SearchScreen() {
  const { text, background, cardBackground, inputBorder } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: background, padding: 16 }}>
      <TextInput
        style={{
          backgroundColor: cardBackground,
          height: 50,
          borderRadius: 12,
          padding: 15,
          borderWidth: 1,
          borderColor: inputBorder,
          color: text,
          marginBottom: 20
        }}
        placeholder="Buscar lugares..."
        placeholderTextColor={text}
      />

      <ScrollView>
        <Text style={{ color: text, fontSize: 18, marginBottom: 16 }}>
          Filtros populares
        </Text>
        
        {/* Filtros de ejemplo */}
        {['Con patio', '24/7', 'Veterinario', 'Piscina'].map((filter, index) => (
          <View key={index} style={{
            backgroundColor: cardBackground,
            padding: 12,
            borderRadius: 8,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: inputBorder
          }}>
            <Text style={{ color: text }}>{filter}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}