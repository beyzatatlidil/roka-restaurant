# Roka Restaurant API

Backend for a restaurant reservation and online ordering system.

This project includes authentication, online ordering, reservations, an admin panel for menu management, and a chatbot assistant for customer support.

## Live Demo

https://roka-restaurant-9bzp.onrender.com

## Features

- JWT-based authentication
- Role-based access (Customer / Manager)
- Online ordering system
- Reservation management
- Admin panel for menu management
- Chatbot assistant for menu and reservation support
- RESTful API design
- Cloud database integration with MongoDB Atlas
- Dockerized backend setup
- Deployment on Render

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- EJS
- Docker
- Render

## Main Endpoints

### Auth
- POST /api/users/register
- POST /api/users/login

### Orders
- POST /api/orders
- GET /api/orders/myorders

### Reservations
- POST /api/reservations
- GET /api/reservations/myreservations

## Status

The project is live and still being improved with new features.

## Planned Improvements

- Payment integration
- Swagger documentation
- Container-based deployment improvements
