import { Link } from 'react-router-dom'
import { Gift, Sparkles, Share2 } from 'lucide-react'

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Gift className="w-24 h-24 text-white animate-bounce" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Birthday Wishlist
          </h1>
          <p className="text-2xl text-white/90 mb-8">
            Create & share your dream wishlist with friends on WhatsApp!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-2xl p-6 card-hover">
            <Sparkles className="w-12 h-12 text-yellow-300 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Create Lists</h3>
            <p className="text-white/80">
              Build your perfect birthday wishlist with Amazon products
            </p>
          </div>
          <div className="glass rounded-2xl p-6 card-hover">
            <Share2 className="w-12 h-12 text-green-300 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Share Easy</h3>
            <p className="text-white/80">
              Share instantly with friends via WhatsApp
            </p>
          </div>
          <div className="glass rounded-2xl p-6 card-hover">
            <Gift className="w-12 h-12 text-pink-300 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Get Gifts</h3>
            <p className="text-white/80">
              Friends know exactly what you want!
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/create"
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg text-center"
          >
            Create My Wishlist
          </Link>
          <Link
            to="/search"
            className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-white/30 transition-all transform hover:scale-105 shadow-lg text-center border-2 border-white/50"
          >
            Browse Amazon Products
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/60">
          <p>Made with love for birthday celebrations</p>
        </div>
      </div>
    </div>
  )
}

export default Home
