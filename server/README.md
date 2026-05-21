# Phonebook AI API Server

This is the backend API server for the Smart Phonebook Search Engine.

## Tech Stack
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **JWT & bcryptjs** for authentication and password hashing
- **Multer & Cloudinary** for profile image handling and optimization
- **Brevo API** for transaction email and password reset workflows

## Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

## Setup & Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env` (copy from `.env.example`).

3. Start server in development mode:
   ```bash
   npm run dev
   ```

4. Start server in production mode:
   ```bash
   npm start
   ```

## API Documentation

### Authentication (`/api/auth`)
- `POST   /register` - Register a new user (form-data: name, email, password, avatar [file])
- `POST   /login` - Login with credentials (JSON: email, password)
- `POST   /forgot-password` - Request a password reset email (JSON: email)
- `POST   /reset-password` - Reset password (JSON: token, password)
- `GET    /profile` - Get logged-in user's profile (requires JWT)
- `POST   /logout` - Logout (requires JWT)

### Contacts (`/api/contacts`)
- `GET    /` - Get all contacts for user (supports page, limit, favorite, tag, company, sortBy query params) (requires JWT)
- `POST   /` - Add a contact (form-data: name, phone, email, company, address, tags, favorite, profileImage [file]) (requires JWT)
- `GET    /:id` - Get specific contact details (requires JWT)
- `PUT    /:id` - Edit contact details (form-data: name, phone, email, company, address, tags, favorite, profileImage [file]) (requires JWT)
- `DELETE /:id` - Delete contact (requires JWT)
- `GET    /search?q=query` - Live Smart Search across Name, Phone, Email, Company (requires JWT)
- `GET    /suggestions?q=query` - Autocomplete suggestions list (requires JWT)
- `PATCH  /:id/favorite` - Toggle favorite status (requires JWT)
