import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Image, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const mockBookings = [
    { id: '1', place: 'Casa de Luna', date: '15 Oct 2023', status: 'Confirmada' },
    { id: '2', place: 'Guardería Peludos', date: '20 Oct 2023', status: 'Pendiente' }
];

export default function BookingsScreen() {
    const { text, background, cardBackground, border } = useTheme();
    const [newBooking, setNewBooking] = useState({
        place: '',
        location: '',
        description: '',
        photo: null
    });

    const [bookings, setBookings] = useState(mockBookings);

    // Estado para verificar si los permisos están concedidos
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    // Solicitar permisos para la cámara
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleAddBooking = () => {
        const newBookingItem = {
            id: String(bookings.length + 1),
            place: newBooking.place,
            date: new Date().toLocaleDateString(),
            status: 'Pendiente'
        };

        setBookings([...bookings, newBookingItem]);
        setNewBooking({ place: '', location: '', description: '', photo: null });
    };

    const handlePickImage = async () => {
        if (!hasPermission) {
            alert('Permiso de cámara no concedido.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setNewBooking({ ...newBooking, photo: result.uri });
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: background, padding: 16 }}>
            <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: text,
                marginBottom: 20
            }}>
                Mis Reservas
            </Text>

            <Text style={{
                fontSize: 18,
                color: text,
                marginBottom: 10
            }}>
                Agregar Nueva Reservación
            </Text>

            {/* Formulario para ingresar la nueva reservación */}
            <TextInput
                style={{ 
                    height: 40, 
                    borderColor: border, 
                    borderWidth: 1, 
                    marginBottom: 12, 
                    paddingLeft: 8,
                    color: text
                }}
                placeholder="Nombre del R&B"
                placeholderTextColor={border}
                value={newBooking.place}
                onChangeText={(text) => setNewBooking({ ...newBooking, place: text })}
            />
            <TextInput
                style={{ 
                    height: 40, 
                    borderColor: border, 
                    borderWidth: 1, 
                    marginBottom: 12, 
                    paddingLeft: 8,
                    color: text
                }}
                placeholder="Localización"
                placeholderTextColor={border}
                value={newBooking.location}
                onChangeText={(text) => setNewBooking({ ...newBooking, location: text })}
            />
            <TextInput
                style={{ 
                    height: 80, 
                    borderColor: border, 
                    borderWidth: 1, 
                    marginBottom: 12, 
                    paddingLeft: 8,
                    color: text
                }}
                placeholder="Descripción"
                placeholderTextColor={border}
                value={newBooking.description}
                onChangeText={(text) => setNewBooking({ ...newBooking, description: text })}
                multiline
            />

            {/* Botón para tomar una foto */}
            <Button title="Tomar Foto" onPress={handlePickImage} />

            {newBooking.photo && (
                <Image 
                    source={{ uri: newBooking.photo }} 
                    style={{ width: 200, height: 200, marginTop: 12, borderRadius: 10 }} 
                />
            )}

            {/* Botón para agregar la nueva reservación */}
            <Button title="Agregar Reservación" onPress={handleAddBooking} />

            <FlatList
                data={bookings}
                renderItem={({ item }) => (
                    <View style={{
                        backgroundColor: cardBackground,
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor: border
                    }}>
                        <Text style={{ color: text, fontWeight: 'bold', fontSize: 18 }}>
                            {item.place}
                        </Text>
                        <Text style={{ color: text, marginTop: 4 }}>Fecha: {item.date}</Text>
                        <Text style={{
                            color: item.status === 'Confirmada' ? '#4ECDC4' : '#FF6B6B',
                            marginTop: 8
                        }}>
                            {item.status}
                        </Text>
                    </View>
                )}
                keyExtractor={item => item.id}
            />
        </View>
    );
}
