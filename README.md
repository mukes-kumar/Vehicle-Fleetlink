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

vehicle-management/
│── backend/ # Express.js backend
│ ├── configs/ # Config files (DB, mail, etc.)
│ ├── controllers/ # Business logic
│ ├── middlewares/ # protect, admin middlewares
│ ├── models/ # MongoDB models
│ ├── routes/ # API routes
│ └── server.js # App entry point
│
│── frontend/ # React.js frontend
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── pages/ # Route pages
│ │ ├── utils/ # Helper functions
│ │ └── App.js # Router setup
│
│── README.md # Project documentation



## 🚀 Getting Started

### 1️⃣ Clone the repo
git clone https://github.com/your-username/vehicle-management.git
cd vehicle-management

2️⃣ Backend Setup
cd backend
npm install


Create a .env file inside backend/:


MONGODB_URI=mongodb+srv://<name>:<password>@cluster0.px7nqp8.mongodb.net....

JWT_SECRET= secret@2026...

IMAGEKIT_PUBLIC_KEY=public_Symf9rN1Fq7S....
IMAGEKIT_PRIVATE_KEY=private_7s7NZzGWYZG....
IMAGEKIT_URL_ENDPOINT=https://ik.im....

EMAIL_USER=mukesh.vin1222@gmail.com....
EMAIL_PASS= kbtp guht tkgc .....
# PORT=5000

Run the backend:
npm run server

3️⃣ Frontend Setup
cd frontend
npm install
npm start

Create a .env file inside frontend/:
VITE_CURRENCY = ₹ 
# VITE_BASE_URL=http://localhost:5000
VITE_BASE_URL=https://vehicle-fleetlink-system-server.vercel.app/

Run the Frontend:
npm run dev


📬 API Documentation

You can explore all APIs using Postman:
👉 Vehicle Management Postman Collection

Example APIs:

Register User → POST /api/users/register

Login → POST /api/users/login

Get Profile → GET /api/users/profile

Update Profile → PATCH /api/users/update-profile

Get All Users (Admin) → GET /api/users/

Add Vehicle (Admin) → POST /api/vehicles

Get Admin Vehicles → GET /api/vehicles/my-vehicles

Book Vehicle (User) → POST /api/bookings

see postman collections-- Vehicle System 

📸 Screenshots

Register page 
<img width="863" height="409" alt="image" src="https://github.com/user-attachments/assets/debae7ca-63df-483e-8e8b-a087d8d24ff1" />


Login Page 
<img width="872" height="401" alt="image" src="https://github.com/user-attachments/assets/29481229-146d-4924-bca5-9da43ba6c3e5" />

and this home page 
<img width="1797" height="804" alt="image" src="https://github.com/user-attachments/assets/50ac05fd-c1e7-42a6-b6b4-2218c6a2d29f" />
<img width="397" height="227" alt="image" src="https://github.com/user-attachments/assets/b0955250-d358-436c-8618-1ae406eed9f3" />

User Search Available Vehicle 
<img width="854" height="643" alt="image" src="https://github.com/user-attachments/assets/9b27a18c-b479-4ec8-b28b-1da7d3b521ff" />

User Booking Page 
<img width="1531" height="538" alt="image" src="https://github.com/user-attachments/assets/b8f44f44-b968-401d-8efc-d7e94f62548b" />

This Admin Login then see Admin Dashboard for only user Login
<img width="1884" height="824" alt="image" src="https://github.com/user-attachments/assets/23dd2e30-6640-4a5f-9705-03615dcb64e5" />

Add Vehicle Page only admin
<img width="1892" height="800" alt="image" src="https://github.com/user-attachments/assets/7afb1055-1903-4bf8-9e86-ee7f3983494c" />

Booking Approval Page only for Admin
<img width="1863" height="719" alt="image" src="https://github.com/user-attachments/assets/7139993c-b541-48dc-bcbf-be7f9767e831" />

All Admin Vehicle list
<img width="1888" height="790" alt="image" src="https://github.com/user-attachments/assets/146717a0-7244-4ecd-a2b0-e352b24d4abc" />


🔐 Auth Pages

Register
Login

🚙 Vehicle Management

Vehicle List
Booking Page

