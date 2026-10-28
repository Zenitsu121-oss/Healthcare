# Healthcare User Management System

A fullstack healthcare user & staff management portal built with **React** (Frontend), **Express.js** (Backend), and **MongoDB** (Database), designed directly from the Excalidraw architectural whiteboard specification.

---

## 📋 Feature Breakdown (From Whiteboard)

| Whiteboard Box | Requirement | Implementation | Status |
| :--- | :--- | :--- | :---: |
| **Feature: User creation** | `Email * (unique)`, `Password *`, `Name *`, `Age`, `Mobilenumber` | `POST /api/auth/register` (hashes password with bcrypt, enforces uniqueness) | ✅ Tested |
| **Feature: User Login** | `Email`, `password` | `POST /api/auth/login` (verifies hash, issues JWT token) | ✅ Tested |
| **Feature: User Get** | Get all user list, **Should not show password** | `GET /api/users` (sanitizes output using `.select('-password')`) | ✅ Tested |
| **Feature: User get by id** | Get a particular user | `GET /api/users/:id` (returns specific user without exposing password) | ✅ Tested |
| **Feature: User Update** | **Ask password & match**, Update user details | `PUT /api/users/:id` (verifies actor password before applying updates) | ✅ Tested |
| **Feature: User Delete** | **Ask password & match**, Delete user, **Prevent from deleting own data** | `DELETE /api/users/:id` (enforces password match & blocks self-deletion with HTTP 403) | ✅ Tested |
| **UI PAGE** | Signup page, Login page, Home screen with list, Search option, View individual details page, Update button & UI, Delete button & UI, Website background image | Modern React App with glassmorphic cards, search bar, modals, and rich background | ✅ Tested |
| **Postman Collection** | **ALL api's should have postman collection** | Exported Postman Collection v2.1 at `postman/User_Management_API.postman_collection.json` | ✅ Exported |

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Vanilla CSS (Design system with glassmorphism, responsive grid, and custom dark mode), Lucide Icons
- **Backend**: Node.js, Express.js (ES Modules), Mongoose, JSON Web Tokens (JWT), bcryptjs, CORS, dotenv
- **Database**: MongoDB (Local or Atlas compatible)
- **API Testing**: Postman Collection (v2.1) & Automated verification test suite (`test_api.js`)

---

## 📁 Project Structure

```text
d:/health care/
├── backend/
│   ├── config/
│   │   └── db.js                        # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js            # Register, Login, Me endpoints
│   │   └── userController.js            # GetAll, GetById, Update, Delete
│   ├── middleware/
│   │   └── authMiddleware.js            # JWT Bearer token protection
│   ├── models/
│   │   └── User.js                      # User schema with bcrypt pre-save hook
│   ├── routes/
│   │   ├── authRoutes.js                # /api/auth router
│   │   └── userRoutes.js                # /api/users router
│   ├── .env                             # Environment configuration
│   ├── package.json
│   └── server.js                        # Express server entry point
│
├── frontend/
│   ├── public/
│   │   └── healthcare_bg.jpg            # Website background image
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Navigation bar & current user badge
│   │   │   ├── UserCard.jsx             # Individual user card in directory
│   │   │   ├── ViewUserDetailsModal.jsx # Individual details view
│   │   │   ├── UpdateUserModal.jsx      # Update form with password verification
│   │   │   ├── DeleteUserModal.jsx      # Delete dialog with self-delete block
│   │   │   └── CreateUserModal.jsx      # Quick user registration modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # React Authentication Context
│   │   ├── pages/
│   │   │   ├── HomePage.jsx             # Dashboard with stats, search & list
│   │   │   ├── LoginPage.jsx            # Sign in page
│   │   │   └── SignupPage.jsx           # Registration page
│   │   ├── services/
│   │   │   └── api.js                   # API client service
│   │   ├── App.jsx                      # App router & toast notifications
│   │   ├── index.css                    # Glassmorphism & responsive CSS
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── postman/
│   └── User_Management_API.postman_collection.json # Postman collection
├── test_api.js                          # Automated test suite
├── package.json                         # Workspace scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure MongoDB is running locally:
```powershell
Get-Service -Name "*mongo*"
```

### 2. Run the Backend Server
```bash
cd backend
npm install
npm run dev
```
The Express API runs at: `http://localhost:5000/api`

### 3. Run the Frontend App
```bash
cd frontend
npm install
npm run dev
```
The React web application opens at: `http://localhost:5174` (or `http://localhost:5173`)

### 4. Run Automated API Tests
To verify all endpoints and security policies:
```bash
npm run test:api
```

---

## 📬 Postman Collection Setup

1. Open **Postman**.
2. Click **Import** (top left).
3. Select the file: `postman/User_Management_API.postman_collection.json`.
4. The collection includes collection variables (`baseUrl`, `authToken`, `targetUserId`) and automatic test scripts that capture the JWT token upon login/registration.

### Included Requests in Postman:
1. `Auth & Creation > 1. User Creation (Signup / Register)`
2. `Auth & Creation > 2. User Login`
3. `Auth & Creation > 3. Get Current User Profile (Me)`
4. `User Management > 1. User Get (Get All User List - Passwords Hidden)`
5. `User Management > 2. User Search`
6. `User Management > 3. User Get By ID (Particular User)`
7. `User Management > 4. User Update (Ask Password & Match)`
8. `User Management > 5. User Delete (Ask Password & Match, Prevent Self-Delete)`
9. `Health Check > GET /api/health`

---

## 🔒 Security Highlights

1. **Password Protection**: Passwords are never returned in `GET /api/users` or `GET /api/users/:id`.
2. **Password Match on Sensitive Operations**: Both **Update** and **Delete** require the actor to enter their active password for confirmation.
3. **Self-Deletion Prevention Policy**: The system explicitly detects if a user attempts to delete their own account (`req.user._id === id`) and rejects the request with HTTP `403 Forbidden`.
