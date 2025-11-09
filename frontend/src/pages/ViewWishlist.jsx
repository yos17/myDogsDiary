import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Share2, Calendar, ExternalLink, Copy, CheckCircle } from 'lucide-react'

function ViewWishlist() {
  const { id } = useParams()
  const [wishlist, setWishlist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchWishlist()
  }, [id])

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`/api/wishlists/${id}`)
      setWishlist(response.data)
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const shareOnWhatsApp = () => {
    const url = window.location.href
    const message = `Check out my Birthday Wishlist! ${wishlist.name}'s Birthday is on ${new Date(wishlist.birthday).toLocaleDateString()}!\n\n${url}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading wishlist...</div>
      </div>
    )
  }

  if (!wishlist) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Wishlist Not Found</h2>
          <Link to="/" className="text-white/80 hover:text-white">
            Go back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-white mb-6 hover:text-white/80 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="glass rounded-3xl p-8 shadow-2xl mb-6">
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold text-white mb-4">
              {wishlist.name}'s Birthday Wishlist
            </h1>
            <div className="flex items-center justify-center text-white/90 text-xl mb-4">
              <Calendar className="w-6 h-6 mr-2" />
              {new Date(wishlist.birthday).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            {wishlist.description && (
              <p className="text-white/80 text-lg italic max-w-2xl mx-auto">
                "{wishlist.description}"
              </p>
            )}
          </div>

          {/* Share Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={shareOnWhatsApp}
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-green-500 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share on WhatsApp
            </button>
            <button
              onClick={copyLink}
              className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/30 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center border-2 border-white/50"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white mb-6">
            Wishlist Items ({wishlist.items.length})
          </h2>
          {wishlist.items.map((item, index) => (
            <div
              key={item.id || index}
              className="glass rounded-2xl p-6 card-hover"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {item.imageUrl && (
                  <div className="w-full md:w-48 h-48 flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-white/80 mb-3">{item.description}</p>
                  )}
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-3xl font-bold text-green-300">
                      ${item.price}
                    </span>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-bold hover:from-yellow-500 hover:to-orange-600 transition-all flex items-center"
                      >
                        View on Amazon
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <Link
            to="/create"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
          >
            Create Your Own Wishlist
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ViewWishlist
