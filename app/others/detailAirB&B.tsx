import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function AirbnbDetails() {
    const { text, background, cardBackground, border, tabIconSelected } = useTheme();

    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaceDetails = async () => {
            try {
                const id = await AsyncStorage.getItem('selectedPlaceId');
                if (!id) throw new Error('ID no encontrado en AsyncStorage');

                const response = await axios.get(`http://192.168.1.145:3001/airbnb/${id}`);
                setPlace(response.data);
            } catch (err) {
                setError(err.message || 'Error al obtener los detalles del lugar');
            } finally {
                setLoading(false);
            }
        };

        fetchPlaceDetails();
    }, []);

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: background }]}>
                <ActivityIndicator size="large" color={tabIconSelected} />
            </View>
        );
    }

    if (error || !place) {
        return (
            <View style={[styles.centered, { backgroundColor: background }]}>
                <Text style={{ color: text }}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: background }]}>
            <Image source={{ uri: place.imagen }} style={styles.image} />
            <View style={[styles.content, { backgroundColor: cardBackground, borderColor: border }]}>
                <Text style={[styles.title, { color: text }]}>{place.nombreLugar}</Text>
                <View style={styles.row}>
                    <Ionicons name="location-outline" size={18} color={tabIconSelected} />
                    <Text style={[styles.location, { color: text }]}>{place.ubicacion}</Text>
                </View>

                <Text style={[styles.description, { color: text }]}>{place.descripcion}</Text>

                <Text style={[styles.price, { color: tabIconSelected }]}>
                    ${place.precio}
                    <Text style={{ color: text, opacity: 0.6 }}> / noche</Text>
                </Text>

                {place.amenidades && place.amenidades.length > 0 && (
                    <>
                        <Text style={[styles.sectionTitle, { color: text }]}>Amenidades:</Text>
                        <View style={styles.amenitiesList}>
                            {place.amenidades.map((item, index) => (
                                <Text key={index} style={[styles.amenity, { color: text }]}>
                                    • {item}
                                </Text>
                            ))}
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: 220,
        resizeMode: 'cover'
    },
    content: {
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderWidth: 1,
        marginTop: -20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    location: {
        fontSize: 16,
        marginLeft: 6
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 16
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6
    },
    amenitiesList: {
        paddingLeft: 8
    },
    amenity: {
        fontSize: 14,
        marginBottom: 4
    }
});
