import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function BookingsScreen() {
  const { text, background, cardBackground, border, tabIconSelected, buttonPrimary } = useTheme();
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch('http://192.168.1.152:3001/booking');
        if (!response.ok) throw new Error('Error al cargar las reservas');
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push('/others/details')}
      activeOpacity={0.9}
    >
      <View style={[styles.bookingCard, { backgroundColor: cardBackground, borderColor: border }]}>
        <View style={styles.cardContent}>
          <Text style={[styles.placeName, { color: text }]}>{item.nombreLugar}</Text>

          <View style={styles.bookingInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color={text} style={styles.icon} />
              <Text style={[styles.infoText, { color: text }]}>{formatDate(item.fecha)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color={text} style={styles.icon} />
              <Text style={[styles.infoText, { color: text }]}>{item.hora || 'Hora no especificada'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color={text} style={styles.icon} />
              <Text style={[styles.infoText, { color: text }]}>
                {item.diasEstadia} {item.diasEstadia > 1 ? 'días' : 'día'}
              </Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={[styles.totalText, { color: tabIconSelected }]}>${item.precio.toFixed(2)}</Text>
            <View style={styles.actionButton}>
              <Text style={[styles.actionText, { color: text }]}>Ver detalles</Text>
              <Ionicons name="chevron-forward" size={16} color={tabIconSelected} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={buttonPrimary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: text, fontSize: 16 }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.title, { color: text }]}>Mis Reservas</Text>

      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="calendar" size={48} color={text} style={{ opacity: 0.3 }} />
          <Text style={[styles.emptyText, { color: text }]}>No tienes reservas aún</Text>
          <Text style={[styles.emptySubtext, { color: text }]}>Cuando hagas una reserva, aparecerá aquí</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: buttonPrimary }]}
        onPress={() => router.push('/others/booking')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
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
    paddingBottom: 80
  },
  bookingCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16
  },
  cardContent: {},
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
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  }
});
