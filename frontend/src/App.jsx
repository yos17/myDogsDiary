import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateWishlist from './pages/CreateWishlist'
import ViewWishlist from './pages/ViewWishlist'
import SearchProducts from './pages/SearchProducts'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateWishlist />} />
          <Route path="/wishlist/:id" element={<ViewWishlist />} />
          <Route path="/search" element={<SearchProducts />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
