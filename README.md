# NexStore — Full-Featured MERN Stack E-Commerce Platform

A production-grade, full-featured E-Commerce web application built using the **MERN** stack (MongoDB, Express.js, React, Node.js) with a modern glassmorphism aesthetic and responsive design.

---

## 🚀 Key Features

### 🛍️ Customer Experience
- **Dynamic Catalog & Discovery**:
  - Live search with instant debounced results.
  - Multi-facet sidebar filters: Categories, dynamic Price slider, Rating filters, In-Stock filter, and Sort options (Price Low/High, Rating, Newest).
- **Product Details & Social Proof**:
  - Multi-image gallery with thumbnail switcher.
  - Interactive rating breakdown and customer review submission form.
- **Cart & Wishlist System**:
  - Slide-over Cart Drawer with persistent `localStorage` synchronization.
  - Promo code discounts (e.g. `NEX10` for 10% off, `SAVE20` for 20% off).
  - One-click wishlist bookmarking.
- **Checkout Pipeline**:
  - Multi-step address selection (with saved address book management).
  - Simulated instant card checkout & Cash on Delivery (COD).
  - Live shipment tracking stepper (`Processing` → `Confirmed` → `Shipped` → `Delivered`).
- **User Dashboard**:
  - Profile manager with password change.
  - Saved shipping address manager (add, delete, set default).
  - Complete order history and receipt view.

### 🛡️ Admin Portal (`/admin`)
- **Executive KPI Dashboard**: Total revenue metrics, order count, and inventory indicators.
- **Order Fulfillment Manager**: Real-time status update dropdown (`Processing`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).
- **Inventory & Product Editor**: Create and publish products with photos, pricing, stock count, and delete records.

---

## 🔑 Demo Accounts

The project includes pre-configured demo accounts for testing:

| Role | Email | Password | Access |
|---|---|---|---|
| **Administrator** | `admin@example.com` | `admin123Password!` | Full Store & Order Management (`/admin`) |
| **Customer** | `customer@example.com` | `customer123Password!` | Storefront, Wishlist, Cart & Orders |

*Note: On the login page, you can simply click the **"Admin Demo"** or **"Customer Demo"** button to auto-fill credentials instantly.*

---

## 🛠️ Project Structure

```plaintext
/
├── backend/
│   ├── src/
│   │   ├── config/             # MongoDB connection with graceful retry
│   │   ├── controllers/        # Auth, Product, Category, Order controllers
│   │   ├── middleware/         # JWT authentication, requireAdmin RBAC, errorHandler
│   │   ├── models/             # User, Product, Category, Order schemas
│   │   ├── routes/             # Express API routes
│   │   ├── utils/              # JWT generator & database seeder
│   │   └── server.js           # Server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProductCard, CartDrawer
│   │   ├── context/            # AuthContext, CartContext, WishlistContext
│   │   ├── pages/              # Home, Shop, ProductDetail, Checkout, Orders, Profile, Admin
│   │   ├── services/           # Axios API instance with JWT interceptor
│   │   ├── styles/             # Global CSS design system and tokens
│   │   ├── App.jsx             # Router and layouts
│   │   └── main.jsx
│   ├── vite.config.js          # Vite with /api dev proxy to port 5000
│   └── package.json
├── package.json                # Root convenience scripts
└── README.md
```

---

## 🏁 Quick Start

### 1. Database Configuration
By default, the backend connects to MongoDB on `mongodb://127.0.0.1:27017/ecommerce_db`. If you are using MongoDB Atlas, simply update `MONGO_URI` in `backend/.env`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce_db?retryWrites=true&w=majority
```

### 2. Seed Sample Catalog
To populate initial categories, realistic products with Unsplash HD images, and demo accounts:
```bash
npm run seed
```

### 3. Run Development Servers
From the root directory:

- Run Backend:
  ```bash
  npm run server
  ```
  *(Runs on http://localhost:5000)*

- Run Frontend:
  ```bash
  npm run client
  ```
  *(Runs on http://localhost:5173)*

---

## 📡 Key API Endpoints

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`, `PUT /api/auth/profile`, `POST /api/auth/addresses`
- **Products**: `GET /api/products`, `GET /api/products/:id`, `POST /api/products/:id/reviews`, `POST /api/products` *(Admin)*, `DELETE /api/products/:id` *(Admin)*
- **Categories**: `GET /api/categories`, `POST /api/categories` *(Admin)*
- **Orders**: `POST /api/orders`, `GET /api/orders/myorders`, `GET /api/orders/:id`, `PUT /api/orders/:id/pay`, `GET /api/orders` *(Admin)*, `PUT /api/orders/:id/status` *(Admin)*
- **Health**: `GET /api/health`
