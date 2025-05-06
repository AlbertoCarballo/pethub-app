import { FlatList, Text, View } from 'react-native';
import { mockPlaces } from '../../data/mockPlaces';
import { useTheme } from '../../hooks/useTheme';

export default function HomeScreen() {
  const { text, background, cardBackground, border } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: background, padding: 16 }}>
      <Text style={{ 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: text,
        marginBottom: 16 
      }}>
        Lugares disponibles
      </Text>

      <FlatList
        data={mockPlaces}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: cardBackground,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: border
          }}>
            <Text style={{ color: text, fontWeight: 'bold', fontSize: 18 }}>
              {item.name}
            </Text>
            <Text style={{ color: text, opacity: 0.8, marginTop: 4 }}>
              {item.description}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}