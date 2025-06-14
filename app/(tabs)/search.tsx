import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router'; // <-- importar useRouter
import { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function SearchScreen() {
  const { text, background, cardBackground, inputBorder, tabIconSelected } = useTheme();
  const router = useRouter(); // <-- crear instancia router

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [allPlaces, setAllPlaces] = useState([]); // almacena todos los lugares
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const availableFilters = [
    'Con patio', '24/7', 'Veterinario', 'Piscina',
    'Aire acondicionado', 'Guardería', 'Paseos diarios'
  ];

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://192.168.1.152:3001/airbnb');
        setAllPlaces(response.data);
        setFilteredPlaces(response.data);
      } catch (error) {
        console.error('Error al cargar lugares:', error);
      }
    };

    fetchPlaces();
  }, []);

  useEffect(() => {
    const results = allPlaces.filter(place => {
      const matchesSearch = place.nombreLugar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters = activeFilters.length === 0 ||
        activeFilters.some(filter => place.amenidades.includes(filter));

      return matchesSearch && matchesFilters;
    });

    setFilteredPlaces(results);
  }, [searchQuery, activeFilters, allPlaces]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: background, padding: 16 }}>
      {/* Barra de búsqueda */}
      <View style={{
        backgroundColor: cardBackground,
        borderRadius: 12,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: inputBorder,
        marginBottom: 20
      }}>
        <Ionicons name="search" size={20} color={text} style={{ opacity: 0.6 }} />
        <TextInput
          style={{
            flex: 1,
            height: 50,
            color: text,
            paddingLeft: 10
          }}
          placeholder="Buscar lugares..."
          placeholderTextColor={text}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={text} style={{ opacity: 0.6 }} />
          </TouchableOpacity>
        )}
      </View>

      {/* Sección de filtros */}
      <Text style={{ color: text, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
        Filtros populares
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
      >
        {availableFilters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleFilter(filter)}
            style={{
              backgroundColor: activeFilters.includes(filter) ? tabIconSelected : cardBackground,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 8,
              borderWidth: 1,
              borderColor: inputBorder
            }}
          >
            <Text style={{
              color: activeFilters.includes(filter) ? 'white' : text,
              fontSize: 14
            }}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Resultados de búsqueda */}
      <Text style={{
        color: text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16
      }}>
        {filteredPlaces.length} {filteredPlaces.length === 1 ? 'resultado' : 'resultados'}
      </Text>

      {filteredPlaces.length > 0 ? (
        <FlatList
          data={filteredPlaces}
          keyExtractor={item => item._id} // o item.id según tu API
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/place?id=${item._id}`)} // <--- navegación con id
              style={{
                backgroundColor: cardBackground,
                borderRadius: 12,
                marginBottom: 16,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: inputBorder
              }}
            >
              <Image
                source={{ uri: item.imagen }} // nombre del campo en tu API
                style={{ width: '100%', height: 150 }}
              />
              <View style={{ padding: 16 }}>
                <Text style={{
                  color: text,
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 4
                }}>
                  {item.nombreLugar}
                </Text>
                <Text
                  style={{
                    color: text,
                    opacity: 0.8,
                    marginBottom: 8
                  }}
                  numberOfLines={2}
                >
                  {item.descripcion}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="location-outline" size={16} color={text} style={{ opacity: 0.6 }} />
                  <Text style={{
                    color: text,
                    opacity: 0.8,
                    marginLeft: 4,
                    fontSize: 14
                  }}>
                    {item.ubicacion}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 40
        }}>
          <Ionicons name="search" size={48} color={text} style={{ opacity: 0.3, marginBottom: 16 }} />
          <Text style={{
            color: text,
            opacity: 0.6,
            fontSize: 16,
            textAlign: 'center'
          }}>
            No se encontraron resultados para tu búsqueda
          </Text>
        </View>
      )}
    </View>
  );
}
