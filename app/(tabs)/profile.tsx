import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function ProfileScreen() {
  const { text, background, cardBackground, buttonPrimary, border } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: background, padding: 20 }}>
      <View style={{ 
        backgroundColor: cardBackground,
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: border,
        alignItems: 'center',
        marginBottom: 20
      }}>
        <View style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: border,
          marginBottom: 16
        }} />
        
        <Text style={{ color: text, fontSize: 20, fontWeight: 'bold' }}>
          Nombre Usuario
        </Text>
        <Text style={{ color: text, opacity: 0.8, marginTop: 4 }}>
          usuario@example.com
        </Text>
      </View>

      <TouchableOpacity style={{
        backgroundColor: buttonPrimary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center'
      }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Editar Perfil
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={{
        padding: 16,
        alignItems: 'center',
        marginTop: 12
      }}>
        <Text style={{ color: buttonPrimary }}>
          Cerrar Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}