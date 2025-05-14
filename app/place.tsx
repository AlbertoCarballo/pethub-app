import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons
import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { mockPlaces } from '../data/mockPlaces';
import { useTheme } from '../hooks/useTheme';

export default function PlaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    text,
    background,
    cardBackground,
    buttonPrimary,
    inputBorder,
    tabIconSelected,
  } = useTheme();

  const place = mockPlaces.find((item) => item.id === id);

  if (!place) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: background }}>
        <Text style={{ color: text }}>Lugar no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: background }}>
      {/* Imagen principal */}
      <Image
        source={{ uri: place.image }}
        style={{ width: '100%', height: 250, resizeMode: 'cover' }}
      />

      {/* Contenido */}
      <View style={{ padding: 20 }}>
        {/* Nombre y rating */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: text }}>
            {place.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={20} color={tabIconSelected} />
            <Text style={{ color: text, marginLeft: 5 }}>{place.rating}</Text>
          </View>
        </View>

        {/* Ubicación */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <Ionicons name="location-outline" size={18} color={text} style={{ opacity: 0.6 }} />
          <Text style={{ color: text, opacity: 0.8, marginLeft: 5 }}>{place.location}</Text>
        </View>

        {/* Descripción */}
        <View style={{
          backgroundColor: cardBackground,
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: inputBorder,
        }}>
          <Text style={{ color: text, lineHeight: 22 }}>{place.description}</Text>
        </View>

        {/* Detalles (Precio, Amenities) */}
        <View style={{
          backgroundColor: cardBackground,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: inputBorder,
          marginBottom: 20,
        }}>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Ionicons name="pricetag-outline" size={20} color={text} style={{ opacity: 0.6 }} />
            <Text style={{ color: text, marginLeft: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Precio:</Text> ${place.price} por noche
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons name="paw-outline" size={20} color={text} style={{ opacity: 0.6 }} />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ color: text, fontWeight: 'bold', marginBottom: 5 }}>Amenities:</Text>
              <Text style={{ color: text, opacity: 0.8 }}>
                {place.amenities.join(' • ')}
              </Text>
            </View>
          </View>
        </View>

        {/* Botón de reserva */}
        <TouchableOpacity
          style={{
            backgroundColor: buttonPrimary,
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            Reservar ahora
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}