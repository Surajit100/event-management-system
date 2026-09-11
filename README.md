# Event Management System

A full-stack Event Management System built with **React, Node.js, Express.js, MySQL, and Sequelize**.

The application allows users to register and log in, browse events, register for events, manage their registrations, and receive ticket/registration information. Administrators can create, update, publish, and manage events.

## 🚀 Features

### User Features

* User registration and login
* JWT-based authentication
* Browse available events
* View event details
* Register for events
* View registered events
* Ticket generation
* Email confirmation

### Admin Features

* Admin authentication
* Create events
* Update events
* Delete events
* Publish and manage events
* View event registrations

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* REST API
* JWT Authentication
* bcrypt
* Nodemailer

### Database

* MySQL
* Sequelize ORM

### Development Tools

* Git & GitHub
* Postman
* MySQL Workbench

## 📁 Project Structure

```text
event-management-sequelize/
│
├── client/
│   ├── public/
│   └── src/
│       ├── pages/
│       ├── assets/
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🔐 Authentication

The application uses **JWT (JSON Web Tokens)** for authentication.

Passwords are securely hashed using **bcrypt**.

Protected routes use authentication middleware to verify the user's JWT token.

## 🗄️ Database

The backend uses **MySQL** with **Sequelize ORM**.

Main models include:

* User
* Event
* Registration
* Ticket

Relationships are handled using Sequelize associations.

## 🔌 API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Events

```text
POST   /api/events
GET    /api/events
GET    /api/events/:id
PUT    /api/events/:id
DELETE /api/events/:id
```

### Event Registration

```text
POST   /api/events/:id/register
DELETE /api/events/:id/register
GET    /api/events/my-registrations
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Surajit100/event-management-system.git
```

### 2. Open the project

```bash
cd event-management-system
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Install backend dependencies

```bash
cd ../server
npm install
```

## 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=event_management
DB_PORT=3306

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

**Never commit your `.env` file or other secrets to GitHub.**

## ▶️ Running the Application

### Start the backend

```bash
cd server
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite will provide the frontend URL in the terminal.

## 🧪 API Testing

Backend APIs were tested using **Postman**.

The database can be managed and inspected using **MySQL Workbench**.

## 📌 Future Improvements

* Online payment integration
* Event search and filtering
* Improved email verification
* QR-code ticket scanning
* Event image upload
* User profile management
* Event reviews and ratings
* Deployment to a cloud platform

## 👨‍💻 Author

**Surajit Bhattacharjee**

GitHub: https://github.com/Surajit100
