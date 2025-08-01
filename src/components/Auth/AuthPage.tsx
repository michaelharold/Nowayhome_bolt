import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Plane, Mail, Lock, User } from 'lucide-react'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signUp, signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) throw error
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <Plane className="h-12 w-12 text-pink-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            No Way Home ✈️
          </h1>
          <p className="text-gray-600 text-lg">
            Where chaos meets wanderlust! 🎭
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-pink-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
              {isSignUp ? 'Join the Adventure! 🎪' : 'Welcome Back! 🎯'}
            </h2>
            <p className="text-center text-gray-600 text-sm">
              {isSignUp 
                ? 'Ready for some delightful travel chaos?' 
                : 'Time for another surprise journey!'
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                <>
                  {isSignUp ? '🎉 Join the Chaos' : '🚀 Let\'s Go!'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in instead!' 
                : 'New to the chaos? Join us now!'
              }
            </button>
          </div>
        </div>

        {/* Fun Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            🎪 Where every trip is a plot twist! 🎭
          </p>
        </div>
      </div>
    </div>
  )
}