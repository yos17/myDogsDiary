import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Calendar, User, Plus, Trash2, Search } from 'lucide-react'

function CreateWishlist() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    description: '',
  })
  const [items, setItems] = useState([])
  const [currentItem, setCurrentItem] = useState({
    name: '',
    description: '',
    price: '',
    url: '',
    imageUrl: '',
  })
  const [loading, setLoading] = useState(false)

  const handleAddItem = () => {
    if (currentItem.name && currentItem.price) {
      setItems([...items, { ...currentItem, id: Date.now() }])
      setCurrentItem({
        name: '',
        description: '',
        price: '',
        url: '',
        imageUrl: '',
      })
    }
  }

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.birthday || items.length === 0) {
      alert('Please fill in all required fields and add at least one item!')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('/api/wishlists', {
        ...formData,
        items,
      })
      navigate(`/wishlist/${response.data.id}`)
    } catch (error) {
      console.error('Error creating wishlist:', error)
      alert('Failed to create wishlist. Please try again.')
    } finally {
      setLoading(false)
    }
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

        <div className="glass rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Create Your Wishlist
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-semibold">
                  <User className="inline w-5 h-5 mr-2" />
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">
                  <Calendar className="inline w-5 h-5 mr-2" />
                  Birthday Date
                </label>
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border-2 border-white/30 text-white focus:outline-none focus:border-white/60"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">
                  Message for Friends
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                  placeholder="Hey friends! Here's what I'd love for my birthday..."
                  rows="3"
                />
              </div>
            </div>

            {/* Add Item Section */}
            <div className="border-t-2 border-white/30 pt-6">
              <h2 className="text-2xl font-bold text-white mb-4">Add Wishlist Items</h2>

              <div className="bg-white/10 rounded-2xl p-6 mb-6 space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={currentItem.name}
                    onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur border-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                    placeholder="Item name (e.g., PlayStation 5)"
                  />
                  <input
                    type="number"
                    value={currentItem.price}
                    onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
                    className="w-32 px-4 py-3 rounded-xl bg-white/20 backdrop-blur border-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                    placeholder="Price"
                  />
                </div>

                <input
                  type="text"
                  value={currentItem.description}
                  onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                  placeholder="Description (optional)"
                />

                <input
                  type="url"
                  value={currentItem.url}
                  onChange={(e) => setCurrentItem({ ...currentItem, url: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                  placeholder="Amazon URL (optional)"
                />

                <input
                  type="url"
                  value={currentItem.imageUrl}
                  onChange={(e) => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                  placeholder="Image URL (optional)"
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:from-green-500 hover:to-emerald-600 transition-all flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Item
                  </button>
                  <Link
                    to="/search"
                    className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-500 hover:to-cyan-600 transition-all flex items-center justify-center"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search Amazon
                  </Link>
                </div>
              </div>

              {/* Items List */}
              {items.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">Your Items ({items.length})</h3>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/20 backdrop-blur rounded-xl p-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="text-white font-bold">{item.name}</h4>
                        <p className="text-white/70 text-sm">${item.price}</p>
                        {item.description && (
                          <p className="text-white/60 text-sm">{item.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-300 hover:text-red-500 transition ml-4"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Creating...' : 'Create Wishlist & Share'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateWishlist
