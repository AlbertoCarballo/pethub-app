import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function DetailsScreen() {
  const { bookingId } = useLocalSearchParams();
  const { text, background, cardBackground, border, tabIconSelected } = useTheme();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const response = await fetch(`http://192.168.1.152:3001/booking/${bookingId}`);
        if (!response.ok) throw new Error('No se pudo obtener la reserva');
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={tabIconSelected} />
      </View>
    );
  }

  if (error || !booking) {
    return (
      <View style={[styles.container, { backgroundColor: background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: text, fontSize: 16 }}>Error: {error || 'Reserva no encontrada'}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.title, { color: text }]}>Detalles de la Reserva</Text>

      <View style={[styles.card, { backgroundColor: cardBackground, borderColor: border }]}>
        <Text style={[styles.label, { color: text }]}>Lugar:</Text>
        <Text style={[styles.value, { color: text }]}>{booking.nombreLugar}</Text>

        <Text style={[styles.label, { color: text }]}>Fecha:</Text>
        <Text style={[styles.value, { color: text }]}>{formatDate(booking.fecha)}</Text>

        <Text style={[styles.label, { color: text }]}>Hora:</Text>
        <Text style={[styles.value, { color: text }]}>{booking.hora || 'No especificada'}</Text>

        <Text style={[styles.label, { color: text }]}>Días de estadía:</Text>
        <Text style={[styles.value, { color: text }]}>{booking.diasEstadia}</Text>

        <Text style={[styles.label, { color: text }]}>Precio total:</Text>
        <Text style={[styles.value, { color: tabIconSelected }]}>${booking.precio.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12
  },
  value: {
    fontSize: 16,
    marginTop: 4
  }
});
