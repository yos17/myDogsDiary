import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Search, ExternalLink } from 'lucide-react'

function SearchProducts() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await axios.get(`/api/products/search?q=${encodeURIComponent(query)}`)
      setProducts(response.data)
    } catch (error) {
      console.error('Error searching products:', error)
      alert('Failed to search products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/create"
          className="inline-flex items-center text-white mb-6 hover:text-white/80 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Create Wishlist
        </Link>

        <div className="glass rounded-3xl p-8 shadow-2xl mb-8">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">
            Search Amazon Products
          </h1>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-6 py-4 rounded-xl bg-white/20 backdrop-blur border-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 text-lg"
                placeholder="Search for products (e.g., gaming headset, skateboard)..."
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center disabled:opacity-50"
              >
                <Search className="w-5 h-5 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Popular Suggestions */}
          <div className="flex flex-wrap gap-3">
            <span className="text-white/80">Popular:</span>
            {['Gaming Console', 'Sneakers', 'Bluetooth Speaker', 'Skateboard', 'Smartwatch'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion)
                  handleSearch({ preventDefault: () => {} })
                }}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {products.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Search Results ({products.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="glass rounded-2xl p-6 card-hover flex flex-col"
                >
                  {product.image && (
                    <div className="w-full h-48 mb-4 bg-white/10 rounded-xl overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
                        }}
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 flex-1">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-green-300">
                      {product.price}
                    </span>
                    {product.url && (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold hover:from-yellow-500 hover:to-orange-600 transition-all flex items-center text-sm"
                      >
                        View
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && products.length === 0 && query && (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-white text-xl">
              No products found. Try a different search term!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchProducts
