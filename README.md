# 📚 BookVerse – Online Bookstore Management System

BookVerse is a full-stack online bookstore management system developed as a university semester project using the **MERN stack**. The system allows customers to browse books, search and filter books, manage their shopping cart, place orders, and view their profiles and order history. Administrators can manage books, categories, users, inventory, and orders through an admin dashboard.

## 📖 Project Overview

The main goal of BookVerse is to provide a simple and user-friendly online platform for buying and managing books.

The system consists of two main parts:

* **Frontend:** React.js application for customer and administrator interaction.
* **Backend:** Node.js and Express.js REST API connected to MongoDB Atlas.

## ✨ Main Features

### 👤 Customer Features

* User registration
* User login and authentication
* Browse books
* Search books
* Filter books by category
* View book information
* Add books to shopping cart
* Update cart items
* Remove items from cart
* Place orders
* View order history
* View user profile

### 👨‍💼 Administrator Features

* Admin dashboard
* Add books
* Update books
* Delete books
* Manage book categories
* Manage inventory
* View and manage orders
* View and manage users

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* Bootstrap 5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB Atlas
* Mongoose

### Authentication & Security

* JSON Web Token (JWT)
* bcryptjs
* Environment variables

### Development & Deployment

* Git
* GitHub
* Vercel – Frontend deployment
* Render – Backend deployment
* Visual Studio Code

## 📂 Project Structure

```text
BookVerse/
│
├── src/                    # React frontend
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
├── public/                 # Public frontend assets
│
├── server/                 # Node.js + Express backend
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── seedBooks.js
│   └── package.json
│
├── package.json            # Frontend configuration
├── vite.config.js
├── .gitignore
└── README.md
```

## 🔐 Environment Variables

Sensitive configuration values are stored in environment variables and are **not committed to GitHub**.

The backend uses a `.env` file containing configuration such as:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

The actual `.env` file is excluded through `.gitignore`.

## 🚀 Running the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/prottasapk13/BookVerse.git
cd BookVerse
```

### 2. Install Frontend Dependencies

From the project root:

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Configure Backend Environment Variables

Create:

```text
server/.env
```

and add the required MongoDB and JWT configuration.

### 5. Start the Backend

Inside the `server` folder:

```bash
npm start
```

For development:

```bash
npm run dev
```

### 6. Start the Frontend

Open another terminal and return to the project root:

```bash
cd ..
npm run dev
```

The Vite development server will provide the local frontend address.

## 🌐 Deployment

The BookVerse frontend and backend have been deployed separately.

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

The deployed frontend communicates with the deployed backend through REST API endpoints.

**Live Frontend:**
https://book-verse-seven-wine.vercel.app/

**Backend:**
https://bookverse-backend-hy7j.onrender.com/

## 📊 API Route Groups

The backend provides API routes for:

```text
/api/auth
/api/books
/api/orders
/api/admin
```

These routes handle authentication, books, orders, categories, users, and administrative operations.

## 🔄 System Workflow

```text
User
  │
  ▼
React Frontend
  │
  │ REST API Requests
  ▼
Express.js Backend
  │
  ▼
Mongoose
  │
  ▼
MongoDB Atlas
```

## 🎯 Project Status

The core BookVerse system has been implemented and deployed as part of the **CSE 323: Web Programming Lab** semester project.

## 🔮 Future Enhancements

Possible future improvements include:

* Wishlist
* Book reviews and ratings
* Coupon system
* Best-selling books section
* Recently viewed books
* Password reset
* Email notifications
* Sales reports
* Dark mode
* Online payment integration

## 👨‍💻 Developer

**Prottasa Chanda**

Student ID: **232-115-084**

Department of Computer Science & Engineering (CSE)

Metropolitan University

Course: **CSE 323 – Web Programming Lab**

Supervisor: **Abu Jafar Md Jakaria**
Senior Lecturer

## 📄 License

This project was developed for academic purposes as part of a university semester project.
