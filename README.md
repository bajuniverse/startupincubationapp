# Startup Incubation Management App

A **comprehensive full-stack web application** designed to streamline and manage **startup incubation programs**. This platform provides an end-to-end solution for **application management, mentor assignment, progress tracking, feedback collection, and event scheduling**.

Built using **Node.js**, **React**, and **MongoDB**, with modern DevOps practices for seamless deployment.

## Live Demo

- **Public URL:** [http://3.106.56.194](http://3.106.56.194)
- **Demo Credentials:**
  - Username: `admin@admin.com`
  - Password: `batingal`

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [CI/CD Pipeline](#cicd-pipeline)
- [API Documentation](#api-documentation)
- [Project Management](#project-management)
- [Contributors](#contributors)

---

## Features

- **User Authentication & Role Management**  
  Secure login and registration with JWT-based authentication, role-based access control (Admin, Mentor, Startup).
  
- **Startup Application Management**  
  Startups can submit applications, track status, and receive evaluations.

- **Mentor Assignment System**  
  Assign mentors to startups based on expertise, industry, or program needs.

- **Progress Tracking & Milestones**  
  Monitor startup development through milestone-based reporting.

- **Feedback System**  
  Exchange structured feedback between mentors and startups.

- **Demo Day & Event Scheduling**  
  Organize presentation events with automated scheduling and notifications.

- **Responsive & User-Friendly UI**  
  Fully responsive frontend optimized for mobile and desktop.

---

## Technology Stack

### Backend

- **Node.js** with **Express.js** for API handling
- **MongoDB** for NoSQL data storage
- **JWT Authentication** for secure sessions

### Frontend

- **React.js** with **React Router**
- **CSS** (Responsive Design with Flexbox/Grid)

### DevOps

- **GitHub Actions** for CI/CD automation
- **PM2** for production process management
- **AWS EC2** for cloud hosting

---

## Project Structure

```plaintext
startup-incubation-app/
├── backend/                # Node.js + Express backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── tests/              # Backend tests
├── frontend/               # React frontend
│   ├── public/             # Static files
│   └── src/                # React components and logic
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── context/        # React context providers
│       ├── services/       # API service functions
│       └── utils/          # Utility functions
└── .github/                # GitHub workflow configurations
    └── workflows/          # CI/CD workflow files
```

---

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas)
- Git

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/bajuniverse/startupincubationapp.git
   cd startupincubationapp
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

### Frontend Setup

1. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

2. Create a `.env` file in the frontend directory (optional for custom configuration):
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Database Setup

1. Ensure MongoDB is running on your local machine or you have access to a MongoDB Atlas cluster
2. The application will automatically create the required collections when it first connects to the database

---

## Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. In a separate terminal, start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Access the application at `http://localhost:3000`

### Production Mode

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend server:
   ```bash
   cd ../backend
   npm start
   ```

3. The complete application will be served from `http://localhost:5000`


---

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. The workflow includes:

1. Code checkout
2. Environment setup
3. Dependencies installation
4. Running tests
5. Building the frontend
6. Deployment to AWS EC2

Configuration: `.github/workflows/ci.yml`  
Deployment uses **PM2** with commands:

```bash
#backend 
pm2 start "npm run start" --name="backend"

# frontend
pm2 serve build/ 3000 --name="frontend" --spa
```

---

## API Documentation

The backend API provides the following endpoints:

- **Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login and get JWT token

- **Users**
  - `GET /api/users/profile` - Get user profile
  - `PUT /api/users/profile` - Update user profile

- **Applications**
  - `POST /api/applications` - Submit a new application
  - `GET /api/applications` - Get all applications
  - `GET /api/applications/:id` - Get application by ID
  - `PUT /api/applications/:id` - Update application
  - `DELETE /api/applications/:id` - Delete application

- **Feedback**
  - `POST /api/feedback` - Provide feedback
  - `GET /api/feedback` - Get all feedback
  - `PUT /api/feedback/:id` - Update feedback
  - `DELETE /api/feedback/:id` - Delete feedback

---

## Project Management

Agile-managed via **Jira**  
[Jira Board Link](https://connect-team-i9xogk3f.atlassian.net/jira/software/projects/SIM/boards/67)

---

## Contributors

- [bajuniverse](https://github.com/bajuniverse)
