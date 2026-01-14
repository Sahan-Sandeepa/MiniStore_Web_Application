# 🛒 MiniStore – Full Stack E-Commerce Application

MiniStore is a **full-stack e-commerce application** built with **ASP.NET Core Web API** and **React + TypeScript**.  
It implements **secure authentication, role-based authorisation, admin dashboards, and product management**.

This project follows **real-world architecture and best practices**, including JWT authentication, clean separation of concerns, and frontend/backend responsibility boundaries.

---

## 📌 Features

### 🔐 Authentication & Authorization
- User registration & login
- JWT-based authentication
- Refresh token support
- Role-based authorization (`Admin`, `Customer`)
- Secure route protection (frontend + backend)

### 👤 Roles
- **Admin**
  - Product management (Create, Update, Delete)
  - Inventory & stock monitoring
  - View and manage customer orders
  - Update order statuses
  - Admin dashboard with system insights
- **Customer**
  - Browse products
  - View product details
  - Add products to cart
  - Place orders
  - View order history
  - Cancel eligible orders
    
### 🛒 Shopping & Orders

  - Client-side shopping cart
  - Checkout flow with confirmation
  - Payment method selection (Card / Cash on Delivery)
  - Order creation and persistence
  - Order history with item-level details
  - Order status tracking

### 📦 Products
- Product listing
- Admin dashboard product overview
- Stock & inventory value calculations

### 🎨 UI / UX
- Responsive UI with Tailwind CSS
- Dark mode support
- Smooth animations using Framer Motion
- Protected and role-based routing
- Toast-based feedback for user actions
- Optimistic UI updates for better UX

### ⚙️ Non-Functional Features

  - Clean Architecture
  - Soft deletes
  - Centralised error handling
  - Loading & empty states
  - Secure API boundaries
  - Environment-based configuration
  - Scalable project structure
---

## 🏗️ Tech Stack

### Backend
- **ASP.NET Core Web API**
- **Entity Framework Core**
- **JWT Authentication**
- **PostgreSQL (current)**
- **SQL Server compatible (architecture)**
- **Redis**
- **Elasticsearch**
- **Clean Architecture**
  - Core
  - Infrastructure
  - API
- **Docker**

### Frontend
- **React 19**
- **TypeScript**
- **React Router DOM**
- **Axios**
- **Tailwind CSS**
- **Framer Motion**
- **jwt-decode**
- **react-hot-toast**
---

### 🚧 Future Enhancements

  - Payment gateway integration
  - Product reviews & ratings
  - User profile management
  - Wishlist persistence
  - Advanced search & filtering
  - Image storage using cloud services
