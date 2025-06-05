import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function RegisterPetScreen() {
    const { background, text, cardBackground, buttonPrimary, border } = useTheme();
    const router = useRouter();

    const [name, setName] = useState('');
    const [tipo, setTipo] = useState('perro');  // Valor inicial
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');

    const tipos = ['perro', 'gato', 'otro'];

    const handleSubmit = async () => {
        if (!name || !tipo || !breed || !age) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        try {
            const usuarioId = await AsyncStorage.getItem('idUsuario');
            console.log('ID usuario desde AsyncStorage:', usuarioId);  // <-- Aquí imprimes

            if (!usuarioId) {
                Alert.alert('Error', 'Usuario no encontrado. Por favor inicia sesión de nuevo.');
                return;
            }

            const response = await axios.post('http://192.168.1.142:3001/api/mascotas', {
                nombre: name,
                tipo: tipo,
                raza: breed,
                edad: parseInt(age),
                usuario: usuarioId,
            });

            if (response.status === 201 || response.status === 200) {
                Alert.alert('Éxito', 'Mascota registrada correctamente');
                router.push('/(tabs)/profile');
            } else {
                Alert.alert('Error', 'No se pudo registrar la mascota');
            }
        } catch (error) {
            console.error('Error al registrar mascota:', error);
            Alert.alert('Error', 'Ocurrió un error al registrar la mascota');
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[styles.container, { backgroundColor: background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={[styles.formContainer, { backgroundColor: cardBackground, borderColor: border }]}>
                    <Text style={[styles.title, { color: text }]}>Registrar Mascota</Text>

                    <TextInput
                        style={[styles.input, { borderColor: border, color: text }]}
                        placeholder="Nombre"
                        placeholderTextColor={text + '99'}
                        value={name}
                        onChangeText={setName}
                    />

                    {/* Selector tipo */}
                    <View style={[styles.pickerContainer, { borderColor: border }]}>
                        {tipos.map((t) => (
                            <TouchableOpacity
                                key={t}
                                style={[
                                    styles.tipoButton,
                                    {
                                        backgroundColor: tipo === t ? buttonPrimary : 'transparent',
                                        borderColor: border,
                                    },
                                ]}
                                onPress={() => setTipo(t)}
                            >
                                <Text style={{ color: tipo === t ? 'white' : text, fontWeight: 'bold' }}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        style={[styles.input, { borderColor: border, color: text }]}
                        placeholder="Raza"
                        placeholderTextColor={text + '99'}
                        value={breed}
                        onChangeText={setBreed}
                    />

                    <TextInput
                        style={[styles.input, { borderColor: border, color: text }]}
                        placeholder="Edad (años)"
                        placeholderTextColor={text + '99'}
                        keyboardType="numeric"
                        value={age}
                        onChangeText={setAge}
                    />

                    <TouchableOpacity
                        style={[styles.submitButton, { backgroundColor: buttonPrimary }]}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.submitButtonText}>Registrar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    formContainer: {
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 10,
    },
    tipoButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
    },
    submitButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
