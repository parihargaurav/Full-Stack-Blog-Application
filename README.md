# Full Stack Blog Application

A full-stack blog platform built with React, Tailwind CSS, Express, MongoDB, and Node.js.

## Overview

This project includes:

- A **React frontend** with client-side routing and a rich text editor.
- A **Node/Express backend** with JWT-based authentication and cookie sessions.
- A **MongoDB database** for users, posts, comments, claps, and reposts.
- Support for **cover image uploads** and **nested comment replies**.

## Features

- User registration and login
- Protected routes for creating and editing posts
- Post creation with title, summary, rich text content, and cover image upload
- Post editing for the original author only
- Home feed with latest posts
- Individual post page with:
  - author details
  - cover image
  - clap button (per-user clap tracking)
  - repost toggle
  - comments with reply support and delete own comment

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, React Quill
- Backend: Node.js, Express, Mongoose, JWT, Multer
- Database: MongoDB
- Authentication: secure cookies and JSON Web Tokens

## Repository Structure

- `backend/` — Express API server
- `frontend/` — React application
- `backend/uploads/` — uploaded cover images served statically

## Backend Setup

### Install dependencies

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file inside `backend/` with:

```env
PORT=4000
MONGO_URL=your-mongodb-connection-string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### Run the backend

```bash
npm run dev
```

or

```bash
npm start
```

### API Endpoints

- `POST /register` — register a new user
- `POST /login` — login and receive a cookie token
- `GET /profile` — fetch current user profile
- `POST /logout` — clear auth cookie
- `GET /post` — fetch latest posts
- `GET /post/:id` — fetch a single post
- `POST /post` — create a post (authenticated)
- `PUT /post` — update a post (authenticated, author only)
- `POST /post/:id/clap` — clap a post (authenticated)
- `POST /post/:id/repost` — repost/undo repost (authenticated)
- `GET /comments/:postId` — fetch comments for a post
- `POST /comments/:postId` — create a comment or reply (authenticated)
- `DELETE /comments/:id` — delete own comment (authenticated)

## Frontend Setup

### Install dependencies

```bash
cd frontend
npm install
```

### Run the frontend

```bash
npm start
```

### App Routes

- `/` — home feed with posts
- `/login` — login page
- `/register` — registration page
- `/create` — create a new post
- `/post/:id` — post detail page
- `/edit/:id` — edit your own post

## Notes

- The frontend requests backend routes at `http://localhost:4000`.
- Authenticated requests send cookies using `credentials: "include"`.
- Uploaded images are served from `backend/uploads`.
- The backend verifies JWT tokens from cookies on protected routes.

## Development Tips

- Start backend first so the frontend can connect to the API.
- Make sure MongoDB is running and `MONGO_URL` is valid.
- Use `npm run dev` in backend for auto-reload with `nodemon`.
