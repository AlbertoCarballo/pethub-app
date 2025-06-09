import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function EditProfileScreen() {
    const { text, background, cardBackground, buttonPrimary, border } = useTheme();
    const router = useRouter();

    const [form, setForm] = useState({
        nombres: '',
        apellido1: '',
        apellido2: '',
        correo: '',
        celular: '',
        fechaNacimiento: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const id = await AsyncStorage.getItem('idUsuario');
                if (!id) throw new Error('ID no encontrado');

                const res = await axios.get(`http://192.168.1.145:3001/api/usuarios/${id}`);
                setForm({
                    nombres: res.data.nombres || '',
                    apellido1: res.data.apellido1 || '',
                    apellido2: res.data.apellido2 || '',
                    correo: res.data.correo || '',
                    celular: res.data.celular || '',
                    fechaNacimiento: res.data.fechaNacimiento?.split('T')[0] || '',
                });
            } catch (err) {
                Alert.alert('Error', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const id = await AsyncStorage.getItem('idUsuario');
            if (!id) throw new Error('ID no encontrado');

            await axios.put(`http://192.168.1.145:3001/api/usuarios/${id}`, form);
            Alert.alert('Éxito', 'Perfil actualizado correctamente');
            router.push('/(tabs)/profile');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || error.message);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: text }}>Cargando...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: background }]} contentContainerStyle={styles.content}>
            <View style={[styles.card, { backgroundColor: cardBackground, borderColor: border }]}>
                {[
                    ['nombres', 'Nombres'],
                    ['apellido1', 'Primer Apellido'],
                    ['apellido2', 'Segundo Apellido'],
                    ['correo', 'Correo Electrónico'],
                    ['celular', 'Celular'],
                    ['fechaNacimiento', 'Fecha de Nacimiento (YYYY-MM-DD)'],
                ].map(([key, label]) => (
                    <View key={key} style={styles.inputGroup}>
                        <Text style={[styles.label, { color: text }]}>{label}</Text>
                        <TextInput
                            style={[styles.input, { color: text, borderColor: border }]}
                            value={form[key]}
                            onChangeText={(val) => handleChange(key, val)}
                            placeholderTextColor="#888"
                        />
                    </View>
                ))}

                <TouchableOpacity style={[styles.saveButton, { backgroundColor: buttonPrimary }]} onPress={handleSave}>
                    <Ionicons name="save-outline" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    card: {
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 12,
        marginTop: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 16,
    },
});
