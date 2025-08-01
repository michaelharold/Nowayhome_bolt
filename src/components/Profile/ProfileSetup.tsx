import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { profileApi } from '../../services/api'
import { MapPin, Film, UtensilsCrossed, Heart } from 'lucide-react'

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 
  'Japan', 'South Korea', 'Thailand', 'Singapore', 'Malaysia'
]

const GENRES = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Adventure'
]

const DESTINATIONS = [
  'Tokyo, Japan', 'Bangkok, Thailand', 'Singapore', 'Seoul, South Korea',
  'Bali, Indonesia', 'Maldives', 'Dubai, UAE', 'Paris, France',
  'London, UK', 'New York, USA', 'Sydney, Australia', 'Vancouver, Canada'
]

const FOODS = [
  'Sushi 🍣', 'Pizza 🍕', 'Tacos 🌮', 'Curry 🍛', 'Pasta 🍝', 
  'Ramen 🍜', 'Burgers 🍔', 'Dim Sum 🥟', 'Paella 🥘', 'Pho 🍲'
]

interface ProfileSetupProps {
  onComplete: () => void
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    homeCountry: '',
    movieGenre: '',
    wishlistDestinations: [] as string[],
    favoriteFoods: [] as string[]
  })

  const handleMultiSelect = (value: string, field: 'wishlistDestinations' | 'favoriteFoods') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleSubmit = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      await profileApi.createUserProfile({
        user_id: user.id,
        home_country: formData.homeCountry,
        movie_genre: formData.movieGenre,
        wishlist_destinations: formData.wishlistDestinations,
        favorite_foods: formData.favoriteFoods
      })
      onComplete()
    } catch (error) {
      console.error('Error creating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return formData.homeCountry
      case 2: return formData.movieGenre
      case 3: return formData.wishlistDestinations.length > 0
      case 4: return formData.favoriteFoods.length > 0
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Let's Get Chaotic! 🎪
          </h1>
          <p className="text-lg text-gray-600">
            Help us craft your perfect surprise adventure
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-pink-200">
          {step === 1 && (
            <div className="text-center">
              <MapPin className="h-16 w-16 text-pink-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Where's Home? 🏠</h2>
              <p className="text-gray-600 mb-6">
                So we know where to send you back eventually! 😄
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {COUNTRIES.map((country) => (
                  <button
                    key={country}
                    onClick={() => setFormData(prev => ({ ...prev, homeCountry: country }))}
                    className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                      formData.homeCountry === country
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <Film className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Movie Night Vibe? 🎬</h2>
              <p className="text-gray-600 mb-6">
                We'll surprise you with a movie ticket at your destination!
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setFormData(prev => ({ ...prev, movieGenre: genre }))}
                    className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                      formData.movieGenre === genre
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <Heart className="h-16 w-16 text-pink-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Dream Destinations? ✨</h2>
              <p className="text-gray-600 mb-6">
                Pick your wishlist places - we might just send you there! (Choose multiple)
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {DESTINATIONS.map((destination) => (
                  <button
                    key={destination}
                    onClick={() => handleMultiSelect(destination, 'wishlistDestinations')}
                    className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                      formData.wishlistDestinations.includes(destination)
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    {destination}
                  </button>
                ))}
              </div>
              
              {formData.wishlistDestinations.length > 0 && (
                <p className="text-sm text-pink-600 mt-4">
                  {formData.wishlistDestinations.length} destinations selected!
                </p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <UtensilsCrossed className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Foodie Favorites? 🍜</h2>
              <p className="text-gray-600 mb-6">
                What makes your taste buds happy? (Pick all that apply!)
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {FOODS.map((food) => (
                  <button
                    key={food}
                    onClick={() => handleMultiSelect(food, 'favoriteFoods')}
                    className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                      formData.favoriteFoods.includes(food)
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {food}
                  </button>
                ))}
              </div>
              
              {formData.favoriteFoods.length > 0 && (
                <p className="text-sm text-orange-600 mt-4">
                  {formData.favoriteFoods.length} favorites selected!
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Setting up...
                  </div>
                ) : (
                  '🎉 Let the Chaos Begin!'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}