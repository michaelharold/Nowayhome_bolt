import React, { useState } from 'react'
import { Search, Calendar, MapPin, Plane } from 'lucide-react'
import { flightApi, Flight } from '../../services/api'
import FlightCard from './FlightCard'

interface FlightSearchProps {
  onFlightSelect: (flight: Flight, date: string) => void
}

export default function FlightSearch({ onFlightSelect }: FlightSearchProps) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!from || !to || !date) return

    setLoading(true)
    try {
      const results = await flightApi.searchFlights(from, to, date)
      setFlights(results)
      setSearched(true)
    } catch (error) {
      console.error('Error searching flights:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Where Should We Not Send You? 🎭
          </h1>
          <p className="text-lg text-gray-600">
            Book a normal flight... or so you think! 😉
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-pink-200 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  From
                </label>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Your starting point"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Plane className="inline h-4 w-4 mr-1" />
                  To
                </label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Where you think you're going"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Departure Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Searching flights...
                  </div>
                ) : (
                  <>
                    <Search className="inline h-5 w-5 mr-2" />
                    Find My "Normal" Flight 🎪
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Flight Results */}
        {searched && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {flights.length > 0 
                ? `Found ${flights.length} flights (totally normal ones!) ✈️` 
                : 'No flights found... time for plan B! 🎭'
              }
            </h2>
            
            {flights.length > 0 ? (
              <div className="grid gap-6">
                {flights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onSelect={() => onFlightSelect(flight, date)}
                  />
                ))}
              </div>
            ) : searched && !loading && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 border border-pink-200 text-center">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Plot Twist Time!
                </h3>
                <p className="text-gray-600">
                  No flights found, but don't worry - we have something even better planned! 
                  How about we surprise you with a completely different adventure?
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}