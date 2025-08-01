import { supabase } from '../lib/supabase'
import { addDays, format } from 'date-fns'

export interface Flight {
  id: string
  airline: string
  from: string
  to: string
  departure: string
  arrival: string
  price: number
  duration: string
}

export interface Movie {
  id: string
  title: string
  genre: string
  poster: string
  rating: number
}

// Mock flight data
const MOCK_FLIGHTS: Flight[] = [
  {
    id: '1',
    airline: 'Chaos Airways ✈️',
    from: 'Mumbai',
    to: 'Goa',
    departure: '10:30',
    arrival: '12:00',
    price: 4500,
    duration: '1h 30m'
  },
  {
    id: '2',
    airline: 'Mystery Express 🎭',
    from: 'Delhi',
    to: 'Bangkok',
    departure: '14:15',
    arrival: '19:45',
    price: 12000,
    duration: '4h 30m'
  },
  {
    id: '3',
    airline: 'Surprise Sky 🎪',
    from: 'Bangalore',
    to: 'Singapore',
    departure: '22:30',
    arrival: '04:15+1',
    price: 15000,
    duration: '4h 45m'
  }
]

// Mock movie data by genre
const MOCK_MOVIES: Record<string, Movie[]> = {
  action: [
    { id: '1', title: 'Tokyo Drift Adventure', genre: 'Action', poster: '🏎️', rating: 8.2 },
    { id: '2', title: 'Bangkok Heist', genre: 'Action', poster: '💥', rating: 7.8 }
  ],
  comedy: [
    { id: '3', title: 'Lost in Translation Comedy', genre: 'Comedy', poster: '😂', rating: 8.5 },
    { id: '4', title: 'Vacation Mishaps', genre: 'Comedy', poster: '🎭', rating: 7.9 }
  ],
  drama: [
    { id: '5', title: 'Journey of Hearts', genre: 'Drama', poster: '💔', rating: 8.7 },
    { id: '6', title: 'City of Dreams', genre: 'Drama', poster: '🌟', rating: 8.1 }
  ],
  horror: [
    { id: '7', title: 'Haunted Hotel', genre: 'Horror', poster: '👻', rating: 7.3 },
    { id: '8', title: 'Night Terror', genre: 'Horror', poster: '🔪', rating: 7.6 }
  ]
}

export const flightApi = {
  searchFlights: async (from: string, to: string, date: string): Promise<Flight[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Filter mock flights based on from/to (simplified)
    return MOCK_FLIGHTS.filter(flight => 
      flight.from.toLowerCase().includes(from.toLowerCase()) ||
      flight.to.toLowerCase().includes(to.toLowerCase())
    )
  },

  generateSurpriseReturn: async (wishlistDestinations: string[], originalDate: string) => {
    const randomDestination = wishlistDestinations[Math.floor(Math.random() * wishlistDestinations.length)]
    const returnDate = addDays(new Date(originalDate), 16)
    
    return {
      id: `return-${Date.now()}`,
      airline: 'Destiny Airlines 🎯',
      from: randomDestination,
      to: 'Home',
      departure: '18:30',
      arrival: '23:45',
      date: format(returnDate, 'yyyy-MM-dd'),
      price: Math.floor(Math.random() * 20000) + 10000,
      duration: '5h 15m'
    }
  }
}

export const movieApi = {
  getMoviesByGenre: async (genre: string, location: string): Promise<Movie[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return MOCK_MOVIES[genre.toLowerCase()] || MOCK_MOVIES.comedy
  },

  generateMovieTicket: async (genre: string, location: string, date: string) => {
    const movies = await movieApi.getMoviesByGenre(genre, location)
    const randomMovie = movies[Math.floor(Math.random() * movies.length)]
    
    return {
      ...randomMovie,
      location,
      date,
      time: '19:30',
      theater: `${location} Cinema Complex 🎬`,
      seat: `${String.fromCharCode(65 + Math.floor(Math.random() * 10))}${Math.floor(Math.random() * 20) + 1}`,
      price: Math.floor(Math.random() * 500) + 200
    }
  }
}

export const profileApi = {
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  createUserProfile: async (profile: any) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  updateUserProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

export const bookingApi = {
  createBooking: async (booking: any) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  getUserBookings: async (userId: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}