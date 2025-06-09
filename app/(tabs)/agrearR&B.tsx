import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

interface RbnbData {
  place: string;
  pricePerNight: string;
  contactNumber: string;
  personInCharge: string;
  amenities: string;
  description: string;
  location: string;
  date: Date;
  photoUri: string | null;
}

interface AddRbnbFormProps {
  onSubmit: (data: RbnbData) => void;
}

export default function AddRbnbForm({ onSubmit }: AddRbnbFormProps) {
  const [form, setForm] = useState<RbnbData>({
    place: '',
    pricePerNight: '',
    contactNumber: '',
    personInCharge: '',
    amenities: '',
    description: '',
    location: '',
    date: new Date(),
    photoUri:
      'https://www.debate.com.mx/__export/1689595201325/sites/debate/img/2023/07/16/airbnb_perrito.jpg_242310155.jpg',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    Alert.alert('Funcionalidad temporal', 'La cámara está deshabilitada, usando imagen fija.');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setForm((f) => ({ ...f, date: selectedDate }));
    }
  };

  const handleChange = (field: keyof RbnbData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.place.trim() || !form.location.trim() || !form.pricePerNight.trim()) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios: lugar, ubicación y precio por noche.');
      return;
    }

    const payload = {
      nombreLugar: form.place,
      precioPorNoche: parseFloat(form.pricePerNight),
      ubicacion: form.location,
      numeroContacto: form.contactNumber,
      descripcion: form.description,
      amenidades: form.amenities.split(',').map((a) => a.trim()),
      personaACargo: form.personInCharge,
      imagen: form.photoUri,
      // fechaPublicacion se genera automáticamente
    };

    console.log('Payload a enviar:', payload);

    setLoading(true);
    try {
      const response = await axios.post('http://192.168.1.145:3001/airbnb', payload); // Ajusta tu IP local

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Éxito', 'RB&B guardado correctamente');
        onSubmit(form);
      } else {
        Alert.alert('Error', 'No se pudo guardar el RB&B. Intenta de nuevo.');
      }
    } catch (error: any) {
      console.log('Error al guardar RB&B:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar el RB&B.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Agregar RB&B</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del lugar *"
        value={form.place}
        onChangeText={(text) => handleChange('place', text)}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Precio Por Noche *"
        keyboardType="numeric"
        value={form.pricePerNight}
        onChangeText={(text) => handleChange('pricePerNight', text)}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Ubicación *"
        value={form.location}
        onChangeText={(text) => handleChange('location', text)}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Número de Contacto"
        keyboardType="phone-pad"
        value={form.contactNumber}
        onChangeText={(text) => handleChange('contactNumber', text)}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Persona a Cargo"
        value={form.personInCharge}
        onChangeText={(text) => handleChange('personInCharge', text)}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Amenidades (separadas por coma)"
        value={form.amenities}
        onChangeText={(text) => handleChange('amenities', text)}
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="calendar" size={22} color="#333" />
        <Text style={styles.dateText}>{form.date.toLocaleDateString('es-MX')}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={form.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción"
        multiline
        numberOfLines={4}
        value={form.description}
        onChangeText={(text) => handleChange('description', text)}
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={styles.photoButton}
        onPress={handlePickImage}
        activeOpacity={0.8}
      >
        <Ionicons name="camera" size={24} color="#10B981" />
        <Text style={styles.photoButtonText}>
          {form.photoUri ? 'Cambiar Foto' : 'Agregar Foto'}
        </Text>
      </TouchableOpacity>

      {form.photoUri && (
        <Image source={{ uri: form.photoUri }} style={styles.imagePreview} />
      )}

      <TouchableOpacity
        style={[styles.submitButton, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        activeOpacity={0.9}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Guardar RB&B</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1B1B1F',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    color: '#333',
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#1B1B1F',
  },
  photoButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#10B981',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
    backgroundColor: '#E6F4EA',
  },
  photoButtonText: {
    color: '#10B981',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 20,
  },
});
