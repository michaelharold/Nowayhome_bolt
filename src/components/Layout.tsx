import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, Plane } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
  showHeader?: boolean
}

export default function Layout({ children, showHeader = true }: LayoutProps) {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {showHeader && user && (
        <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Plane className="h-8 w-8 text-pink-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  No Way Home ✈️
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Hey there, chaos agent! 👋
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-pink-100 hover:bg-pink-200 rounded-full transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}