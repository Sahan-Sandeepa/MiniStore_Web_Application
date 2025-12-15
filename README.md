# 🛒 MiniStore – Full Stack E-Commerce Application

MiniStore is a **full-stack e-commerce application** built with **ASP.NET Core Web API** and **React + TypeScript**.  
It implements **secure authentication, role-based authorization, admin dashboards, and product management**.

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
  - Access admin dashboard
  - View inventory statistics
  - Manage products
- **Customer**
  - Browse products
  - Place orders

### 📦 Products
- Product listing
- Admin dashboard product overview
- Stock & inventory value calculations

### 🎨 UI / UX
- Responsive UI with Tailwind CSS
- Dark mode support
- Smooth animations using Framer Motion
- Protected and role-based routing

---

## 🏗️ Tech Stack

### Backend
- **ASP.NET Core Web API**
- **Entity Framework Core**
- **JWT Authentication**
- **SQL Server(PostgreSQL)**
- **Clean Architecture**
  - Core
  - Infrastructure
  - API

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
