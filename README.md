# Fullstack Auth App

A full-stack authentication system built with FastAPI (Python 3) and React (TypeScript).

## Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | FastAPI, bcrypt, uvicorn            |
| Frontend | React 18, TypeScript, Vite, Axios   |
| Auth     | Bearer token stored in localStorage |

## Project Structure

```
fullstack-todo/
├── backend/
│   ├── main.py          # FastAPI app + routes
│   ├── auth.py          # register/login logic
│   ├── models.py        # Pydantic request/response schemas
│   ├── utils.py         # password hashing, token generation
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/       # Login, Register, Dashboard
        ├── routes/      # ProtectedRoute
        ├── services/    # Axios API layer
        └── components/  # Spinner
```

## Running the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API: `http://localhost:8000`  
Docs: `http://localhost:8000/docs`

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:3000`

## Auth Flow

1. `POST /register` — creates account with bcrypt-hashed password
2. `POST /login` — verifies credentials, returns token
3. Token saved to `localStorage`, sent as `Authorization: Bearer <token>`
4. `GET /protected` — validates token, returns user greeting
5. Any `401` response clears token and redirects to `/login`
