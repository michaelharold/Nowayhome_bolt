import React, { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { useSpring, animated } from '@react-spring/web'
import { MapPin, Calendar, Clock, Plane, Ticket } from 'lucide-react'

interface SurpriseRevealProps {
  surpriseReturn: any
  onAcceptTo: () => void
  onDecline: () => void
}

export default function SurpriseReveal({ surpriseReturn, onAcceptTo, onDecline }: SurpriseRevealProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const cardSpring = useSpring({
    from: { transform: 'rotateY(180deg)', opacity: 0 },
    to: { transform: 'rotateY(0deg)', opacity: 1 },
    config: { tension: 200, friction: 20 },
    delay: 500,
    onRest: () => {
      setShowConfetti(true)
      setRevealed(true)
    }
  })

  const textSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0px)' : 'translateY(20px)' },
    delay: 1500
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4 relative">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            PLOT TWIST! 🎭
          </h1>
          <p className="text-xl text-gray-600">
            We've got a little surprise for your return journey...
          </p>
        </div>

        {/* Surprise Ticket Card */}
        <animated.div style={cardSpring}>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-pink-300 p-8 mb-8 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-pink-200 rounded-full opacity-50"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-200 rounded-full opacity-30"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full text-lg font-bold flex items-center">
                  <Ticket className="h-6 w-6 mr-2" />
                  SURPRISE RETURN TICKET
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-pink-50 rounded-2xl p-6">
                  <MapPin className="h-8 w-8 text-pink-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">From</h3>
                  <p className="text-lg text-pink-700 font-bold">{surpriseReturn.from}</p>
                </div>

                <div className="bg-purple-50 rounded-2xl p-6">
                  <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">Date</h3>
                  <p className="text-lg text-purple-700 font-bold">{surpriseReturn.date}</p>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">Time</h3>
                  <p className="text-lg text-blue-700 font-bold">{surpriseReturn.departure}</p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{surpriseReturn.from}</div>
                  <div className="text-sm text-gray-600">Departure</div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-0.5 bg-gray-300"></div>
                  <Plane className="h-8 w-8 text-pink-600 mx-4" />
                  <div className="w-12 h-0.5 bg-gray-300"></div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{surpriseReturn.to}</div>
                  <div className="text-sm text-gray-600">Arrival</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Total Price:</span>
                  <span className="text-2xl font-bold text-purple-700">₹{surpriseReturn.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </animated.div>

        {/* Surprise Message */}
        <animated.div style={textSpring}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-200 p-8 mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Surprise! You're Coming Back from {surpriseReturn.from}! 
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We've booked your return flight from one of your wishlist destinations! 
              But wait... you'll need a way to GET there first! 😉
            </p>
            
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">
                The Big Question! 🤔
              </h3>
              <p className="text-orange-700">
                Would you like us to book a TO ticket to {surpriseReturn.from} to match your return? 
                Otherwise, you might have some explaining to do at the airport! 
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onAcceptTo}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105"
              >
                🎫 Yes! Book my TO ticket too!
              </button>
              
              <button
                onClick={onDecline}
                className="px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-xl font-semibold hover:from-gray-500 hover:to-gray-700 transition-all transform hover:scale-105"
              >
                🤷‍♂️ Nah, I'll figure it out
              </button>
            </div>
          </div>
        </animated.div>
      </div>
    </div>
  )
}