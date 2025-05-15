import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { mockPlaces } from '../../data/mockPlaces';
import { useTheme } from '../../hooks/useTheme';

// Creamos reservas de ejemplo basadas en mockPlaces
const mockBookings = [
  { 
    id: '1', 
    placeId: '2', // Referencia a Casa de Luna en mockPlaces
    bookingDate: '15 Oct 2023', 
    checkIn: '14:00', 
    checkOut: '12:00 (16 Oct)',
    status: 'Confirmada',
    pets: ['Max', 'Luna'],
    total: '$450', // 3 días a $150/día
    specialRequests: 'Dieta especial para Max'
  },
  { 
    id: '2', 
    placeId: '1', // Referencia a Guardería El Arenal
    bookingDate: '20 Oct 2023', 
    checkIn: '08:00', 
    checkOut: '20:00 (mismo día)',
    status: 'Pendiente',
    pets: ['Rocky'],
    total: '$200', // 1 día completo
    specialRequests: 'Necesita medicamento a las 12:00'
  }
];

export default function BookingsScreen() {
  const { text, background, cardBackground, border, tabIconSelected } = useTheme();
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Confirmada': return '#10B981'; // Verde
      case 'Pendiente': return '#F59E0B'; // Amarillo/naranja
      case 'Cancelada': return '#EF4444'; // Rojo
      case 'Completada': return '#3B82F6'; // Azul
      default: return text;
    }
  };

  // Función para obtener detalles del lugar
  const getPlaceDetails = (placeId: string) => {
    return mockPlaces.find(place => place.id === placeId) || mockPlaces[0];
  };

  const renderBookingItem = ({ item }) => {
    const place = getPlaceDetails(item.placeId);
    
    return (
      <TouchableOpacity
        onPress={() => router.push({
          pathname: '/bookingDetail',
          params: { 
            bookingId: item.id,
            placeId: item.placeId
          }
        })}
        activeOpacity={0.9}
      >
        <View style={[styles.bookingCard, { backgroundColor: cardBackground, borderColor: border }]}>
          {/* Encabezado con imagen del lugar */}
          <View style={styles.cardHeader}>
            <Image source={{ uri: place.image }} style={styles.placeImage} />
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          
          {/* Contenido principal */}
          <View style={styles.cardContent}>
            <Text style={[styles.placeName, { color: text }]}>{place.name}</Text>
            
            {/* Información de la reserva */}
            <View style={styles.bookingInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color={text} style={styles.icon} />
                <Text style={[styles.infoText, { color: text }]}>{item.bookingDate}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color={text} style={styles.icon} />
                <Text style={[styles.infoText, { color: text }]}>
                  {item.checkIn} - {item.checkOut}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="paw-outline" size={16} color={text} style={styles.icon} />
                <Text style={[styles.infoText, { color: text }]}>
                  {item.pets.join(', ')}
                </Text>
              </View>
            </View>
            
            {/* Footer con precio y acción */}
            <View style={styles.cardFooter}>
              <Text style={[styles.totalText, { color: tabIconSelected }]}>
                {item.total}
              </Text>
              
              <View style={styles.actionButton}>
                <Text style={[styles.actionText, { color: text }]}>Ver detalles</Text>
                <Ionicons name="chevron-forward" size={16} color={tabIconSelected} />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.title, { color: text }]}>
        Mis Reservas
      </Text>
      
      {mockBookings.length > 0 ? (
        <FlatList
          data={mockBookings}
          renderItem={renderBookingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="calendar" size={48} color={text} style={{ opacity: 0.3 }} />
          <Text style={[styles.emptyText, { color: text }]}>
            No tienes reservas aún
          </Text>
          <Text style={[styles.emptySubtext, { color: text }]}>
            Cuando hagas una reserva, aparecerá aquí
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24
  },
  listContent: {
    paddingBottom: 20
  },
  bookingCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardHeader: {
    position: 'relative',
    height: 160
  },
  placeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  cardContent: {
    padding: 16
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  bookingInfo: {
    marginBottom: 12
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.9
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionText: {
    fontSize: 14,
    marginRight: 4
  },
  icon: {
    opacity: 0.7
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    fontWeight: '500'
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    opacity: 0.6
  }
});