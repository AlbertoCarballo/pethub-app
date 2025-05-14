import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react'; // Para manejar el estado de favoritos
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  const [isFavorite, setIsFavorite] = useState(false); // Estado para favoritos
  const place = mockPlaces.find((item) => item.id === id);

  if (!place) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: background }}>
        <Text style={{ color: text }}>Lugar no encontrado</Text>
      </View>
    );
  }

  // Galería de imágenes de ejemplo (puedes reemplazar con place.images si existe)
  const galleryImages = [
    place.image,
    'https://placekitten.com/400/200',
    'https://placekitten.com/500/200',
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: background }}>
      {/* --- Sección de imagen principal y favoritos --- */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: place.image }}
          style={styles.mainImage}
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? '#FF3B30' : tabIconSelected} 
          />
        </TouchableOpacity>
      </View>

      {/* --- Contenido principal --- */}
      <View style={{ padding: 20 }}>

        {/* Nombre y rating */}
        <View style={styles.titleContainer}>
          <Text style={[styles.placeName, { color: text }]}>
            {place.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color={tabIconSelected} />
            <Text style={{ color: text, marginLeft: 5 }}>{place.rating}</Text>
          </View>
        </View>

        {/* Ubicación */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={18} color={text} style={{ opacity: 0.6 }} />
          <Text style={[styles.locationText, { color: text }]}>{place.location}</Text>
        </View>

        {/* --- Galería de imágenes (Bonus 1) --- */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.galleryContainer}
        >
          {galleryImages.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={styles.galleryImage}
            />
          ))}
        </ScrollView>

        {/* Descripción */}
        <View style={[styles.descriptionContainer, { 
          backgroundColor: cardBackground, 
          borderColor: inputBorder 
        }]}>
          <Text style={[styles.descriptionText, { color: text }]}>
            {place.description}
          </Text>
        </View>

        {/* --- Mapa interactivo (Bonus 3) --- */}
        <TouchableOpacity 
          style={[styles.mapContainer, { 
            backgroundColor: cardBackground, 
            borderColor: inputBorder 
          }]}
          onPress={() => console.log('Abrir mapa completo')} // Aquí puedes integrar tu mapa real
        >
          <Ionicons name="map-outline" size={40} color={text} style={{ opacity: 0.5 }} />
          <Text style={[styles.mapText, { color: text }]}>Ver en mapa</Text>
          <Text style={[styles.mapSubtext, { color: text }]}>{place.location}</Text>
        </TouchableOpacity>

        {/* --- Detalles (Precio, Amenities) --- */}
        <View style={[styles.detailsContainer, { 
          backgroundColor: cardBackground, 
          borderColor: inputBorder 
        }]}>
          <View style={styles.detailRow}>
            <Ionicons name="pricetag-outline" size={20} color={text} style={{ opacity: 0.6 }} />
            <Text style={[styles.detailText, { color: text }]}>
              <Text style={{ fontWeight: 'bold' }}>Precio:</Text> ${place.price} por noche
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="paw-outline" size={20} color={text} style={{ opacity: 0.6 }} />
            <View style={{ marginLeft: 10 }}>
              <Text style={[styles.detailTitle, { color: text }]}>Amenities:</Text>
              <Text style={[styles.detailSubtext, { color: text }]}>
                {place.amenities.join(' • ')}
              </Text>
            </View>
          </View>
        </View>

        {/* --- Botón de reserva --- */}
        <TouchableOpacity
          style={[styles.reserveButton, { backgroundColor: buttonPrimary }]}
          onPress={() => console.log('Reserva iniciada')}
        >
          <Text style={styles.reserveButtonText}>Reservar ahora</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Estilos optimizados (mejor organización)
const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  placeName: {
    fontSize: 24,
    fontWeight: 'bold',
    flexShrink: 1, // Evita desbordamiento en nombres largos
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationText: {
    opacity: 0.8,
    marginLeft: 5,
  },
  galleryContainer: {
    marginVertical: 15,
  },
  galleryImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  descriptionContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  descriptionText: {
    lineHeight: 22,
  },
  mapContainer: {
    borderRadius: 12,
    height: 120,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mapText: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  mapSubtext: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  detailsContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
  },
  detailTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailSubtext: {
    opacity: 0.8,
  },
  reserveButton: {
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  reserveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
});