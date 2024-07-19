Google Keep Clone

A clone of the Google Keep application built using Node.js, Express, MongoDB, and basic frontend technologies. This project demonstrates user authentication, note management, and basic CRUD operations.

Features

User Registration and Login: Allows users to create an account and log in.

Note Management: Users can add, edit, view, and delete notes.

User Authentication: Secured API endpoints using JSON Web Tokens (JWT).

Responsive Design: User interface adjusts for desktop and mobile views.

Tech Stack

Backend: Node.js, Express.js, MongoDB

Frontend: HTML, CSS, JavaScript

Authentication: JWT (JSON Web Tokens)

Database: MongoDB with Mongoose

Password Hashing: bcryptjs

Installation

Prerequisites

Node.js (v16 or higher)
MongoDB (Local or Cloud)
Clone the Repository
bash
git clone https://github.com/Bhargavi2769/google-note.git

cd google-keep-clone

Install Dependencies
bash
npm install

Run the Application
bash
npm start
The server will start on http://localhost:3000.

Usage

API Endpoints

Register: POST /api/register

Body: { "username": "your_username", "password": "your_password" }
Login: POST /api/login

Body: { "username": "your_username", "password": "your_password" }
Response: { "token": "jwt_token" }
Create Note: POST /api/notes

Headers: Authorization: Bearer <jwt_token>
Body: { "text": "Note text", "label": "Note label" }
Get Notes: GET /api/notes

Headers: Authorization: Bearer <jwt_token>
Update Note: PUT /api/notes/:id

Headers: Authorization: Bearer <jwt_token>
Body: { "text": "Updated note text", "label": "Updated label" }
Delete Note: DELETE /api/notes/:id

Headers: Authorization: Bearer <jwt_token>
Frontend
Open public/index.html in your browser to access the application.

Contributing
Feel free to submit issues or pull requests. For significant changes, please open an issue first to discuss what you would like to change.

License
This project is licensed under the MIT License - see the LICENSE file for details.








