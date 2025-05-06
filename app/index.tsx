import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const { 
    text, 
    background, 
    cardBackground, 
    buttonPrimary, 
    inputBorder,
    tabIconSelected
  } = useTheme();

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: background,
    }}>
      {/* Título */}
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: tabIconSelected,
        textAlign: 'center'
      }}>
        PetsHub
      </Text>

      {/* Input Email */}
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
      />

      {/* Input Contraseña */}
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
      />

      {/* Botón */}
      <Link href="/home" asChild>
        <TouchableOpacity style={{
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
        }}>
          <Text style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
          }}>
            Iniciar sesión
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Enlace adicional (opcional) */}
      <Text style={{
        color: text,
        textAlign: 'center',
        marginTop: 20,
        opacity: 0.8
      }}>
        ¿No tienes cuenta?{' '}
        <Text style={{ color: tabIconSelected, fontWeight: '500' }}>
          Regístrate
        </Text>
      </Text>
    </View>
  );
}