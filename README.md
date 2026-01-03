<div align="center">

<!-- ===================== BANNER ===================== -->
<img src="https://raw.githubusercontent.com/your-username/SocioGram/main/assets/banner.png" width="100%" />

# 🌐 **SocioGram**
### _A MERN-Based Social Media Web Application_

📸 Share • 💬 Interact • 🤝 Connect  

<br/>

<img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,js,html,css,git,github" />

<br/><br/>

![Stack](https://img.shields.io/badge/Stack-MERN-00c9a7?style=for-the-badge)
![Auth](https://img.shields.io/badge/Auth-JWT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

</div>

---

## ✨ Overview

**SocioGram** is a full-stack **social media web application** built using the **MERN stack**.  
It allows users to create posts, interact through likes and comments, and connect with other users through a follow system.

The project focuses on:
- Secure user authentication
- Core social media interactions
- Clean and modular architecture
- Scalable backend design

---

## 🌟 Core Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication
- User registration & login
- Password hashing
- JWT-based authentication
- Protected routes

</td>
<td width="50%">

### 👤 User System
- User profiles
- Follow & unfollow users
- Fetch user data
- Seed users for testing

</td>
</tr>

<tr>
<td width="50%">

### 📝 Posts & Timeline
- Create posts
- Like & unlike posts
- Comment on posts
- Timeline feed

</td>
<td width="50%">

### 🧭 Application Flow
- Protected frontend routes
- Global user state via Context API
- Modular UI components

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### 🎨 Frontend
<img src="https://skillicons.dev/icons?i=react,js,html,css" />

- React.js
- JavaScript (ES6+)
- HTML5 & CSS3
- Context API
- Protected routing

### ⚙️ Backend
<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" />

- Node.js
- Express.js
- MongoDB
- Mongoose
- RESTful APIs
- JWT Authentication

### 🧰 Tools
<img src="https://skillicons.dev/icons?i=git,github" />

- Git & GitHub
- VS Code

---

## 📁 Project Structure

```text
SocioGram/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authcontroller.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── post.js
│   │   └── user.js
│   ├── SeedUsers.js
│   ├── clearUser.js
│   └── index.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── SidebarNavbar.js
│   │   │   ├── Timeline.js
│   │   │   ├── PostCardModal.js
│   │   │   └── ProtectedRoute.js
│   │   │
│   │   ├── context/
│   │   │   ├── UserContext.js
│   │   │   └── SocketContext.js
│   │   │
│   │   ├── utils/
│   │   │   └── postActions.js
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   └── package.json
│
├── .env
└── README.md

```
### ⚙️ Environment Variables

Create a .env file inside the server/ directory:
```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### 🧪 Local Setup

1️⃣ Clone the Repository
```text
git clone https://github.com/your-username/SocioGram.git
cd SocioGram
```

2️⃣ Backend Setup
```text
cd backend
npm install
npm start

```
3️⃣ Frontend Setup
```text
cd frontend
npm install
npm start

```
