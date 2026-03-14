# Roka Restaurant API

Backend for a restaurant reservation and online ordering system.

Live Demo:  
https://roka-restaurant-9bzp.onrender.com

This project provides a RESTful backend for managing restaurant reservations, online orders, menu items, and user authentication. It also includes a chatbot assistant that helps customers with menu information and reservation questions.

---

# Features

- JWT-based authentication system
- Role-based access control (Customer / Manager)
- Online ordering system
- Reservation management
- Admin panel for menu management
- Chatbot assistant for menu and reservation queries
- RESTful API architecture
- Cloud database integration with MongoDB Atlas
- Dockerized backend setup
- Deployment on Render

---

# Tech Stack

Backend  
- Node.js  
- Express.js  

Database  
- MongoDB Atlas  

Frontend Rendering  
- EJS  

Infrastructure  
- Docker  
- Render  

Authentication  
- JSON Web Token (JWT)

---

# Live Deployment

The backend is deployed on Render and connected to MongoDB Atlas.

Production URL

https://roka-restaurant-9bzp.onrender.com

---

# API Endpoints

## Authentication

Register user

POST /api/auth/register

Login

POST /api/auth/login

---

## Orders

Create order

POST /api/orders

Get user orders

GET /api/orders/myorders

---

## Reservations

Create reservation

POST /api/reservations

Get user reservations

GET /api/reservations/myreservations

---

## Menu

Get menu items

GET /api/menu

Add menu item (admin)

POST /api/menu

---

# Chatbot Assistant

The system integrates a chatbot built using StackAI to assist users with:

- Menu information
- Reservation questions
- Basic navigation of the ordering system

The chatbot improves the user experience by helping customers quickly find relevant information.

---

# Docker Setup

This project supports running the backend inside a Docker container.

Build the Docker image

```bash
docker build -t roka-restaurant .
```

Run the container

```bash
docker run -p 3000:3000 roka-restaurant
```

Then open:

```
http://localhost:3000
```

---

# Local Development

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

---

# Project Status

The project is currently live and functional.  
New improvements are planned to expand the system.

---

# Future Improvements

Planned features for the next versions:

- Swagger API documentation
- Payment system integration (Stripe test environment)
- Improved admin dashboard
- Order status tracking
- API rate limiting
- Better chatbot responses

---

# Author

Beyza Tatlıdil
