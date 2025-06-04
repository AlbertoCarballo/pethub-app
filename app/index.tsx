import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function LoginScreen() {
  const {
    text,
    background,
    cardBackground,
    buttonPrimary,
    inputBorder,
    tabIconSelected
  } = useTheme();

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.142:3001/api/usuarios/login', {
        correo: email,
        contraseña: password,
      });

      // Si quieres guardar token o info, aquí la tienes en response.data

      Alert.alert('Éxito', 'Bienvenido', [
        {
          text: 'OK',
          onPress: () => router.replace('/home'),
        },
      ]);
    } catch (er) {
      // Si el er viene con mensaje del backend:
      if (er.response && er.response.data && er.response.data.er) {
        Alert.alert('Error', er.response.data.er);
      } else {
        Alert.alert('Error', 'No se pudo conectar con el servidor');
      }
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: background,
    }}>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: tabIconSelected,
        textAlign: 'center'
      }}>
        PetsHub
      </Text>

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
        placeholder="Correo electrónico"
        placeholderTextColor={text}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
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
        placeholder="Contraseña"
        placeholderTextColor={text}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={handleLogin}
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
      >
        <Text style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: 16,
        }}>
          Iniciar sesión
        </Text>
      </TouchableOpacity>

      <Text style={{
        color: text,
        textAlign: 'center',
        marginTop: 20,
        opacity: 0.8
      }}>
        ¿No tienes cuenta?{' '}
        <Link href="/register" asChild>
          <Text style={{ color: tabIconSelected, fontWeight: '500' }}>
            Regístrate
          </Text>
        </Link>
      </Text>
    </View>
  );
}
