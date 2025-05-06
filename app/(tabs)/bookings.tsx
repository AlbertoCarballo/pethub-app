import { FlatList, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const mockBookings = [
  { id: '1', place: 'Casa de Luna', date: '15 Oct 2023', status: 'Confirmada' },
  { id: '2', place: 'Guardería Peludos', date: '20 Oct 2023', status: 'Pendiente' }
];

export default function BookingsScreen() {
  const { text, background, cardBackground, border } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: background, padding: 16 }}>
      <Text style={{ 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: text,
        marginBottom: 20 
      }}>
        Mis Reservas
      </Text>

      <FlatList
        data={mockBookings}
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
              {item.place}
            </Text>
            <Text style={{ color: text, marginTop: 4 }}>Fecha: {item.date}</Text>
            <Text style={{ 
              color: item.status === 'Confirmada' ? '#4ECDC4' : '#FF6B6B',
              marginTop: 8
            }}>
              {item.status}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}