// data/mockPlaces.ts
export interface Place {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    rating: number;
    amenities: string[];
    location: string;
    host: string;
  }
  
  export const mockPlaces: Place[] = [
    {
      id: '1',
      name: 'Guardería "El Arenal"',
      description: 'Patio grande con alberca para perros y atención veterinaria incluida',
      price: '$200/día',
      image: 'https://images.unsplash.com/photo-1583511655826-05700442b31f?w=600',
      rating: 4.8,
      amenities: ['Alberca', 'Veterinario 24/7', 'Área de juegos', 'Cámaras'],
      location: 'Colonia Centro, La Paz',
      host: 'María Rodríguez'
    },
    {
      id: '2',
      name: 'Casa de Luna',
      description: 'Hogar tranquilo con jardín sombreado ideal para perros mayores',
      price: '$150/día',
      image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=600',
      rating: 4.9,
      amenities: ['Jardín', 'Aire acondicionado', 'Paseos diarios'],
      location: 'Colonia Palmira, La Paz',
      host: 'Carlos Mendoza'
    },
    {
      id: '3',
      name: 'Paraíso Peludo',
      description: 'Guardería premium con spa y entrenamiento básico incluido',
      price: '$300/día',
      image: 'https://images.unsplash.com/photo-1551189011-57c5d32502f3?w=600',
      rating: 4.7,
      amenities: ['Spa', 'Entrenamiento', 'Transporte', 'Reportes diarios'],
      location: 'Colonia Fidepaz, La Paz',
      host: 'Ana Martínez'
    },
    {
      id: '4',
      name: 'Hogar Temporal Mascotas',
      description: 'Experiencia familiar para tu mascota con mucho espacio interior',
      price: '$180/día',
      image: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=600',
      rating: 4.6,
      amenities: ['Familiar', 'Cocina especial', 'Área interior grande'],
      location: 'Colonia Esterito, La Paz',
      host: 'Familia López'
    },
    {
      id: '5',
      name: 'Play Dogs',
      description: 'Acceso directo a playa privada para perros amantes del agua',
      price: '$250/día',
      image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600',
      rating: 4.9,
      amenities: ['Playa privada', 'Duchas', 'Salvavidas', 'Restaurante pet-friendly'],
      location: 'Pichilingue, La Paz',
      host: 'Roberto Castro'
    },
    {
      id: '6',
      name: 'Cat Lounge',
      description: 'Espacio exclusivo para gatos con torres de juego y áreas de descanso',
      price: '$170/día',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600',
      rating: 4.5,
      amenities: ['Área felina', 'Veterinario especializado', 'Juguetes interactivos'],
      location: 'Colonia Marquez de León, La Paz',
      host: 'Laura Jiménez'
    }
  ];
  
  // Tipos adicionales para filtros
  export const amenityFilters = [
    'Alberca',
    'Veterinario',
    'Jardín',
    'Spa',
    'Entrenamiento',
    'Playa',
    'Área felina'
  ];
  
  export const locationFilters = [
    'Centro',
    'Palmira',
    'Fidepaz',
    'Esterito',
    'Pichilingue',
    'Marquez de León'
  ];