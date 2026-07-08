# ⚡ RentoMojo - Electronics Rental & Purchase Platform

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform inspired by RentoMojo, featuring both **rent** and **buy** options for electronics, Razorpay payment integration, and an admin dashboard.

---

## 🚀 Features

### Customer Features
- 🔐 **Auth** — Register, Login, JWT-based session
- 🛒 **Buy & Rent** — Purchase products or choose flexible rental plans (3/6/12 months)
- 🛍️ **Cart** — Add, update, remove items (buy or rental)
- ❤️ **Wishlist** — Save favourite products
- 💳 **Razorpay Payment** — Secure online payments (UPI, Cards, Net Banking, Wallets)
- 📦 **Orders** — Track, view & cancel orders
- ⭐ **Reviews** — Rate and review products
- 👤 **Profile** — Manage addresses, change password

### Admin Features
- 📊 **Dashboard** — Revenue, orders, users, top products
- 🛍️ **Product Management** — Add, update, delete products with rental plans
- 📦 **Order Management** — Update order status
- 👥 **User Management** — View, change roles, delete users

### Categories Supported
Television · Refrigerator · Washing Machine · Air Conditioner · Laptop · Smartphone · Microwave · Geyser

---

## 🗂 Project Structure

```
E-Commerce for Electronics/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        ├── store/
        └── utils/
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay account (test keys)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, Razorpay keys, etc.
npm run dev
```

### 2. Seed Database

```bash
cd backend
node utils/seedData.js
```

This creates:
- **Admin:** admin@rentomojo.com / Admin@123
- **User:** user@test.com / Test@123
- 12 sample products

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 4. Open Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🔑 Environment Variables (backend/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/rentomojo
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
CLIENT_URL=http://localhost:3000
```

---

## 💳 Razorpay Integration

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get test API keys from Dashboard → Settings → API Keys
3. Add keys to `backend/.env`
4. Add `REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxx` to `frontend/.env`

Test card: **4111 1111 1111 1111** | Any expiry | Any CVV

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Redux Toolkit, React Router v6 |
| Styling | Custom CSS (no UI library) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Payment | Razorpay |
| State | Redux Toolkit |
| HTTP | Axios |

---

## 📸 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@rentomojo.com | Admin@123 |
| User | user@test.com | Test@123 |
