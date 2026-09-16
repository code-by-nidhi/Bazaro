# Bazaro - Premium Clothing MERN E-Commerce Platform

Bazaro is a **complete, full-stack, production-style clothing e-commerce web application** built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Vite, Tailwind CSS, Lucide icons, Framer Motion, Cloudinary, and Razorpay.

Designed to serve as a **freelance client demonstration model**, **portfolio showcase**, and **production starter codebase**, Bazaro includes server-side price validation, cryptographically verified Razorpay payment verification, admin-managed categories that drive the storefront navigation, responsive filters, and an executive Admin Management Portal.

---

## 🌟 Key Features

### 🛒 Customer Storefront Features
- **Clothing Catalogue**: Ships with 6 apparel departments - **Men's Clothing, Women's Clothing, Kids' Clothing, Ethnic Wear, Winter Wear, and Activewear** - each with its own subcategories.
- **Admin-Driven Navigation**: Categories are stored in MongoDB, not hardcoded. Any department an admin creates in the Admin Portal appears in the storefront navbar automatically, with its own `/category/:slug` page. Each category carries an icon, a navbar position, and a show/hide toggle.
- **Mobile Responsive**: Storefront and Admin Portal are verified free of horizontal overflow from 320px through desktop; the admin sidebar collapses into a slide-in drawer below 1024px.
- **Dynamic Category & Subcategory Routing**: Filter products seamlessly by parent category or specific subcategories.
- **Advanced Product Filtering & Sorting**: Filter by keyword search, price range, star rating, brand, and stock availability. Sort by price (low-to-high / high-to-low), rating, popularity, discount, or newest.
- **Product Details & Gallery**: Multi-image preview, variant selection (sizes, colors, weights), real-time stock badges, specifications table, and verified customer reviews.
- **Protected Cart & Checkout**: Slide-over quick cart drawer, full cart management page, coupon discount calculator, and server-validated 4-step checkout.
- **Authentication & Security Enforcement**:
  - Unauthenticated guests can browse products freely.
  - Attempting to checkout or place an order requires authentication and smoothly redirects guests to `/login` with an explicit alert: `"You need to login before placing an order."`
  - Passwords hashed with `bcryptjs`. JWT authentication with Bearer token header interceptors.
- **Razorpay & COD Payments**: Integrated Razorpay online payments with HMAC-SHA256 signature verification on Node.js backend + Cash on Delivery (COD) fallback.
- **User Dashboard**: Profile management, multi-address management, order history tracking, itemized receipts, and saved Wishlist.

### 🛡️ Admin Management Dashboard
- **Executive Analytics**: Recharts visual analytics for monthly revenue growth and inventory category distribution.
- **Product Management (CRUD)**: Create, edit, and delete products with image upload support (Cloudinary integration with local fallback), price/discount calculations, stock counters, tags, and variants.
- **Category & Subcategory Builder**: Dynamically create new departments and subcategory tags without code modifications.
- **Order Management**: Track customer orders, inspect itemized receipts, and update order statuses (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`).
- **Customer Management**: View user accounts and toggle active/deactivated status.
- **Coupon & Banner Management**: Create promo discount codes and hero slider banners.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Tailwind CSS, Lucide React, Framer Motion, Recharts, Canvas Confetti |
| **State Management** | React Context API (`AuthContext`, `CartContext`, `WishlistContext`, `ProductContext`) + Custom Hooks (`useAuth`, `useCart`, `useWishlist`, `useProducts`) |
| **Backend API** | Node.js, Express.js (REST API architecture) |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), `bcryptjs` password hashing |
| **File Uploads** | Multer memory buffer + Cloudinary SDK |
| **Payment Gateway** | Razorpay Node.js SDK + HMAC-SHA256 signature verification |

---

## 📁 Directory Structure Overview

```
Bazaro/
├── server/
│   ├── config/           # DB (Mongoose), Cloudinary & Razorpay configurations
│   ├── controllers/      # Business logic handlers for Auth, Products, Orders, Admin, etc.
│   ├── middleware/       # Auth JWT verification, Admin protection, Multer upload & Error handlers
│   ├── models/           # Mongoose schemas (User, Product, Category, Order, Review, Coupon, Banner)
│   ├── routes/           # REST API Express endpoints
│   ├── utils/            # JWT generator, Cloudinary upload helper, Razorpay HMAC verifier
│   ├── seed/             # Seeder data (42 apparel products across 6 categories) & seeder script
│   ├── app.js            # Express app configuration & CORS setup
│   └── server.js         # Server entry point
│
├── client/               # CUSTOMER STOREFRONT (port 5173)
│   ├── src/
│   │   ├── components/   # Navbar, Footer, ProductCard, CartDrawer, MainLayout, etc.
│   │   ├── context/      # AuthContext, CartContext, WishlistContext, ProductContext
│   │   ├── hooks/        # useAuth, useCart, useWishlist, useProducts
│   │   ├── pages/        # Public, Auth and User views (no admin views)
│   │   ├── services/     # Axios API modules (api.js, authApi, productApi, orderApi, etc.)
│   │   ├── utils/        # Currency and date formatters
│   │   ├── App.jsx       # Storefront routes & guards
│   │   ├── main.jsx      # React DOM entry point
│   │   └── index.css     # Tailwind CSS & design system tokens
│   ├── vite.config.js    # Vite config (proxies /api to the server)
│   └── package.json
│
├── admin/                # ADMIN PORTAL (port 5174) - its own app, its own login
│   ├── src/
│   │   ├── components/   # AdminLayout, AdminSidebar, AdminHeader, AdminRoute, StatCard
│   │   ├── context/      # AuthContext (admin-only: refuses non-admin sessions)
│   │   ├── hooks/        # useAuth
│   │   ├── pages/        # Login, Dashboard, ProductList, CategoryList, OrderList, etc.
│   │   ├── services/     # Axios modules using their own admin token key
│   │   ├── App.jsx       # Admin routes (/login public, everything else guarded)
│   │   ├── main.jsx      # React DOM entry point
│   │   └── index.css     # Tailwind CSS & design system tokens
│   ├── vite.config.js    # Vite config (proxies /api to the same server)
│   └── package.json
│
├── .env.example
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/bazaro`) or MongoDB Atlas URI

### Step 1: Clone & Configure Server
```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Create environment file from sample
cp .env.example .env
```

Ensure `server/.env` contains your settings:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bazaro
JWT_SECRET=bazaro_super_secret_jwt_key_2026_production_grade
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
RAZORPAY_KEY_ID=rzp_test_bazaro_key_id
RAZORPAY_KEY_SECRET=rzp_test_bazaro_key_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Step 2: Seed the Database
Populate MongoDB with 42 realistic clothing products across 6 categories, plus banners, coupons, a default admin, and a test user.

> **Warning:** the seeder wipes every collection (users, categories, products, orders, reviews, coupons, banners) before inserting. Check which database `server/.env` points at before running it.
```bash
# Run database seeder
npm run seed
```

### Step 3: Run Backend Server
```bash
# Start backend server in development mode
npm run dev
# Server runs on http://localhost:5000
```

### Step 4: Run the Storefront
Open a new terminal window:
```bash
cd client
npm install
npm run dev
# Storefront runs on http://localhost:5173
```

### Step 5: Run the Admin Portal
Open a third terminal window:
```bash
cd admin
npm install
npm run dev
# Admin portal runs on http://localhost:5174
```

The storefront and the admin portal are **two separate frontend apps sharing one backend**.
Both proxy `/api` to `http://localhost:5000`, so the `server/` folder needs no changes.

| App | Folder | Dev URL | Login page |
|---|---|---|---|
| Storefront | `client/` | http://localhost:5173 | `/login` (customers) |
| Admin Portal | `admin/` | http://localhost:5174 | `/login` (admins only) |
| API Server | `server/` | http://localhost:5000 | — |

Each app stores its session under its own `localStorage` keys (`bazaro_token` vs
`bazaro_admin_token`), so signing in to one never signs you in to the other.

---

## 🔑 Development Test Credentials

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Executive Admin** | `admin@bazaro.com` | `Admin@123456` | Admin Portal (`:5174`) - Product/Order/Category CRUD |
| **Standard User** | `user@bazaro.com` | `User@123456` | Storefront (`:5173`) - Cart, Checkout, Profile |

> **Note**: Customer accounts cannot sign in to the admin portal. Signing in at `http://localhost:5174/login` with `user@bazaro.com` is rejected and no session is stored.

---

## 💳 Razorpay Payment Gateway Integration

Bazaro enforces **server-side price validation**:
1. When a customer initiates checkout, the backend fetches true product prices and stock counts from MongoDB.
2. The backend creates a Razorpay order (`razorpay.orders.create`) and returns the `order_id` to the frontend SDK.
3. Upon payment completion in the Razorpay Modal, the response (`razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`) is verified on the backend using **HMAC SHA256**:
   $$\text{Expected Signature} = \text{HMAC-SHA256}(\text{order\_id} + "|" + \text{payment\_id}, \text{RAZORPAY\_KEY\_SECRET})$$
4. Only upon cryptographic signature match is the order status updated to `Confirmed` and product stock decremented in MongoDB.

---

## 🚀 Customization Guide for Freelance Clients

To adapt this codebase for a client brand:
1. **Branding & Colors**: Modify color CSS variables in `client/src/index.css` and `admin/src/index.css` (`--primary`, `--font-heading`).
2. **Categories & Seed Data**: Add departments from **Admin Portal > Categories** (they appear in the navbar immediately), or edit `server/seed/seedData.js` for a different starting catalogue. Products are added at `http://localhost:5174/products/add`.
3. **Cloudinary**: Replace Cloudinary keys in `server/.env` to store uploaded image files in the client's Cloudinary account.
4. **Razorpay**: Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `server/.env` with the client's Razorpay merchant account keys.
