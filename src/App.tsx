import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import AuthPage from './components/Auth/AuthPage'
import ProfileSetup from './components/Profile/ProfileSetup'
import FlightSearch from './components/Booking/FlightSearch'
import SurpriseReveal from './components/Surprise/SurpriseReveal'
import BookingSummary from './components/Summary/BookingSummary'
import { profileApi, flightApi, bookingApi } from './services/api'
import { addDays, format } from 'date-fns'

type AppState = 'loading' | 'auth' | 'profile-setup' | 'flight-search' | 'surprise-reveal' | 'booking-to' | 'summary'

function AppContent() {
  const { user, loading: authLoading } = useAuth()
  const [appState, setAppState] = useState<AppState>('loading')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [selectedFlight, setSelectedFlight] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [surpriseReturn, setSurpriseReturn] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [originalDestination, setOriginalDestination] = useState<string>('')

  useEffect(() => {
    const initializeApp = async () => {
      if (authLoading) return

      if (!user) {
        setAppState('auth')
        return
      }

      try {
        // Check if user has a profile
        const profile = await profileApi.getUserProfile(user.id)
        if (!profile) {
          setAppState('profile-setup')
          return
        }

        setUserProfile(profile)
        setAppState('flight-search')
      } catch (error) {
        console.error('Error initializing app:', error)
        setAppState('profile-setup')
      }
    }

    initializeApp()
  }, [user, authLoading])

  const handleProfileComplete = async () => {
    if (!user) return
    try {
      const profile = await profileApi.getUserProfile(user.id)
      setUserProfile(profile)
      setAppState('flight-search')
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleFlightSelect = async (flight: any, date: string) => {
    setSelectedFlight(flight)
    setSelectedDate(date)
    setOriginalDestination(flight.to)

    try {
      // Generate surprise return
      const surpriseReturnFlight = await flightApi.generateSurpriseReturn(
        userProfile.wishlist_destinations,
        date
      )
      setSurpriseReturn(surpriseReturnFlight)

      // Create return booking
      const returnBooking = await bookingApi.createBooking({
        user_id: user!.id,
        booking_type: 'return',
        from_location: surpriseReturnFlight.from,
        to_location: surpriseReturnFlight.to,
        departure_date: surpriseReturnFlight.date,
        price: surpriseReturnFlight.price
      })

      setBookings([returnBooking])
      setAppState('surprise-reveal')
    } catch (error) {
      console.error('Error creating surprise:', error)
    }
  }

  const handleAcceptToTicket = async () => {
    if (!user || !surpriseReturn || !selectedDate) return

    try {
      // Create the matching outbound flight
      const outboundBooking = await bookingApi.createBooking({
        user_id: user.id,
        booking_type: 'outbound',
        from_location: selectedFlight.from,
        to_location: surpriseReturn.from,
        departure_date: selectedDate,
        price: selectedFlight.price
      })

      setBookings(prev => [...prev, outboundBooking])
      setAppState('summary')
    } catch (error) {
      console.error('Error booking TO ticket:', error)
    }
  }

  const handleDeclineToTicket = () => {
    setAppState('summary')
  }

  if (authLoading || appState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Preparing your chaos...</p>
        </div>
      </div>
    )
  }

  return (
    <Layout showHeader={appState !== 'auth'}>
      {appState === 'auth' && <AuthPage />}
      {appState === 'profile-setup' && <ProfileSetup onComplete={handleProfileComplete} />}
      {appState === 'flight-search' && <FlightSearch onFlightSelect={handleFlightSelect} />}
      {appState === 'surprise-reveal' && surpriseReturn && (
        <SurpriseReveal
          surpriseReturn={surpriseReturn}
          onAcceptTo={handleAcceptToTicket}
          onDecline={handleDeclineToTicket}
        />
      )}
      {appState === 'summary' && (
        <BookingSummary
          bookings={bookings}
          originalDestination={originalDestination}
          actualDestination={surpriseReturn?.from || 'Unknown'}
        />
      )}
    </Layout>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App