import React from 'react'
import { Clock, DollarSign, Plane } from 'lucide-react'
import { Flight } from '../../services/api'

interface FlightCardProps {
  flight: Flight
  onSelect: () => void
}

export default function FlightCard({ flight, onSelect }: FlightCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-200 p-6 hover:shadow-xl transition-all transform hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {flight.airline}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>{flight.duration}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800">{flight.departure}</div>
              <div className="text-sm text-gray-600">{flight.from}</div>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <Plane className="h-5 w-5 text-pink-600 mx-2" />
                <div className="w-8 h-0.5 bg-gray-300"></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800">{flight.arrival}</div>
              <div className="text-sm text-gray-600">{flight.to}</div>
            </div>
          </div>
        </div>
        
        <div className="text-right ml-6">
          <div className="flex items-center text-2xl font-bold text-gray-800 mb-2">
            <DollarSign className="h-6 w-6" />
            {flight.price.toLocaleString()}
          </div>
          <button
            onClick={onSelect}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Book This Flight 🎫
          </button>
        </div>
      </div>
    </div>
  )
}