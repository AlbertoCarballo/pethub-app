import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function HomeScreen() {
  const { text, background, cardBackground, border, tabIconSelected } = useTheme();
  const router = useRouter();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://192.168.1.152:3001/airbnb');
        setPlaces(response.data);
      } catch (err) {
        setError(err.message || 'Error al obtener lugares');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={tabIconSelected} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: text }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.title, { color: text }]}>Lugares disponibles</Text>

      <FlatList
        data={places}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={async () => {
              try {
                await AsyncStorage.setItem('selectedPlaceId', item._id);
                router.push(`/others/details`);
              } catch (e) {
                console.error('Error guardando el ID en AsyncStorage', e);
                router.push(`/others/details`);
              }
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.card, { backgroundColor: cardBackground, borderColor: border }]}>
              <Image source={{ uri: item.imagen }} style={styles.cardImage} />

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: text }]}>{item.nombreLugar}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color={tabIconSelected} />
                    <Text style={[styles.ratingText, { color: text }]}>{item.rating ?? 'N/A'}</Text>
                  </View>
                </View>

                <Text style={[styles.cardLocation, { color: text }]} numberOfLines={1}>
                  <Ionicons name="location-outline" size={14} color={text} />
                  {' '}
                  {item.ubicacion}
                </Text>

                <Text style={[styles.cardDescription, { color: text }]} numberOfLines={2}>
                  {item.descripcion}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={[styles.cardPrice, { color: tabIconSelected }]}>
                    ${item.precio}{' '}
                    <Text style={{ color: text, opacity: 0.6 }}>/noche</Text>
                  </Text>
                  <View style={styles.amenitiesContainer}>
                    <Ionicons name="paw-outline" size={14} color={text} style={{ opacity: 0.6 }} />
                    <Text style={[styles.amenitiesText, { color: text }]} numberOfLines={1}>
                      {item.amenidades?.slice(0, 2).join(' • ')}
                      {item.amenidades && item.amenidades.length > 2 ? ' + más' : ''}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  listContent: {
    paddingBottom: 20
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover'
  },
  cardContent: {
    padding: 16
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '600'
  },
  cardLocation: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
    lineHeight: 20
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  amenitiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '50%'
  },
  amenitiesText: {
    fontSize: 12,
    opacity: 0.8,
    marginLeft: 4
  }
});
