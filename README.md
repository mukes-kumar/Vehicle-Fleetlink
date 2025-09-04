# 🚗 Vehicle Management System

Vehicle Management System is a full-stack web application designed for **managing and booking logistics vehicles**.  
It includes authentication, role-based access control (Admin/User), vehicle management, and booking features.

---

## 📌 Features

### 👤 Authentication
- User & Admin Registration (`/api/users/register`)
- Login with JWT (`/api/users/login`)
- Protected Routes with Middleware
- Profile Management (`/api/users/profile`, `/api/users/update-profile`)

### 👨‍💼 Admin
- View all users
- Update user roles
- Add, update, delete vehicles
- View all bookings

### 🚙 User
- Browse available vehicles
- Book vehicles
- View personal bookings

### 📩 Email Notifications
- New user registration triggers **welcome email**
- Admin receives **new subscription alerts**

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- React Router
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Nodemailer (Email service)

---

## 📂 Project Structure

