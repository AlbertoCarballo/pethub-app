import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

  const [isFavorite, setIsFavorite] = useState(false);

  const place = mockPlaces.find((item) => item.id === id);

  if (!place) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: background }}>
        <Text style={{ color: text }}>Lugar no encontrado</Text>
      </View>
    );
  }

  // Galería segura: incluye imágenes sólo si existen
  const galleryImages = [place.image, ...(place.galleryImages || [])].filter(Boolean);

  // Función para alternar favorito, se puede extender para guardar en localStorage/async storage
  const toggleFavorite = useCallback(() => {
    setIsFavorite((fav) => !fav);
    // Aquí podrías agregar lógica para guardar favoritos en storage o backend
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: background }}>
      {/* Imagen principal + favorito */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: place.image || 'https://placekitten.com/800/400' }}
          style={styles.mainImage}
          accessibilityLabel={`Imagen principal de ${place.name}`}
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
          accessibilityHint="Agrega o quita este lugar de tus favoritos"
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? '#FF3B30' : tabIconSelected}
          />
        </TouchableOpacity>
      </View>

      <View style={{ padding: 20 }}>
        {/* Nombre y rating */}
        <View style={styles.titleContainer}>
          <Text style={[styles.placeName, { color: text }]} numberOfLines={2}>
            {place.name}
          </Text>
          <View style={styles.ratingContainer} accessible accessibilityLabel={`Calificación: ${place.rating} estrellas`}>
            <Ionicons name="star" size={20} color={tabIconSelected} />
            <Text style={{ color: text, marginLeft: 5 }}>{place.rating}</Text>
          </View>
        </View>

        {/* Ubicación */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={18} color={text} style={{ opacity: 0.6 }} />
          <Text style={[styles.locationText, { color: text }]}>{place.location}</Text>
        </View>

        {/* Galería horizontal */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryContainer}>
          {galleryImages.map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img }}
              style={styles.galleryImage}
              accessibilityLabel={`Imagen adicional ${idx + 1} de ${place.name}`}
            />
          ))}
        </ScrollView>

        {/* Descripción */}
        <View style={[styles.descriptionContainer, { backgroundColor: cardBackground, borderColor: inputBorder }]}>
          <Text style={[styles.descriptionText, { color: text }]}>
            {place.description}
          </Text>
        </View>

        {/* Mapa interactivo */}
        <TouchableOpacity
          style={[styles.mapContainer, { backgroundColor: cardBackground, borderColor: inputBorder }]}
          onPress={() => Alert.alert('Mapa', 'Aquí puedes integrar el mapa completo')}
          accessibilityRole="button"
          accessibilityLabel="Ver ubicación en mapa"
        >
          <Ionicons name="map-outline" size={40} color={text} style={{ opacity: 0.5 }} />
          <Text style={[styles.mapText, { color: text }]}>Ver en mapa</Text>
          <Text style={[styles.mapSubtext, { color: text }]}>{place.location}</Text>
        </TouchableOpacity>

        {/* Detalles */}
        <View style={[styles.detailsContainer, { backgroundColor: cardBackground, borderColor: inputBorder }]}>
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
                {place.amenities?.length ? place.amenities.join(' • ') : 'No especificado'}
              </Text>
            </View>
          </View>
        </View>

        {/* Botón reserva */}
        <TouchableOpacity
          style={[styles.reserveButton, { backgroundColor: buttonPrimary }]}
          onPress={() => Alert.alert('Reserva', 'Reserva iniciada')}
          accessibilityRole="button"
          accessibilityLabel="Reservar ahora"
        >
          <Text style={styles.reserveButtonText}>Reservar ahora</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
