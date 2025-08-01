import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { bookingApi, movieApi } from '../../services/api'
import { Plane, Film, MapPin, Calendar, Clock, DollarSign } from 'lucide-react'
import { addDays, format } from 'date-fns'

interface BookingSummaryProps {
  bookings: any[]
  originalDestination: string
  actualDestination: string
}

export default function BookingSummary({ bookings, originalDestination, actualDestination }: BookingSummaryProps) {
  const { user } = useAuth()
  const [movieTicket, setMovieTicket] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateMovieTicket = async () => {
      if (!user) return
      
      try {
        // Find the return booking to get the date
        const returnBooking = bookings.find(b => b.booking_type === 'return')
        if (returnBooking) {
          const movieDate = format(addDays(new Date(returnBooking.departure_date), -2), 'yyyy-MM-dd')
          const ticket = await movieApi.generateMovieTicket('comedy', actualDestination, movieDate)
          setMovieTicket(ticket)
          
          // Save movie ticket to database
          await bookingApi.createBooking({
            user_id: user.id,
            booking_type: 'movie',
            movie_title: ticket.title,
            movie_genre: ticket.genre,
            movie_date: movieDate,
            to_location: actualDestination,
            price: ticket.price
          })
        }
      } catch (error) {
        console.error('Error generating movie ticket:', error)
      } finally {
        setLoading(false)
      }
    }

    generateMovieTicket()
  }, [bookings, actualDestination, user])

  const totalCost = bookings.reduce((sum, booking) => sum + booking.price, 0) + (movieTicket?.price || 0)

  const funnyMessages = [
    `You tried to go to ${originalDestination}. You're now headed to ${actualDestination}. Enjoy! 🎭`,
    `Plot twist level: Expert! ${originalDestination} → ${actualDestination}. Your life is now a rom-com! 💕`,
    `Breaking news: Your GPS is jealous of our chaos skills! Welcome to ${actualDestination}! 🗞️`,
    `Congratulations! You've been enrolled in our "Accidental Adventure" program! 🎪`,
    `Your travel agent? That was us all along! *dramatic villain reveal* 🎬`
  ]

  const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Crafting your final surprise...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Mission Complete! 🎉
          </h1>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-200 p-6 mb-8">
            <p className="text-xl text-gray-700 font-medium italic">
              "{randomMessage}"
            </p>
          </div>
        </div>

        {/* Bookings Summary */}
        <div className="space-y-6">
          {/* Outbound Flight */}
          {bookings.filter(b => b.booking_type === 'outbound').map((booking) => (
            <div key={booking.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-200 p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full">
                  <Plane className="h-5 w-5 inline mr-2" />
                  Outbound Flight
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">From</p>
                    <p className="font-semibold">{booking.from_location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">To</p>
                    <p className="font-semibold">{booking.to_location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">{format(new Date(booking.departure_date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold">₹{booking.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Return Flight */}
          {bookings.filter(b => b.booking_type === 'return').map((booking) => (
            <div key={booking.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-full">
                  <Plane className="h-5 w-5 inline mr-2" />
                  Return Flight (Surprise!)
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">From</p>
                    <p className="font-semibold">{booking.from_location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">To</p>
                    <p className="font-semibold">{booking.to_location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">{format(new Date(booking.departure_date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold">₹{booking.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Movie Ticket */}
          {movieTicket && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-200 p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full">
                  <Film className="h-5 w-5 inline mr-2" />
                  Bonus Movie Night!
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">{movieTicket.poster}</div>
                  <div>
                    <p className="text-sm text-gray-600">Movie</p>
                    <p className="font-semibold">{movieTicket.title}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Theater</p>
                    <p className="font-semibold">{movieTicket.theater}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Show Time</p>
                    <p className="font-semibold">{movieTicket.time}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold">₹{movieTicket.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-orange-50 rounded-xl">
                <p className="text-sm text-orange-700">
                  🍿 Seat: {movieTicket.seat} | 🎬 Genre: {movieTicket.genre} | ⭐ Rating: {movieTicket.rating}/10
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Total Cost */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-pink-300 p-8 mt-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Total Adventure Cost</h3>
            <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              ₹{totalCost.toLocaleString()}
            </div>
            <p className="text-gray-600 mt-2">
              Worth every rupee for this level of chaos! 🎪
            </p>
          </div>
        </div>

        {/* Fun Footer */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Congratulations, Chaos Champion! 🏆
            </h3>
            <p className="text-lg text-gray-700 mb-4">
              You've successfully been pranked... in the most helpful way possible! 
              Your spontaneous adventure awaits. Pack your sense of humor! 
            </p>
            <div className="flex justify-center space-x-4 text-4xl">
              <span>✈️</span>
              <span>🎬</span>
              <span>🎪</span>
              <span>🎉</span>
              <span>🌟</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}