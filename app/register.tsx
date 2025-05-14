import DateTimePicker from '@react-native-community/datetimepicker';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView, Platform,
    ScrollView,
    Text, TextInput, TouchableOpacity
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function RegisterScreen() {
    const router = useRouter();

    const {
        text,
        background,
        cardBackground,
        buttonPrimary,
        inputBorder,
        tabIconSelected
    } = useTheme();

    const [form, setForm] = useState({
        nombre: '',
        apellido1: '',
        apellido2: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [date, setDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const isAlphabetic = (text: string) => /^[a-zA-Zñ\s]+$/.test(text);

    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleRegister = () => {
        const {
            nombre, apellido1, apellido2, email, password, confirmPassword
        } = form;

        if (!nombre || !apellido1 || !apellido2 || !email || !password || !confirmPassword || !date) {
            Alert.alert('Error', 'Por favor llena todos los campos.');
            return;
        }

        if (!isAlphabetic(nombre) || !isAlphabetic(apellido1) || !isAlphabetic(apellido2)) {
            Alert.alert('Error', 'Nombre y apellidos sólo deben contener letras.');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Error', 'Ingresa un correo electrónico válido.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }

        // Aquí iría la lógica para registrar al usuario (ej. API call)
        Alert.alert('Éxito', 'Cuenta creada correctamente.', [
            {
                text: 'OK',
                onPress: () => router.replace('/'), // <-- Redirige al login
            },
        ]);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginBottom: 20,
                    color: tabIconSelected,
                    textAlign: 'center'
                }}>
                    Crear cuenta
                </Text>

                {/* Inputs */}
                {[
                    { key: 'nombre', placeholder: 'Nombre(s)', capitalize: 'words' },
                    { key: 'apellido1', placeholder: 'Primer apellido', capitalize: 'words' },
                    { key: 'apellido2', placeholder: 'Segundo apellido', capitalize: 'words' },
                    { key: 'email', placeholder: 'Correo electrónico', capitalize: 'none', keyboardType: 'email-address' }
                ].map(({ key, placeholder, capitalize = 'none', keyboardType = 'default' }) => (
                    <TextInput
                        key={key}
                        style={{
                            width: '100%',
                            height: 50,
                            borderWidth: 1,
                            borderColor: inputBorder,
                            borderRadius: 8,
                            padding: 15,
                            marginBottom: 15,
                            backgroundColor: cardBackground,
                            color: text,
                        }}
                        placeholder={placeholder}
                        placeholderTextColor={text}
                        autoCapitalize={capitalize as any}
                        keyboardType={keyboardType as any}
                        onChangeText={value => handleChange(key, value)}
                        value={form[key as keyof typeof form]}
                    />
                ))}

                {/* Fecha de nacimiento */}
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={{
                        borderWidth: 1,
                        borderColor: inputBorder,
                        borderRadius: 8,
                        padding: 15,
                        marginBottom: 15,
                        backgroundColor: cardBackground,
                    }}
                >
                    <Text style={{ color: text }}>
                        {date ? date.toLocaleDateString() : 'Fecha de nacimiento'}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        mode="date"
                        value={date || new Date()}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) setDate(selectedDate);
                        }}
                        maximumDate={new Date()}
                    />
                )}

                {/* Contraseña */}
                <TextInput
                    style={{
                        width: '100%',
                        height: 50,
                        borderWidth: 1,
                        borderColor: inputBorder,
                        borderRadius: 8,
                        padding: 15,
                        marginBottom: 15,
                        backgroundColor: cardBackground,
                        color: text,
                    }}
                    placeholder="Contraseña"
                    placeholderTextColor={text}
                    secureTextEntry
                    onChangeText={value => handleChange('password', value)}
                />
                <TextInput
                    style={{
                        width: '100%',
                        height: 50,
                        borderWidth: 1,
                        borderColor: inputBorder,
                        borderRadius: 8,
                        padding: 15,
                        marginBottom: 25,
                        backgroundColor: cardBackground,
                        color: text,
                    }}
                    placeholder="Confirmar contraseña"
                    placeholderTextColor={text}
                    secureTextEntry
                    onChangeText={value => handleChange('confirmPassword', value)}
                />

                {/* Botón de registro */}
                <TouchableOpacity
                    style={{
                        width: '100%',
                        height: 50,
                        backgroundColor: buttonPrimary,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                    onPress={handleRegister}
                >
                    <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 16,
                    }}>
                        Registrarse
                    </Text>
                </TouchableOpacity>

                {/* Link a Login */}
                <Link href="/" asChild>
                    <Text style={{
                        color: tabIconSelected,
                        textAlign: 'center',
                        marginTop: 20,
                    }}>
                        ¿Ya tienes cuenta? Inicia sesión
                    </Text>
                </Link>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
