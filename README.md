# 🍽️ Roka Restaurant

A full-stack restaurant web application with online ordering, reservations, and an AI-powered assistant.

🚀 Live Demo
https://roka-restaurant-9bzp.onrender.com

---

## ✨ Features

* 🍽️ Interactive Menu Page (dynamic rendering with EJS)
* 🛒 Cart & Checkout system (localStorage + backend integration)
* 📅 Reservation system (guest & authenticated users)
* 🔐 JWT-based authentication & role-based authorization
* 👨‍🍳 Admin panel for menu & order management (protected routes)
* 🤖 AI-powered chatbot assistant (StackAI integration)
* 📦 RESTful API architecture
* ☁️ Cloud database with MongoDB Atlas
* 🐳 Dockerized backend
* 🚀 Deployed on Render

---

## 🤖 Roka Assistant (AI Chatbot)

Roka includes an AI-powered assistant that helps users interact with the system.

### 💬 You can ask:

* "What are the most popular dishes?"
* "Do you have vegetarian options?"
* "What are your prices?"
* "Can I make a reservation?"
* "What are your opening hours?"
* "What do you recommend?"

The chatbot enhances the user experience by providing instant responses and guidance.

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js

### Frontend

* EJS (Server-side rendering)
* Vanilla JavaScript
* CSS

### Database

* MongoDB Atlas

### Infrastructure

* Docker
* Render

### Authentication

* JSON Web Token (JWT)

---

## 📸 Screenshots

*Add your screenshots here for better presentation*

Example:

![Home](./public/images/home.png)

---

## 🌐 Live Deployment

The application is deployed on Render:

👉 https://roka-restaurant-9bzp.onrender.com

---

## 📡 API Endpoints

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`

### Orders

* POST `/api/orders`
* GET `/api/orders/myorders`

### Reservations

* POST `/api/reservations`
* GET `/api/reservations/myreservations`

### Menu

* GET `/api/menu`
* POST `/api/menu` (admin)

---

## 🐳 Docker Setup

Build the image:

```bash
docker build -t roka-restaurant .
```

Run container:

```bash
docker run -p 3000:3000 roka-restaurant
```

---

## 💻 Local Development

Install dependencies:

```bash
npm install
```

Run server:

```bash
npm run dev
```

---

## 🚧 Project Status

The project is actively developed and continuously improved.

---

## 🔮 Future Improvements

* 💳 Payment integration (Stripe)
* 📊 Advanced admin dashboard
* 📦 Order tracking system
* 📄 Swagger API documentation
* ⚡ Performance optimization
* 🤖 Smarter chatbot responses

---

## 👩‍💻 Author

**Beyza Tatlıdil**

