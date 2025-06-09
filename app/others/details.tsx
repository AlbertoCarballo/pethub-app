import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function DetailsScreen() {
    const { text, background, cardBackground, border, tabIconSelected } = useTheme();

    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {
        const getIdFromStorage = async () => {
            try {
                const storedId = await AsyncStorage.getItem('selectedPlaceId');
                if (storedId) {
                    setId(storedId);
                } else {
                    setError('No se encontró ID para cargar detalles');
                    setLoading(false);
                }
            } catch (e) {
                setError('Error al obtener ID desde almacenamiento');
                setLoading(false);
            }
        };

        getIdFromStorage();
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchPlace = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://192.168.1.152:3001/airbnb/${id}`);
                if (!response.data) {
                    setError('No se encontró el lugar');
                    setPlace(null);
                } else {
                    setPlace(response.data);
                    setError(null);
                }
            } catch (err) {
                setError(err.message || 'Error al obtener detalles');
                setPlace(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPlace();
    }, [id]);

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
                <Text style={{ color: text, fontSize: 16 }}>{error}</Text>
            </View>
        );
    }

    if (!place) {
        return (
            <View style={[styles.container, { backgroundColor: background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: text, fontSize: 16 }}>No hay datos para mostrar.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: background }]}>
            <Image source={{ uri: place.imagen }} style={styles.image} />

            <View style={[styles.content, { backgroundColor: cardBackground, borderColor: border }]}>
                <Text style={[styles.title, { color: text }]}>{place.nombreLugar}</Text>

                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={18} color={tabIconSelected} />
                    <Text style={[styles.ratingText, { color: text }]}>{place.rating ?? 'N/A'}</Text>
                </View>

                <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={16} color={text} />
                    <Text style={[styles.locationText, { color: text }]}>{place.ubicacion}</Text>
                </View>

                <Text style={[styles.description, { color: text }]}>{place.descripcion}</Text>

                <Text style={[styles.price, { color: tabIconSelected }]}>
                    ${place.precio} <Text style={{ color: text, opacity: 0.7 }}>/noche</Text>
                </Text>

                <View style={styles.amenitiesContainer}>
                    <Ionicons name="paw-outline" size={16} color={text} />
                    <Text style={[styles.amenitiesText, { color: text }]}>
                        {place.amenidades?.join(' • ')}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 240,
        resizeMode: 'cover',
    },
    content: {
        margin: 16,
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        marginLeft: 6,
        fontWeight: '600',
        fontSize: 16,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationText: {
        marginLeft: 6,
        fontSize: 16,
        opacity: 0.8,
    },
    description: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 16,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    amenitiesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amenitiesText: {
        marginLeft: 8,
        fontSize: 14,
        opacity: 0.8,
        flexShrink: 1,
    },
});
