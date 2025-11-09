import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Data directory
const DATA_DIR = path.join(__dirname, 'data')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Get all wishlists
app.get('/api/wishlists', async (req, res) => {
  try {
    const files = await fs.readdir(DATA_DIR)
    const wishlists = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const content = await fs.readFile(path.join(DATA_DIR, file), 'utf-8')
          return JSON.parse(content)
        })
    )
    res.json(wishlists)
  } catch (error) {
    console.error('Error fetching wishlists:', error)
    res.status(500).json({ error: 'Failed to fetch wishlists' })
  }
})

// Get wishlist by ID
app.get('/api/wishlists/:id', async (req, res) => {
  try {
    const { id } = req.params
    const filePath = path.join(DATA_DIR, `${id}.json`)
    const content = await fs.readFile(filePath, 'utf-8')
    res.json(JSON.parse(content))
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    res.status(404).json({ error: 'Wishlist not found' })
  }
})

// Create wishlist
app.post('/api/wishlists', async (req, res) => {
  try {
    const { name, birthday, description, items } = req.body

    if (!name || !birthday || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const id = generateId()
    const wishlist = {
      id,
      name,
      birthday,
      description,
      items,
      createdAt: new Date().toISOString(),
    }

    const filePath = path.join(DATA_DIR, `${id}.json`)
    await fs.writeFile(filePath, JSON.stringify(wishlist, null, 2))

    res.status(201).json(wishlist)
  } catch (error) {
    console.error('Error creating wishlist:', error)
    res.status(500).json({ error: 'Failed to create wishlist' })
  }
})

// Update wishlist
app.put('/api/wishlists/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const filePath = path.join(DATA_DIR, `${id}.json`)
    const content = await fs.readFile(filePath, 'utf-8')
    const wishlist = JSON.parse(content)

    const updatedWishlist = {
      ...wishlist,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    }

    await fs.writeFile(filePath, JSON.stringify(updatedWishlist, null, 2))
    res.json(updatedWishlist)
  } catch (error) {
    console.error('Error updating wishlist:', error)
    res.status(500).json({ error: 'Failed to update wishlist' })
  }
})

// Delete wishlist
app.delete('/api/wishlists/:id', async (req, res) => {
  try {
    const { id } = req.params
    const filePath = path.join(DATA_DIR, `${id}.json`)
    await fs.unlink(filePath)
    res.json({ message: 'Wishlist deleted successfully' })
  } catch (error) {
    console.error('Error deleting wishlist:', error)
    res.status(500).json({ error: 'Failed to delete wishlist' })
  }
})

// Search Amazon products (mock data - in production use Amazon Product API)
app.get('/api/products/search', async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ error: 'Search query required' })
    }

    // Mock product data (in production, integrate with Amazon Product Advertising API)
    // For now, generate realistic mock data based on search query
    const mockProducts = generateMockProducts(q)

    res.json(mockProducts)
  } catch (error) {
    console.error('Error searching products:', error)
    res.status(500).json({ error: 'Failed to search products' })
  }
})

// Generate mock products based on search query
function generateMockProducts(query) {
  const products = []
  const categories = {
    'gaming': [
      { title: 'PlayStation 5 Console', price: '$499.99', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400' },
      { title: 'Xbox Series X', price: '$499.99', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400' },
      { title: 'Gaming Headset RGB', price: '$79.99', image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400' },
      { title: 'Mechanical Gaming Keyboard', price: '$129.99', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400' },
      { title: 'Gaming Mouse RGB', price: '$59.99', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400' },
    ],
    'sneakers': [
      { title: 'Nike Air Max 270', price: '$150.00', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
      { title: 'Adidas Ultraboost', price: '$180.00', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' },
      { title: 'Converse Chuck Taylor', price: '$65.00', image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400' },
    ],
    'speaker': [
      { title: 'JBL Flip 6 Bluetooth Speaker', price: '$129.95', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400' },
      { title: 'Sony XB43 Extra Bass', price: '$248.00', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400' },
      { title: 'Bose SoundLink Mini', price: '$199.00', image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400' },
    ],
    'skateboard': [
      { title: 'Complete Skateboard Pro', price: '$89.99', image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=400' },
      { title: 'Electric Skateboard', price: '$399.99', image: 'https://images.unsplash.com/photo-1520114224615-e4f41e13d3e5?w=400' },
      { title: 'Penny Board Cruiser', price: '$119.99', image: 'https://images.unsplash.com/photo-1564982752979-3f7bc974b29e?w=400' },
    ],
    'smartwatch': [
      { title: 'Apple Watch Series 9', price: '$399.00', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400' },
      { title: 'Samsung Galaxy Watch 6', price: '$299.99', image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=400' },
      { title: 'Fitbit Versa 4', price: '$199.95', image: 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=400' },
    ],
    'default': [
      { title: `${query} - Premium Edition`, price: '$99.99', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
      { title: `${query} - Best Seller`, price: '$79.99', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400' },
      { title: `${query} - Popular Choice`, price: '$129.99', image: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400' },
      { title: `${query} - Top Rated`, price: '$149.99', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400' },
    ]
  }

  // Find matching category
  const lowerQuery = query.toLowerCase()
  let selectedProducts = products.default

  for (const [key, items] of Object.entries(categories)) {
    if (lowerQuery.includes(key)) {
      selectedProducts = items
      break
    }
  }

  // Add Amazon URL to products
  return selectedProducts.map((product, index) => ({
    ...product,
    url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
    rating: (4 + Math.random()).toFixed(1),
    reviews: Math.floor(Math.random() * 10000) + 100,
  }))
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Birthday Wishlist API is running' })
})

// Start server
async function startServer() {
  await ensureDataDir()
  app.listen(PORT, () => {
    console.log(`🎂 Birthday Wishlist API running on port ${PORT}`)
    console.log(`📁 Data directory: ${DATA_DIR}`)
  })
}

startServer()
