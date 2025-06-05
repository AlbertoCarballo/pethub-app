import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function ProfileScreen() {
  const { text, background, cardBackground, buttonPrimary, border, tabIconSelected } = useTheme();
  const router = useRouter();

  const [users, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchUserAndPets = async () => {
      try {
        const id = await AsyncStorage.getItem('idUsuario');
        if (!id) throw new Error('No se encontró idUsuario en AsyncStorage');
  
        const userResponse = await axios.get(`http://192.168.1.142:3001/api/usuarios/${id}`);
        setUser(userResponse.data);
  
        const petsResponse = await axios.get(`http://192.168.1.142:3001/api/mascotas/usuario/${id}`);
        setPets(petsResponse.data);
        console.log(pets);  // para debug
      } catch (error) {
        console.error('Error al obtener datos:', error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserAndPets();
  }, []);

  // Datos del usuario
  const user = {
    name: users
      ? users.nombres + " " + users.apellido1 + (users.apellido2 ? " " + users.apellido2 : "")
      : "",
    email: users ? users.correo : "",
    phone: '+52 612 123 4567',
    joinDate: users && users.fechaNacimiento ? users.fechaNacimiento.split('T')[0] : "",
    pets: pets.length > 0 ? pets.map(pet => `${pet.nombre} (${pet.tipo})`) : [],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500',
    bookings: 12,
    favorites: 5
  };
  
  const handleEditProfile = () => {
    // router.push('/profile/edit');
  };

  const handleLogout = () => {
    console.log('Cerrando sesión...');
  };

  const handleAddPet = () => {
    router.push('/others/pets');
  };

  if (loading) {
    return (
      <View style={[styles.container, {backgroundColor: background, justifyContent: 'center', alignItems: 'center'}]}>
        <Text style={{color: text}}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header del perfil */}
      <View style={[styles.profileHeader, { backgroundColor: cardBackground, borderColor: border }]}>
        <Image 
          source={{ uri: user.avatar }} 
          style={styles.avatar}
        />
        <Text style={[styles.userName, { color: text }]}>{user.name}</Text>
        <Text style={[styles.userEmail, { color: text }]}>{user.email}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: tabIconSelected }]}>{user.bookings}</Text>
            <Text style={[styles.statLabel, { color: text }]}>Reservas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: tabIconSelected }]}>{user.favorites}</Text>
            <Text style={[styles.statLabel, { color: text }]}>Favoritos</Text>
          </View>
        </View>
      </View>

      {/* Sección de información */}
      <View style={[styles.infoSection, { backgroundColor: cardBackground, borderColor: border }]}>
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={20} color={text} style={styles.icon} />
          <Text style={[styles.infoText, { color: text }]}>{user.phone}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={20} color={text} style={styles.icon} />
          <Text style={[styles.infoText, { color: text }]}>{user.joinDate}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="paw-outline" size={20} color={text} style={styles.icon} />
          <Text style={[styles.infoText, { color: text }]}>
            Mascotas: {user.pets.length > 0 ? user.pets.join(', ') : '(No tienes mascotas)'}
          </Text>
        </View>
      </View>

      {/* Sección de acciones */}
      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: buttonPrimary }]}
          onPress={handleEditProfile}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={buttonPrimary} />
          <Text style={[styles.logoutText, { color: buttonPrimary }]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Opciones adicionales */}
      <View style={[styles.optionsSection, { backgroundColor: cardBackground, borderColor: border }]}>
        <TouchableOpacity 
          style={styles.optionItem} 
          onPress={handleAddPet}
        >
          <Ionicons name="paw-outline" size={20} color={text} />
          <Text style={[styles.optionText, { color: text }]}>Agregar Mascota</Text>
          <Ionicons name="chevron-forward" size={16} color={text} style={{ opacity: 0.5 }} />
        </TouchableOpacity>
        
        <View style={[styles.divider, { backgroundColor: border }]} />
        
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="help-circle-outline" size={20} color={text} />
          <Text style={[styles.optionText, { color: text }]}>Ayuda y Soporte</Text>
          <Ionicons name="chevron-forward" size={16} color={text} style={{ opacity: 0.5 }} />
        </TouchableOpacity>
        
        <View style={[styles.divider, { backgroundColor: border }]} />
        
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="document-text-outline" size={20} color={text} />
          <Text style={[styles.optionText, { color: text }]}>Términos y Privacidad</Text>
          <Ionicons name="chevron-forward" size={16} color={text} style={{ opacity: 0.5 }} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  profileHeader: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
  infoSection: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
    opacity: 0.8,
  },
  infoText: {
    fontSize: 15,
    flex: 1,
  },
  actionsSection: {
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  logoutText: {
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  optionsSection: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
  },
  divider: {
    height: 1,
    marginLeft: 48,
  },
});
