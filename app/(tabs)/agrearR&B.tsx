import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface Booking {
  id: string;
  place: string;
  date: string;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
  image?: string;
  location: string;
  description: string;
}

export default function BookingsScreen() {
  const { text, background, cardBackground, border, buttonPrimary, tabIconSelected } = useTheme();
  const router = useRouter();
  
  const [newBooking, setNewBooking] = useState({
    place: '',
    location: '',
    description: '',
    date: new Date(),
    photo: null as string | null
  });

  const [bookings, setBookings] = useState<Booking[]>([
    { 
      id: '1', 
      place: 'Casa de Luna', 
      date: '15 Oct 2023', 
      status: 'Confirmada',
      location: 'Colonia Palmira, La Paz',
      description: 'Hogar tranquilo con jardín para mascotas',
      image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=500'
    },
    { 
      id: '2', 
      place: 'Guardería Peludos', 
      date: '20 Oct 2023', 
      status: 'Pendiente',
      location: 'Colonia Centro, La Paz',
      description: 'Guardería con veterinario 24/7 y área de juegos',
      image: 'https://images.unsplash.com/photo-1583511655826-05700442b31f?w=500'
    }
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleAddBooking = () => {
    if (!newBooking.place || !newBooking.location) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    const newBookingItem: Booking = {
      id: String(bookings.length + 1),
      place: newBooking.place,
      date: newBooking.date.toLocaleDateString('es-MX', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }),
      status: 'Pendiente',
      location: newBooking.location,
      description: newBooking.description,
      image: newBooking.photo || undefined
    };

    setBookings([newBookingItem, ...bookings]);
    setNewBooking({ 
      place: '', 
      location: '', 
      description: '', 
      date: new Date(), 
      photo: null 
    });
    
    Alert.alert('Éxito', 'Reservación agregada correctamente');
  };

  const handlePickImage = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Permiso requerido', 
        'Necesitamos acceso a tu cámara para tomar fotos',
        [{ text: 'OK', onPress: () => router.push('/settings') }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setNewBooking({ ...newBooking, photo: result.assets[0].uri });
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewBooking({ ...newBooking, date: selectedDate });
    }
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity 
      style={[styles.bookingCard, { backgroundColor: cardBackground, borderColor: border }]}
      onPress={() => router.push(`/booking/${item.id}`)}
      activeOpacity={0.9}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.bookingImage} />
      )}
      <View style={styles.bookingContent}>
        <View style={styles.bookingHeader}>
          <Text style={[styles.bookingTitle, { color: text }]}>{item.place}</Text>
          <View style={[
            styles.statusBadge, 
            { 
              backgroundColor: item.status === 'Confirmada' ? '#10B981' : 
                              item.status === 'Pendiente' ? '#F59E0B' : '#EF4444' 
            }
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <Text style={[styles.bookingDetail, { color: text }]}>
          <Ionicons name="location-outline" size={14} color={text} /> {item.location}
        </Text>
        
        <Text style={[styles.bookingDetail, { color: text }]}>
          <Ionicons name="calendar-outline" size={14} color={text} /> {item.date}
        </Text>
        
        {item.description && (
          <Text 
            style={[styles.bookingDescription, { color: text }]} 
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: text }]}>Mis Reservas</Text>
        <Text style={[styles.subtitle, { color: text }]}>
          {bookings.length} {bookings.length === 1 ? 'reserva' : 'reservas'}
        </Text>
      </View>

      {/* Formulario de nueva reserva */}
      <View style={[styles.formContainer, { backgroundColor: cardBackground, borderColor: border }]}>
        <Text style={[styles.sectionTitle, { color: text }]}>Agregar Nueva Reserva</Text>
        
        <TextInput
          style={[styles.input, { color: text, borderColor: border }]}
          placeholder="Nombre del lugar"
          placeholderTextColor={border}
          value={newBooking.place}
          onChangeText={(text) => setNewBooking({ ...newBooking, place: text })}
        />
        
        <TextInput
          style={[styles.input, { color: text, borderColor: border }]}
          placeholder="Ubicación"
          placeholderTextColor={border}
          value={newBooking.location}
          onChangeText={(text) => setNewBooking({ ...newBooking, location: text })}
        />
        
        <TouchableOpacity 
          style={[styles.dateButton, { borderColor: border }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar" size={18} color={text} />
          <Text style={[styles.dateText, { color: text }]}>
            {newBooking.date.toLocaleDateString('es-MX')}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={newBooking.date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        
        <TextInput
          style={[styles.textArea, { color: text, borderColor: border }]}
          placeholder="Descripción (opcional)"
          placeholderTextColor={border}
          value={newBooking.description}
          onChangeText={(text) => setNewBooking({ ...newBooking, description: text })}
          multiline
          numberOfLines={4}
        />
        
        <TouchableOpacity 
          style={[styles.photoButton, { borderColor: border }]}
          onPress={handlePickImage}
        >
          <Ionicons name="camera" size={20} color={text} />
          <Text style={[styles.photoText, { color: text }]}>
            {newBooking.photo ? 'Cambiar foto' : 'Agregar foto'}
          </Text>
        </TouchableOpacity>
        
        {newBooking.photo && (
          <Image 
            source={{ uri: newBooking.photo }} 
            style={styles.previewImage} 
          />
        )}
        
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: buttonPrimary }]}
          onPress={handleAddBooking}
        >
          <Text style={styles.submitText}>Agregar Reserva</Text>
          <Ionicons name="add-circle" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  formContainer: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    borderStyle: 'dashed',
  },
  photoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    marginTop: 8,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  bookingsList: {
    marginBottom: 20,
  },
  bookingCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bookingImage: {
    width: '100%',
    height: 160,
  },
  bookingContent: {
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  bookingDetail: {
    fontSize: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 8,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});