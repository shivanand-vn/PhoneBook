# Smart Phonebook Search Engine

An enterprise-grade, high-performance **Multi-User Contact Management Platform** designed as a premium SaaS application. This project features user isolation workspaces, a debounced smart search system with compound database indexing, responsive layouts, customizable tags, and advanced third-party integrations.

---

## 🚀 Project Overview

The Smart Phonebook Search Engine is built for professionals and teams who need a secure, beautiful, and lightning-fast directory system to manage their contact networks at scale. 

- **Multi-User Contact Isolation**: Strict workspace boundary isolation. User A can never access, search, or mutate User B's contacts.
- **Smart Search Engine**: Dynamic, case-insensitive, and partial matching search across Name, Phone number, Email, and Company fields.
- **Advanced Integrations**:
  - Cloudinary for premium profile image uploads.
  - Brevo (formerly Sendinblue) SMTP for secure verification and "Forgot Password" recovery.
- **Modern UI/UX**: High-performance dashboard with glassmorphism design tokens, micro-animations, real-time autocomplete suggestions, light/dark theme switching, and fully responsive layouts.

---

## ✨ Features

- 🔑 **Authentication & JWT Security**: High-security session guarding via JSON Web Tokens (JWT) stored client-side.
- 📂 **Contact CRUD**: Full Create, Read, Update, and Delete operations for contact records.
- 🔍 **Smart Autocomplete & Search Suggestions**: Instant real-time fuzzy matching dropdown as you type, highlighting query matches.
- ⚡ **Real-Time Debounced Searching**: Minimizes API request spam by grouping keystrokes.
- ⭐ **Favorites**: Mark important contacts as favorites for quick one-click filtering.
- 🏷️ **Custom Tagging**: Categorize contacts with tags and filter segments instantly.
- 📊 **Advanced Analytics**: Clean dashboard widgets showing quick database statistics.
- ✉️ **Password Recovery**: Secure password reset flow using custom-generated email templates sent via Brevo.
- ☁️ **Cloud Storage**: Secure profile picture storage with automated image compression on Cloudinary.
- 🎨 **Sleek Themes**: Responsive Glassmorphism components supporting Dark/Light Mode.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Functional components, hooks)
- **Vite** (Next-generation lightning-fast build tool)
- **Tailwind CSS** (Utility-first styling framework)
- **React Router DOM v6** (Client-side routing)

### Backend
- **Node.js** & **Express.js** (REST API)
- **MongoDB** & **Mongoose** (Document database & ODM)
- **JWT** (Stateless authorization middleware)
- **Cloudinary SDK** (Media uploads management)
- **Brevo API/SMTP** (Transactional email system)

---

## 📂 Folder Structure

```text
PhoneBook/
├── client/                 # Frontend React application (Vite)
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── assets/         # Images, logos, and global design media
│   │   ├── components/     # Reusable UI components (Modals, Headers, Sidebar)
│   │   ├── context/        # React Context stores (Auth, Theme)
│   │   ├── layouts/        # Layout shells (Public, Auth, Dashboard)
│   │   ├── pages/          # View routes (Landing, Contacts, Login, Register, Profile)
│   │   ├── config/         # Centralized API fetch wrapper and environment configs
│   │   ├── index.css       # Design tokens, custom animations, and CSS variables
│   │   └── main.jsx        # App entry point
│   ├── tailwind.config.js  # Custom theme extensions and colors
│   └── vite.config.js      # Build configurations
│
├── server/                 # Backend REST API (Node/Express)
│   ├── src/
│   │   ├── config/         # Database and third-party integrations (Cloudinary, Brevo)
│   │   ├── controllers/    # Request handlers & search business logic
│   │   ├── middleware/     # JWT Guarding, Error handling, Multer storage
│   │   ├── models/         # MongoDB schema definitions (User, Contact)
│   │   ├── routes/         # Routing modules mapping endpoints to controllers
│   │   ├── validations/    # Request payload sanitization rules
│   │   └── app.js          # Express app configurations
│   ├── server.js           # Server runner and port listener
│   └── .env.example        # Environment variables template
│
├── vercel.json             # Vercel client deployment and rewrite routing rules
└── README.md               # Unified project documentation
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local installation
- Cloudinary developer account
- Brevo developer account

### Step 1: Clone the Repository
```bash
git clone https://github.com/shivanand-vn/PhoneBook.git
cd PhoneBook
```

### Step 2: Backend Configuration
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
4. Configure the environment variables (see below).
5. Spin up the development server:
   ```bash
   npm run dev
   ```

### Step 3: Frontend Configuration
1. Open a new terminal window and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
4. Configure the environment variables (see below).
5. Launch the React development server:
   ```bash
   npm run dev
   ```
**All set**
---
