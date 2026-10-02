<div align="center">

# 🩸 LifeLink

### Emergency blood donor matching, powered by AI

Type a request in plain English. LifeLink understands it and finds matching donors in seconds.

![MERN](https://img.shields.io/badge/stack-MERN-red)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google&logoColor=white)

[Live Demo](#) · [Report a Bug](https://github.com/AyushhAnand07/LifeLink/issues) · [Request a Feature](https://github.com/AyushhAnand07/LifeLink/issues)

</div>

---

## The Problem

When someone needs blood urgently, the first few minutes are spent on WhatsApp groups, phone calls and forwarded messages, hoping the right person sees it. Donors, on the other hand, have no easy way to say "I'm available, and this is where I live."

## The Solution

LifeLink connects the two sides directly. Donors register once with their blood type and city. Anyone who needs blood just **describes the situation in their own words**, and the app does the rest.

> *"Need O negative blood urgently for my father in City Hospital, Dehradun"*

Gemini reads that sentence and extracts:

| Field | Extracted value |
| --- | --- |
| Blood type | `O-` |
| City | `Dehradun` |
| Urgency | `high` |

The backend then lists every available donor in that city with that blood type.

## Features

- **Natural-language requests**: no forms to fill in an emergency, just type what's happening.
- **AI extraction with Google Gemini**: pulls out blood type, city and urgency from free text.
- **Urgency levels**: requests are tagged `low`, `medium` or `high`, with colour-coded badges.
- **Role-based accounts**: sign up as a **donor** ("I want to donate blood") or a **requester** ("I need blood"), each with its own dashboard.
- **Donor profiles**: set your blood type and city, and toggle *"Available to donate right now"* at any time.
- **Instant matching**: same city and matching blood type, available donors only.
- **Secure authentication**: JWT-based login with bcrypt-hashed passwords and protected routes.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| AI | Google Gemini API (`@google/generative-ai`) |
| Auth | JSON Web Tokens, bcryptjs |

## How It Works

```
 Requester types a sentence
            │
            ▼
   React app  ──POST /api/requests──▶  Express API
                                          │
                                          ▼
                                   Gemini extracts
                              { bloodType, city, urgency }
                                          │
                                          ▼
                              Request saved in MongoDB
                                          │
   React app ◀──GET /api/requests/:id/matches──  Donors filtered by
                                                 city + blood type + availability
```

## Project Structure

```
LifeLink/
├── client/                     # React + Vite frontend
│   └── src/
│       ├── pages/              # Login, Register, Dashboard
│       └── services/api.js     # Axios instance with JWT interceptor
└── server/                     # Express backend
    ├── ai/parseRequest.js      # Gemini prompt + JSON parsing
    ├── config/db.js            # MongoDB connection
    ├── controllers/            # auth, donor, request logic
    ├── middleware/             # JWT auth guard
    ├── models/                 # User, Donor, Request schemas
    ├── routes/                 # API route definitions
    └── server.js               # App entry point
```

## API Reference

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | No | Create an account (`donor` or `requester`) |
| `POST` | `/api/auth/login` | No | Log in and receive a JWT |
| `POST` | `/api/donors` | Yes | Create or update the logged-in user's donor profile |
| `GET` | `/api/donors` | No | List available donors (`?city=` and `?bloodType=` filters) |
| `POST` | `/api/requests` | Yes | Submit a plain-text request; AI parses and saves it |
| `GET` | `/api/requests/:id/matches` | No | Get matching donors for a request |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A [MongoDB](https://www.mongodb.com/atlas) database (local or Atlas)
- A [Google Gemini API key](https://aistudio.google.com/)

### 1. Clone the repository

```bash
git clone https://github.com/AyushhAnand07/LifeLink.git
cd LifeLink
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` (use `.env.example` as a template):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Set up the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

> To point the frontend at a deployed backend, set `VITE_API_URL` (for example `https://your-api.onrender.com/api`) before building.

## Environment Variables

| Variable | Where | Description |
| --- | --- | --- |
| `PORT` | server | Port the API listens on (default `5000`) |
| `MONGO_URI` | server | MongoDB connection string |
| `JWT_SECRET` | server | Secret used to sign login tokens |
| `GEMINI_API_KEY` | server | Google Gemini API key |
| `VITE_API_URL` | client | Backend base URL (optional locally) |

## Screenshots

<!-- Add screenshots to a /screenshots folder and replace these placeholders -->

| Login | Donor Dashboard | AI Request & Matches |
| --- | --- | --- |
| *coming soon* | *coming soon* | *coming soon* |

## Roadmap

- [ ] Blood-type compatibility matching (for example, `O-` can donate to all types)
- [ ] Email or SMS alerts to matching donors
- [ ] Hospital and location autocomplete
- [ ] Donation history and cooldown tracking
- [ ] Admin dashboard to manage users and requests
- [ ] Request status updates (`open` → `fulfilled`) from the UI

## Contributing

Contributions, issues and feature requests are welcome.

1. Fork the repository
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## Author

**AyushhAnand07**

- GitHub: [@AyushhAnand07](https://github.com/AyushhAnand07)

---

<div align="center">

If this project helped or inspired you, consider giving it a ⭐

</div>
