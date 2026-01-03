<div align="center">

<!-- ===================== BANNER ===================== -->
<img src="https://raw.githubusercontent.com/your-username/SocioGram/main/assets/banner.png" width="100%" />

# 🌐 **SocioGram**
### _A Full-Stack Social Media Web Application_

📸 Share • 💬 Connect • ❤️ Engage  

<br/>

<img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,js,html,css,git,github" />

<br/><br/>

![Stack](https://img.shields.io/badge/Stack-MERN-00c9a7?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Auth](https://img.shields.io/badge/Auth-JWT-blue?style=for-the-badge)

</div>

---

## ✨ Overview

**SocioGram** is a full-stack **social media web application** that allows users to  
connect with others, share posts, like and comment, and manage their personal profiles.

The project focuses on:
- Secure authentication
- Real-time-like social interactions
- Clean and modern UI
- Scalable backend architecture

---

## 🌟 Key Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Security
- User signup & login
- JWT-based authentication
- Password reset functionality
- Protected routes

</td>
<td width="50%">

### 👤 User Profiles
- View public user profiles
- Follow & unfollow users
- User suggestions
- Profile-based post feed

</td>
</tr>

<tr>
<td width="50%">

### 🖼️ Posts & Timeline
- Create image & text posts
- Like & unlike posts
- Comment on posts
- Timeline feed

</td>
<td width="50%">

### 💬 Social Features
- User discovery
- Real-time ready socket context
- Interactive UI components
- Responsive design

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
- Protected Routing

### ⚙️ Backend
<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" />

- Node.js
- Express.js
- MongoDB
- REST APIs
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
│   ├── routes/
│   ├── SeedUsers.js
│   ├── clearUser.js
│   └── index.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── SidebarNavbar.js
│   │   │   ├── TimeLine.js
│   │   │   ├── PostCardModal.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   ├── UserContext.js
│   │   │   └── SocketContext.js
│   │   ├── utils/
│   │   │   └── postActions.js
│   │   └── App.js
│   └── package.json
│
├── .env
└── README.md
```
