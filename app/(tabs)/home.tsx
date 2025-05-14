import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { mockPlaces } from '../../data/mockPlaces';
import { useTheme } from '../../hooks/useTheme';

export default function HomeScreen() {
  const { text, background, cardBackground, border, tabIconSelected } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.title, { color: text }]}>
        Lugares disponibles
      </Text>

      <FlatList
        data={mockPlaces}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => router.push({
              pathname: '/place',
              params: { id: item.id }
            })}
            activeOpacity={0.8}
          >
            <View style={[styles.card, { 
              backgroundColor: cardBackground, 
              borderColor: border 
            }]}>
              {/* Imagen del lugar */}
              <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
              />
              
              {/* Contenido de la tarjeta */}
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: text }]}>
                    {item.name}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color={tabIconSelected} />
                    <Text style={[styles.ratingText, { color: text }]}>
                      {item.rating}
                    </Text>
                  </View>
                </View>
                
                <Text 
                  style={[styles.cardLocation, { color: text }]}
                  numberOfLines={1}
                >
                  <Ionicons name="location-outline" size={14} />
                  {' '}{item.location}
                </Text>
                
                <Text 
                  style={[styles.cardDescription, { color: text }]} 
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
                
                <View style={styles.cardFooter}>
                  <Text style={[styles.cardPrice, { color: tabIconSelected }]}>
                    ${item.price} <Text style={{ color: text, opacity: 0.6 }}>/noche</Text>
                  </Text>
                  <View style={styles.amenitiesContainer}>
                    <Ionicons name="paw-outline" size={14} color={text} style={{ opacity: 0.6 }} />
                    <Text style={[styles.amenitiesText, { color: text }]} numberOfLines={1}>
                      {item.amenities.slice(0, 2).join(' • ')}
                      {item.amenities.length > 2 ? ' + más' : ''}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
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