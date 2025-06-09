import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';

export default function CreateBookingScreen() {
    const router = useRouter();

    const [lugares, setLugares] = useState([]);
    const [lugarSeleccionado, setLugarSeleccionado] = useState('');
    const [fecha, setFecha] = useState(new Date());
    const [hora, setHora] = useState('');
    const [precio, setPrecio] = useState('');
    const [diasEstadia, setDiasEstadia] = useState('');
    const [direccion, setDireccion] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        // Inicializar hora con la hora actual en formato HH:mm
        const ahora = new Date();
        const horaActual = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setHora(horaActual);

        // Cargar lugares
        const fetchLugares = async () => {
            try {
                const response = await axios.get('http://192.168.1.152:3001/airbnb');
                setLugares(response.data);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudieron cargar los lugares');
            }
        };
        fetchLugares();
    }, []);

    const handleLugarChange = (nombreLugar) => {
        setLugarSeleccionado(nombreLugar);
        const lugar = lugares.find((l) => (l.nombreLugar ?? l.nombre) === nombreLugar);
        if (lugar) {
            const precioLugar = lugar.precioPorNoche ?? lugar.precio ?? '';
            setPrecio(String(precioLugar));
            setDireccion(lugar.direccion ?? '');
        } else {
            setPrecio('');
            setDireccion('');
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) setFecha(selectedDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            // Formatear hora en HH:mm
            const horaFormateada = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setHora(horaFormateada);
        }
    };

    const handleSubmit = async () => {
        try {
            const idUser = await AsyncStorage.getItem('idUsuario');
            const nombreUsuario = await AsyncStorage.getItem('nombreUsuario');

            if (!idUser || !nombreUsuario) {
                Alert.alert('Error', 'No se encontró el usuario');
                return;
            }

            if (!lugarSeleccionado) {
                Alert.alert('Error', 'Debes seleccionar un lugar');
                return;
            }

            if (!hora) {
                Alert.alert('Error', 'Debes ingresar la hora');
                return;
            }

            if (!diasEstadia || isNaN(parseInt(diasEstadia)) || parseInt(diasEstadia) <= 0) {
                Alert.alert('Error', 'Debes ingresar un número válido de días de estadía');
                return;
            }

            const nuevaReserva = {
                nombreLugar: lugarSeleccionado,
                fecha,
                hora,
                precio: parseFloat(precio),
                diasEstadia: parseInt(diasEstadia),
                direccion,
                idUser,
                nombreUsuario
            };

            await axios.post('http://192.168.1.152:3001/booking', nuevaReserva);
            Alert.alert('Éxito', 'Reserva creada correctamente');

            // Reset campos
            setLugarSeleccionado('');
            setHora('');
            setPrecio('');
            setDiasEstadia('');
            setDireccion('');
            setFecha(new Date());

            // Navegar a la pantalla de reservas
            router.push('/(tabs)/bookings');

        } catch (error) {
            console.error(error.message);
            Alert.alert('Error', 'No se pudo crear la reserva');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nueva Reserva</Text>

            <View style={[styles.pickerWrapper, { backgroundColor: 'black' }]}>
                <Picker
                    selectedValue={lugarSeleccionado}
                    onValueChange={handleLugarChange}
                    dropdownIconColor="white"
                    style={{ color: 'white' }}
                >
                    <Picker.Item label="Selecciona un lugar" value="" color="#aaa" />
                    {lugares.map((lugar) => (
                        <Picker.Item
                            key={lugar._id}
                            label={lugar.nombreLugar ?? lugar.nombre ?? 'Sin nombre'}
                            value={lugar.nombreLugar ?? lugar.nombre ?? ''}
                            color="white"
                        />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                <Text>{fecha.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={fecha}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
                <Text>{hora}</Text>
            </TouchableOpacity>

            {showTimePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleTimeChange}
                />
            )}

            <TextInput
                style={styles.input}
                placeholder="Precio"
                keyboardType="numeric"
                value={precio}
                editable={false}
            />

            <TextInput
                style={styles.input}
                placeholder="Días de estadía"
                keyboardType="numeric"
                value={diasEstadia}
                onChangeText={setDiasEstadia}
            />

            <TextInput
                style={styles.input}
                placeholder="Dirección"
                value={direccion}
                editable={false}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Crear Reserva</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        justifyContent: 'center',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: 'black',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
