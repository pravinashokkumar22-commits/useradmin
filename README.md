# Admin Dashboard — Full Stack Application

A full-featured admin dashboard built with **React**, **Node.js (Express)**, **PostgreSQL**, and **JWT authentication**.

---

## 🗂 Project Structure

```
admin-dashboard/
├── backend/                 # Node.js + Express API
│   ├── config/
│   │   ├── db.js            # PostgreSQL connection pool
│   │   └── schema.sql       # DB schema + seed data
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── contactController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT + role middleware
│   │   └── validation.js    # express-validator rules
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── contact.js
│   ├── server.js            # Express app entry
│   ├── .env.example
│   └── package.json
│
└── frontend/                # React SPA
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Auth/        # Login, Signup
    │   │   ├── Dashboard/   # Dashboard Home
    │   │   ├── Users/       # User Management (admin)
    │   │   ├── Contact/     # Contact Submissions (admin)
    │   │   ├── Profile/     # User Profile
    │   │   ├── Settings/    # Settings page
    │   │   ├── Layout/      # Sidebar + Header
    │   │   └── UI/          # Reusable components
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── utils/
    │   │   └── api.js       # Axios instance
    │   ├── styles/
    │   │   └── globals.css
    │   ├── App.jsx
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL 14+
- npm or yarn

---

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE admin_dashboard;
```

Run the schema file:

```bash
psql -U your_username -d admin_dashboard -f backend/config/schema.sql
```

This creates the `users` and `contact_submissions` tables and seeds demo data.

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/admin_dashboard
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

API will be available at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

App will be available at: `http://localhost:3000`

---

## 🔐 Demo Credentials

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@example.com    | admin123  |
| User  | john@example.com     | user123   |

> **Note:** The seed passwords in `schema.sql` use a placeholder bcrypt hash. For the demo to work, either use `bcryptjs` to generate real hashes or update the passwords via the API after first login.

**Generating a real bcrypt hash:**
```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('admin123', 10);
console.log(hash); // Use this in schema.sql
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint       | Auth | Description         |
|--------|----------------|------|---------------------|
| POST   | /api/signup    | ❌   | Register new user   |
| POST   | /api/login     | ❌   | Login, get JWT      |

### Profile

| Method | Endpoint       | Auth | Description             |
|--------|----------------|------|-------------------------|
| GET    | /api/profile   | ✅   | Get current user        |
| PUT    | /api/profile   | ✅   | Update current user     |

### User Management (Admin only)

| Method | Endpoint          | Auth  | Description       |
|--------|-------------------|-------|-------------------|
| GET    | /api/users        | Admin | List all users    |
| PUT    | /api/users/:id    | Admin | Update user       |
| DELETE | /api/users/:id    | Admin | Delete user       |

### Contact Submissions

| Method | Endpoint          | Auth  | Description             |
|--------|-------------------|-------|-------------------------|
| POST   | /api/contact      | ❌    | Submit contact form     |
| GET    | /api/contact      | Admin | List all submissions    |
| DELETE | /api/contact/:id  | Admin | Delete submission       |

---

### Request Headers (Protected Routes)

```
Authorization: Bearer <your_jwt_token>
```

---

## 🏗 Architecture & Design Decisions

### Backend

- **Express** for routing with modular route files
- **express-validator** for input validation with consistent error format
- **bcryptjs** for secure password hashing (never stored in plain text)
- **jsonwebtoken** for stateless JWT authentication
- **pg** (node-postgres) with connection pool for efficient DB connections
- Passwords are never returned in API responses
- Role-based middleware (`isAdmin`) separates admin/user access

### Frontend

- **React 18** with functional components and hooks
- **React Router v6** for client-side routing with protected routes
- **Axios** with interceptors for automatic token injection and 401 handling
- **Context API** for global auth state (no Redux needed)
- All UI components are custom-built for full control and easy customization
- CSS variables for consistent theming across the whole app

---

## 🎨 UI Features

- Dark sidebar navigation with role-based menu items
- Stats overview cards on admin dashboard
- User management grid with search + role filter
- Contact submissions table with preview + full-message modal
- Profile view/edit with inline editing
- Settings page with toggle switches
- Modals for view, edit, delete confirmations
- Loading states, error alerts, success notifications
- Responsive layout

---

## 🔒 Security Notes

1. **Change `JWT_SECRET`** to a long random string in production
2. **Enable SSL** for PostgreSQL in production (`ssl: { rejectUnauthorized: false }`)
3. Add **rate limiting** (`express-rate-limit`) in production
4. Add **helmet** for HTTP security headers
5. Use **HTTPS** in production
6. Never commit `.env` to version control

---

## 📦 Dependencies

### Backend
| Package           | Purpose                    |
|-------------------|----------------------------|
| express           | Web framework              |
| pg                | PostgreSQL client          |
| bcryptjs          | Password hashing           |
| jsonwebtoken      | JWT creation/verification  |
| express-validator | Input validation           |
| cors              | Cross-origin requests      |
| dotenv            | Environment variables      |

### Frontend
| Package           | Purpose                    |
|-------------------|----------------------------|
| react             | UI library                 |
| react-router-dom  | Client-side routing        |
| axios             | HTTP client                |
| lucide-react      | Icon library               |

---

## 🛠 Scripts

### Backend
```bash
npm run dev   # Start with nodemon (development)
npm start     # Start normally (production)
```

### Frontend
```bash
npm start     # Development server
npm run build # Production build
npm test      # Run tests
```

---

## 📝 License

MIT — free to use and modify.
