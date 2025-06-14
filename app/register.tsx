import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity
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
        celular: '',
        password: '',
        confirmPassword: '',
    });

    const [date, setDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const isAlphabetic = (text: string) => /^[a-zA-ZñÑ\s]+$/.test(text);

    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const calcularEdad = (fecha: Date) => {
        const hoy = new Date();
        let edad = hoy.getFullYear() - fecha.getFullYear();
        const mes = hoy.getMonth() - fecha.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
            edad--;
        }
        return edad;
    };

    const handleRegister = async () => {
        const {
            nombre, apellido1, apellido2, email, celular, password, confirmPassword
        } = form;

        if (!nombre || !apellido1 || !apellido2 || !email || !celular || !password || !confirmPassword || !date) {
            Alert.alert('Error', 'Por favor llena todos los campos.');
            return;
        }

        if (!isAlphabetic(nombre) || !isAlphabetic(apellido1) || !isAlphabetic(apellido2)) {
            Alert.alert('Error', 'Nombre y apellidos sólo deben contener letras.');
            return;
        }

        if (calcularEdad(date) < 18) {
            Alert.alert('Edad mínima requerida', 'Debes tener al menos 18 años para registrarte.');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Error', 'Ingresa un correo electrónico válido.');
            return;
        }

        if (!/^\d{10}$/.test(celular)) {
            Alert.alert('Error', 'Ingresa un número de celular válido (10 dígitos).');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await axios.post('http://192.168.1.152:3001/api/usuarios', {
                nombres: nombre,
                apellido1,
                apellido2,
                correo: email,
                celular,
                fechaNacimiento: date,
                contraseña: password,
            });

            Alert.alert('Éxito', 'Cuenta creada correctamente.', [
                { text: 'OK', onPress: () => router.replace('/') },
            ]);
        } catch (error: any) {
            const mensaje = error?.response?.data?.error || error.message || 'Hubo un problema al registrar';
            Alert.alert('Error', mensaje);
        }
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

                {[
                    { key: 'nombre', placeholder: 'Nombre(s)', capitalize: 'words' },
                    { key: 'apellido1', placeholder: 'Primer apellido', capitalize: 'words' },
                    { key: 'apellido2', placeholder: 'Segundo apellido', capitalize: 'words' },
                    { key: 'email', placeholder: 'Correo electrónico', capitalize: 'none', keyboardType: 'email-address' },
                    { key: 'celular', placeholder: 'Celular', capitalize: 'none', keyboardType: 'phone-pad' },
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

                <Text style={{
                    color: text,
                    textAlign: 'center',
                    marginTop: 20,
                    opacity: 0.8
                }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/" asChild>
                        <Text style={{
                            color: tabIconSelected,
                            textAlign: 'center',
                            marginTop: 20,
                        }}>
                            Inicia sesión
                        </Text>
                    </Link>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
