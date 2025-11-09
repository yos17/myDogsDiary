# 🎂 Birthday Wishlist App

A fun and colorful wishlist app designed for teenagers to create and share birthday wishlists with friends via WhatsApp! Features Amazon product suggestions to make gift-giving easier.

![Made for Teenagers](https://img.shields.io/badge/Made%20for-Teenagers-ff69b4)
![Share on WhatsApp](https://img.shields.io/badge/Share-WhatsApp-25D366)
![Amazon Integration](https://img.shields.io/badge/Products-Amazon-FF9900)

## ✨ Features

- 🎁 **Create Beautiful Wishlists** - Add unlimited items with images, prices, and descriptions
- 📱 **WhatsApp Sharing** - Share your wishlist instantly with friends
- 🔍 **Amazon Product Search** - Find products directly from Amazon
- 🎨 **Colorful UI** - Modern, vibrant design perfect for teens
- 📲 **Mobile Friendly** - Works great on phones and tablets
- 🚀 **Fast & Easy** - No login required, instant wishlist creation

## 🛠️ Tech Stack

### Frontend
- **React** - Modern UI framework
- **Vite** - Lightning-fast development
- **TailwindCSS** - Beautiful, customizable styling
- **React Router** - Smooth navigation
- **Lucide Icons** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **JSON Storage** - Simple data persistence
- **CORS** - Cross-origin support

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd myDogsDiary
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

   This will install dependencies for both frontend and backend.

### Running the App

#### Option 1: Run Everything Together (Recommended)

```bash
npm run dev
```

This will start both the frontend (port 3000) and backend (port 5000) simultaneously.

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

### Access the App

Open your browser and go to:
```
http://localhost:3000
```

## 📖 How to Use

### Creating a Wishlist

1. Click **"Create My Wishlist"** on the homepage
2. Fill in your name and birthday date
3. Add a personal message for your friends
4. Add items to your wishlist:
   - Enter item name and price
   - Optionally add description, Amazon URL, and image URL
   - Or use the **"Search Amazon"** button to find products
5. Click **"Create Wishlist & Share"**

### Sharing Your Wishlist

1. After creating your wishlist, you'll see sharing options
2. Click **"Share on WhatsApp"** to send to friends
3. Or click **"Copy Link"** to share anywhere

### Searching Amazon Products

1. Click **"Browse Amazon Products"** on homepage
2. Enter your search term (e.g., "gaming headset")
3. Browse the results and get ideas for your wishlist
4. Click on products to view on Amazon

## 📁 Project Structure

```
myDogsDiary/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── CreateWishlist.jsx
│   │   │   ├── ViewWishlist.jsx
│   │   │   └── SearchProducts.jsx
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                  # Node.js backend
│   ├── server.js            # Express server
│   ├── data/                # JSON data storage
│   └── package.json
│
├── package.json             # Root package.json
└── README.md
```

## 🎨 Color Scheme

The app uses a vibrant, teenager-friendly color palette:

- **Primary Pink**: `#FF6B9D`
- **Secondary**: `#C44569`
- **Accent**: `#FFA07A`
- **Purple**: `#9B59B6`
- **Blue**: `#3498DB`

## 🔧 API Endpoints

### Wishlists

- `GET /api/wishlists` - Get all wishlists
- `GET /api/wishlists/:id` - Get wishlist by ID
- `POST /api/wishlists` - Create new wishlist
- `PUT /api/wishlists/:id` - Update wishlist
- `DELETE /api/wishlists/:id` - Delete wishlist

### Products

- `GET /api/products/search?q=query` - Search products

## 🚀 Future Enhancements

- [ ] Real Amazon Product Advertising API integration
- [ ] User accounts and authentication
- [ ] Email notifications
- [ ] Gift reservation (friends can mark items as "I'll buy this")
- [ ] Multiple wishlist support per user
- [ ] Social media sharing (Instagram, Facebook)
- [ ] Price tracking and alerts
- [ ] Wishlist templates
- [ ] Gift suggestions based on age/interests

## 📝 Notes

- **Amazon Integration**: Currently uses mock data. To use real Amazon products, sign up for [Amazon Product Advertising API](https://webservices.amazon.com/paapi5/documentation/)
- **Data Storage**: Uses JSON files for simplicity. For production, consider using a database (MongoDB, PostgreSQL)
- **WhatsApp Sharing**: Uses WhatsApp's URL scheme - works on mobile and desktop

## 🤝 Contributing

Feel free to fork this project and make it your own! Some ideas:

- Add more product sources (eBay, Etsy, etc.)
- Implement user authentication
- Add gift recommendations based on age
- Create themed templates (gaming, fashion, sports, etc.)

## 📄 License

MIT License - feel free to use this for your own projects!

## 💝 Made With Love

Created for teenagers who want an easy way to share their birthday wishes with friends and family!

---

**Happy Birthday! 🎉**
