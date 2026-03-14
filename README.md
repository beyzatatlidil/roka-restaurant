# Roka Restaurant API

Backend for a restaurant reservation and online ordering system.

This project includes authentication, order management, reservations, and an admin interface for managing menu items.

Live API  
https://roka-restaurant-9bzp.onrender.com

## Features

- User authentication with JWT
- Role-based access (Customer / Manager)
- Online ordering system
- Reservation management
- Admin panel for menu management
- Chatbot assistant for menu and reservation help

## Tech Stack

Node.js  
Express.js  
MongoDB Atlas  
EJS  
Render

## API Endpoints

Authentication
POST /api/users/register  
POST /api/users/login  

Orders
POST /api/orders  
GET /api/orders/myorders  

Reservations
POST /api/reservations  
GET /api/reservations/myreservations  

## Deployment

The backend is deployed on Render and connected to a MongoDB Atlas database.

## Future Improvements

- Payment integration
- Docker containerization
- API documentation (Swagger)
## Future Improvements

- Payment integration
- Docker containerization
- API documentation (Swagger)
