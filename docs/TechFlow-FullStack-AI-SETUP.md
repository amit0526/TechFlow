# TechFlow --- Full-Stack + AI Setup

Ye reusable setup manual hai. Iska goal hai ki fresh PC ya fresh project
par TechFlow jaisa full-stack + AI project setup karte waqt tumhe Google
ki zarurat minimum ho.

## Stack

-   PostgreSQL
-   Node.js + npm
-   Express
-   `pg`
-   `dotenv`
-   `cors`
-   React
-   Vite
-   Tailwind CSS
-   ESLint
-   OpenAI API
-   Git / GitHub

------------------------------------------------------------------------

# 1. Architecture

``` text
Browser / React
      |
      | HTTP
      v
Node.js + Express
      |
      +---------> OpenAI API
      |
      v
PostgreSQL
```

-   **React** = UI
-   **Vite** = frontend dev/build tooling
-   **Tailwind** = styling
-   **Express** = backend/API
-   **PostgreSQL** = database
-   **OpenAI** = AI
-   **dotenv** = secrets/config
-   **Git** = version history
-   **npm** = packages and scripts

------------------------------------------------------------------------

# 2. Fresh Computer Prerequisites

Install:

-   Node.js + npm
-   PostgreSQL
-   Git
-   VS Code
-   Browser

Check versions:

``` powershell
node -v
npm -v
git --version
psql --version
```

If Vite gives a Node version warning, upgrade Node. Current Vite
documentation says current releases may require Node.js 20.19+ or
22.12+.

------------------------------------------------------------------------

# 3. Create Project

``` powershell
cd "C:\Users\YOUR_NAME\Desktop"
mkdir TechFlow
cd TechFlow
```

### Meaning

-   `cd` = folder change
-   `mkdir` = folder create

Initialize Git:

``` powershell
git init
```

Check:

``` powershell
git status
```

------------------------------------------------------------------------

# 4. Root `.gitignore`

Create `.gitignore`:

``` gitignore
node_modules/
.env
.env.*
!.env.example
dist/
build/
.vite/
coverage/
.DS_Store
```

Never commit real passwords or API keys.

------------------------------------------------------------------------

# 5. PostgreSQL Mental Model

``` text
PostgreSQL Server
   |
   +-- Database: techflow
          |
          +-- Table: users
                 |
                 +-- rows
                 +-- columns
```

------------------------------------------------------------------------

# 6. Connect to PostgreSQL

PowerShell:

``` powershell
psql -U postgres -h localhost
```

Meaning:

-   `psql` = PostgreSQL terminal
-   `-U postgres` = login as postgres user
-   `-h localhost` = local PostgreSQL server

------------------------------------------------------------------------

# 7. Important PostgreSQL Commands

List databases:

``` sql
\l
```

Connect to database:

``` sql
\c techflow
```

List tables:

``` sql
\dt
```

Show table structure:

``` sql
\d users
```

Current database:

``` sql
SELECT current_database();
```

Exit `psql`:

``` sql
\q
```

**Important:** `\l`, `\c`, `\dt`, `\d`, `\q` are `psql` commands, not
normal SQL.

------------------------------------------------------------------------

# 8. Create Database

``` sql
CREATE DATABASE techflow;
```

Connect:

``` sql
\c techflow
```

------------------------------------------------------------------------

# 9. Create Users Table

``` sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Meaning:

-   `id` = unique auto-increment ID
-   `PRIMARY KEY` = unique identifier
-   `VARCHAR` = text
-   `NOT NULL` = value required
-   `created_at` = automatically stores creation time

Check:

``` sql
\dt
\d users
```

------------------------------------------------------------------------

# 10. Insert Data

``` sql
INSERT INTO users (name, email)
VALUES
('Amit', 'amit@example.com'),
('Rahul', 'rahul@example.com');
```

Read:

``` sql
SELECT * FROM users;
```

------------------------------------------------------------------------

# 11. Useful SQL

Read:

``` sql
SELECT * FROM users;
```

Specific columns:

``` sql
SELECT name, email FROM users;
```

Find by ID:

``` sql
SELECT * FROM users WHERE id = 1;
```

Sort:

``` sql
SELECT * FROM users ORDER BY id;
```

Update:

``` sql
UPDATE users
SET name = 'Amit Anand'
WHERE id = 1;
```

Delete:

``` sql
DELETE FROM users
WHERE id = 1;
```

Count:

``` sql
SELECT COUNT(*) FROM users;
```

Empty table and reset IDs:

``` sql
TRUNCATE TABLE users RESTART IDENTITY;
```

Exit:

``` sql
\q
```

------------------------------------------------------------------------

# 12. Backend Setup

From project root:

``` powershell
cd TechFlow
mkdir backend
cd backend
npm init -y
```

`npm init -y` creates `package.json`.

Install backend packages:

``` powershell
npm install express pg dotenv cors
```

Meaning:

  Package     Purpose
  ----------- ----------------------------------------
  `express`   API/server
  `pg`        PostgreSQL connection
  `dotenv`    `.env` variables
  `cors`      frontend/backend cross-origin requests

Optional auto-restart:

``` powershell
npm install -D nodemon
```

------------------------------------------------------------------------

# 13. Backend Scripts

In `backend/package.json`:

``` json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Run development server:

``` powershell
npm run dev
```

Run normal server:

``` powershell
npm start
```

------------------------------------------------------------------------

# 14. Backend `.env`

Create `backend/.env`:

``` env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=techflow
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_PORT=5432

PORT=5000
```

For AI later:

``` env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

Never upload the real `.env` to GitHub.

Create `backend/.env.example`:

``` env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=techflow
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_PORT=5432

PORT=5000

OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

------------------------------------------------------------------------

# 15. Basic `server.js`

``` js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get("/", (req, res) => {
  res.json({
    message: "TechFlow backend is running 🚀",
  });
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Database query failed",
    });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await pool.query(
      `INSERT INTO users (name, email)
       VALUES ($1, $2)
       RETURNING *`,
      [name, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to add user",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

------------------------------------------------------------------------

# 16. Why `$1` and `$2`?

Good:

``` js
pool.query(
  "SELECT * FROM users WHERE id = $1",
  [id]
);
```

Avoid:

``` js
`SELECT * FROM users WHERE id = ${id}`
```

Parameterized queries are safer and help prevent SQL injection.

------------------------------------------------------------------------

# 17. Start Backend

Inside `backend`:

``` powershell
npm run dev
```

Expected:

``` text
Server running at http://localhost:5000
```

Test:

``` text
http://localhost:5000
```

Users:

``` text
http://localhost:5000/users
```

------------------------------------------------------------------------

# 18. Test POST API

PowerShell:

``` powershell
Invoke-RestMethod `
  -Uri http://localhost:5000/users `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"name":"Test User","email":"test@example.com"}'
```

Then:

``` powershell
Invoke-RestMethod -Uri http://localhost:5000/users
```

------------------------------------------------------------------------

# 19. Frontend --- React + Vite

From root:

``` powershell
cd ..
npm create vite@latest frontend
```

Choose:

``` text
Framework: React
Variant: JavaScript
```

Then:

``` powershell
cd frontend
npm install
```

Start:

``` powershell
npm run dev
```

Typical URL:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# 20. Tailwind CSS

Inside `frontend`:

``` powershell
npm install tailwindcss @tailwindcss/vite
```

Configure `vite.config.js`:

``` js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
});
```

In `src/index.css`:

``` css
@import "tailwindcss";
```

Test:

``` jsx
<h1 className="text-4xl font-bold">
  TechFlow
</h1>
```

------------------------------------------------------------------------

# 21. Remove Vite Starter Files Carefully

After checking imports, unused starter assets can be deleted:

``` text
src/assets/react.svg
src/assets/vite.svg
```

If `App.css` is no longer imported, delete it too.

Do not delete a file before checking whether another file imports it.

------------------------------------------------------------------------

# 22. Frontend → Backend

React:

``` js
const response = await fetch(
  "http://localhost:5000/users"
);

const users = await response.json();

console.log(users);
```

Flow:

``` text
React
  ↓ fetch()
Express
  ↓
PostgreSQL
  ↓
JSON
  ↓
React
```

------------------------------------------------------------------------

# 23. Add User from React

``` js
const response = await fetch(
  "http://localhost:5000/users",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
    }),
  }
);

const newUser = await response.json();
```

------------------------------------------------------------------------

# 24. Why CORS?

Frontend:

``` text
http://localhost:5173
```

Backend:

``` text
http://localhost:5000
```

Different ports mean different origins.

Backend:

``` js
const cors = require("cors");
app.use(cors());
```

For production, restrict CORS to your real frontend origin instead of
allowing everything.

------------------------------------------------------------------------

# 25. ESLint

Run:

``` powershell
npm run lint
```

If creating a project manually:

``` powershell
npm install -D eslint
```

ESLint catches common code-quality problems.

------------------------------------------------------------------------

# 26. Optional Prettier

Install:

``` powershell
npm install -D prettier
```

Format:

``` powershell
npx prettier --write src/App.jsx
```

Remember:

``` text
ESLint   = code quality/linting
Prettier = formatting
```

------------------------------------------------------------------------

# 27. CRUD Roadmap

Eventually:

``` text
GET    /users       Read all
GET    /users/:id   Read one
POST   /users       Create
PUT    /users/:id   Update
DELETE /users/:id   Delete
```

CRUD:

``` text
C = Create
R = Read
U = Update
D = Delete
```

Current TechFlow stage:

``` text
Create  ✅
Read    ✅
Update  ⏳
Delete  ⏳
```

------------------------------------------------------------------------

# 28. Recommended Backend Structure

When the app grows:

``` text
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   └── ai.routes.js
│   ├── controllers/
│   │   ├── user.controller.js
│   │   └── ai.controller.js
│   ├── services/
│   │   └── ai.service.js
│   ├── middleware/
│   │   └── error.middleware.js
│   └── server.js
├── .env
├── .env.example
└── package.json
```

Start simple. Refactor when the code becomes large.

------------------------------------------------------------------------

# 29. Health Check

Useful endpoint:

``` js
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});
```

Test:

``` text
http://localhost:5000/health
```

------------------------------------------------------------------------

# 30. AI Architecture

**Never put the OpenAI API key in React.**

Wrong:

``` text
React → OpenAI key → OpenAI
```

Correct:

``` text
React
  ↓
POST /api/ai
  ↓
Express
  ↓
OpenAI API
  ↓
Express
  ↓
React
```

The backend keeps the secret key.

------------------------------------------------------------------------

# 31. Install OpenAI SDK

Inside backend:

``` powershell
cd backend
npm install openai
```

The official OpenAI JavaScript SDK is intended for server-side
JavaScript environments such as Node.js.

------------------------------------------------------------------------

# 32. OpenAI Environment Variable

`backend/.env`:

``` env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

Never commit this key.

------------------------------------------------------------------------

# 33. OpenAI Client

``` js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

------------------------------------------------------------------------

# 34. Basic AI Route

``` js
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.responses.create({
      model: "gpt-5",
      input: prompt,
    });

    res.json({
      output: response.output_text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI request failed",
    });
  }
});
```

**Model note:** Model names and availability change. Before production,
check the current OpenAI model list/documentation instead of assuming an
old model name.

------------------------------------------------------------------------

# 35. Test AI Route

``` powershell
Invoke-RestMethod `
  -Uri http://localhost:5000/api/ai `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"prompt":"Explain PostgreSQL in simple Hinglish"}'
```

------------------------------------------------------------------------

# 36. React → AI

``` js
const response = await fetch(
  "http://localhost:5000/api/ai",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  }
);

const data = await response.json();

console.log(data.output);
```

------------------------------------------------------------------------

# 37. AI Features Roadmap

## Level 1 --- AI Assistant

``` text
User prompt
   ↓
OpenAI
   ↓
Answer
```

## Level 2 --- Database-aware AI

``` text
User
 ↓
Express
 ↓
Safe DB query
 ↓
Data
 ↓
AI summary
```

Example:

``` text
"How many users joined today?"
```

## Level 3 --- Admin AI

``` text
"Show users with Gmail addresses"
"Summarize today's registrations"
"Generate an email for this user"
```

## Level 4 --- RAG

``` text
Documents
 ↓
Chunking
 ↓
Embeddings
 ↓
Vector store
 ↓
Retrieval
 ↓
AI answer
```

## Level 5 --- Tool/Function Calling

AI can be given controlled functions such as:

``` text
getUsers()
getUserById()
createUser()
updateUser()
```

Do not give an AI model unrestricted raw SQL execution.

------------------------------------------------------------------------

# 38. AI Security

Do NOT create a public endpoint like:

``` js
app.post("/api/sql", async (req, res) => {
  await pool.query(req.body.sql);
});
```

That can allow arbitrary SQL execution.

Prefer predefined backend functions:

``` js
async function getUsers() {
  return pool.query(
    "SELECT id, name, email FROM users ORDER BY id"
  );
}
```

------------------------------------------------------------------------

# 39. Database + AI Mental Model

``` text
User
 ↓
React
 ↓
Express
 ├───────────────┐
 ↓               ↓
PostgreSQL      OpenAI
 ↓               ↓
Data ─────────→ AI
        ↓
      Answer
        ↓
      React
```

------------------------------------------------------------------------

# 40. Two-Terminal Daily Workflow

### Terminal 1 --- Backend

``` powershell
cd "C:\Users\YOUR_NAME\Desktop\TechFlow\backend"
npm run dev
```

### Terminal 2 --- Frontend

``` powershell
cd "C:\Users\YOUR_NAME\Desktop\TechFlow\frontend"
npm run dev
```

Browser:

``` text
http://localhost:5173
```

Backend:

``` text
http://localhost:5000
```

Users:

``` text
http://localhost:5000/users
```

------------------------------------------------------------------------

# 41. PostgreSQL Daily Workflow

``` powershell
psql -U postgres -h localhost
```

Then:

``` sql
\c techflow
\dt
SELECT * FROM users;
```

Exit:

``` sql
\q
```

------------------------------------------------------------------------

# 42. Useful npm Commands

Install package:

``` powershell
npm install PACKAGE_NAME
```

Install dev package:

``` powershell
npm install -D PACKAGE_NAME
```

Remove package:

``` powershell
npm uninstall PACKAGE_NAME
```

Show top-level packages:

``` powershell
npm list --depth=0
```

Run script:

``` powershell
npm run SCRIPT_NAME
```

------------------------------------------------------------------------

# 43. Useful PowerShell Commands

Current folder:

``` powershell
pwd
```

List files:

``` powershell
dir
```

Change folder:

``` powershell
cd folder-name
```

Parent folder:

``` powershell
cd ..
```

Create folder:

``` powershell
mkdir folder-name
```

Clear terminal:

``` powershell
cls
```

------------------------------------------------------------------------

# 44. Useful VS Code Shortcuts

Terminal:

``` text
Ctrl + `
```

Command Palette:

``` text
Ctrl + Shift + P
```

Quick file:

``` text
Ctrl + P
```

Search:

``` text
Ctrl + Shift + F
```

Save:

``` text
Ctrl + S
```

------------------------------------------------------------------------

# 45. Git Workflow

Check:

``` powershell
git status
```

Stage:

``` powershell
git add .
```

Commit:

``` powershell
git commit -m "Initial full-stack setup"
```

History:

``` powershell
git log --oneline
```

Add GitHub remote:

``` powershell
git remote add origin YOUR_REPOSITORY_URL
```

Check:

``` powershell
git remote -v
```

Use main:

``` powershell
git branch -M main
```

Push:

``` powershell
git push -u origin main
```

------------------------------------------------------------------------

# 46. Fresh Clone Setup

``` powershell
git clone YOUR_REPOSITORY_URL
cd TechFlow
```

Backend:

``` powershell
cd backend
npm install
```

Frontend:

``` powershell
cd ../frontend
npm install
```

Why?

`package.json` dependencies list karta hai.

`npm install` `node_modules` recreate karta hai.

`node_modules` ko GitHub par commit nahi karte.

------------------------------------------------------------------------

# 47. Fresh Machine Database Setup

``` powershell
psql -U postgres -h localhost
```

``` sql
CREATE DATABASE techflow;
\c techflow

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Then recreate:

``` text
backend/.env
```

with your local database credentials.

------------------------------------------------------------------------

# 48. Common PostgreSQL Errors

## `psql is not recognized`

PostgreSQL CLI PATH mein nahi hai.

Check PostgreSQL installation and PATH, then open a new terminal:

``` powershell
psql --version
```

## `password authentication failed`

Check `.env`:

``` env
DB_USER=postgres
DB_PASSWORD=correct_password
DB_NAME=techflow
DB_HOST=localhost
DB_PORT=5432
```

## `database "techflow" does not exist`

``` sql
CREATE DATABASE techflow;
```

## `relation "users" does not exist`

Check:

``` sql
SELECT current_database();
\dt
```

If missing, create the table again.

------------------------------------------------------------------------

# 49. Common Backend Errors

## `ECONNREFUSED ::1:5000`

Backend probably isn't running.

``` powershell
npm run dev
```

## CORS error

Check:

``` js
const cors = require("cors");
app.use(cors());
```

## Database query failed

Check:

-   PostgreSQL running?
-   `.env` correct?
-   Database exists?
-   Table exists?
-   Backend restarted after `.env` changes?

------------------------------------------------------------------------

# 50. Common Frontend Errors

If browser is blank:

1.  Open browser console.
2.  Check Vite terminal.
3.  Check `App.jsx`.
4.  Check `main.jsx`.
5.  Check `index.css`.
6.  Check API URL.

Run:

``` powershell
npm run dev
```

If Tailwind doesn't work:

``` powershell
npm install tailwindcss @tailwindcss/vite
```

Check `vite.config.js` and:

``` css
@import "tailwindcss";
```

Then restart Vite.

------------------------------------------------------------------------

# 51. Full Test Checklist

### PostgreSQL

``` sql
\c techflow
\dt
SELECT * FROM users;
```

### Backend

``` text
http://localhost:5000
```

### Users API

``` text
http://localhost:5000/users
```

### Frontend

``` text
http://localhost:5173
```

### Add user

Use the UI:

``` text
Name: Test User
Email: test@example.com
```

Click:

``` text
Add
```

Then verify:

``` text
http://localhost:5000/users
```

------------------------------------------------------------------------

# 52. Current TechFlow Status

``` text
PostgreSQL                 ✅
Database: techflow         ✅
users table                ✅

Node.js                    ✅
Express                    ✅
pg                         ✅
dotenv                     ✅
cors                       ✅

GET /users                 ✅
POST /users                ✅

React                      ✅
Vite                       ✅
Tailwind CSS               ✅
ESLint                     ✅

Frontend → Backend         ✅
Backend → PostgreSQL       ✅
PostgreSQL → Frontend      ✅

Create                     ✅
Read                       ✅
Update                     ⏳
Delete                     ⏳

AI integration             ⏳
Authentication             ⏳
Production deployment      ⏳
```

------------------------------------------------------------------------

# 53. Recommended Learning/Build Order

``` text
1. Node.js
2. npm / package.json
3. Git
4. PostgreSQL basics
5. SQL
6. Express
7. REST API
8. PostgreSQL + Express
9. React
10. Vite
11. Tailwind
12. Frontend API calls
13. CRUD
14. Validation
15. Authentication
16. OpenAI API
17. AI + backend
18. AI + database tools
19. Security
20. Testing
21. GitHub
22. Deployment
```

------------------------------------------------------------------------

# 54. One-Page Cheat Sheet

## Start backend

``` powershell
cd backend
npm run dev
```

## Start frontend

``` powershell
cd frontend
npm run dev
```

## PostgreSQL

``` powershell
psql -U postgres -h localhost
```

``` sql
\c techflow
\dt
SELECT * FROM users;
\q
```

## API

``` text
http://localhost:5000
http://localhost:5000/users
http://localhost:5000/health
```

## Frontend

``` text
http://localhost:5173
```

## AI package

``` powershell
cd backend
npm install openai
```

------------------------------------------------------------------------

# 55. Golden Rules

### Rule 1 --- Secrets

``` text
.env = private
.env.example = safe template
```

### Rule 2 --- Architecture

``` text
React → Express → PostgreSQL
```

### Rule 3 --- AI

``` text
React → Express → OpenAI
```

Never expose the OpenAI key in frontend code.

### Rule 4 --- SQL

Use parameters:

``` js
pool.query(
  "SELECT * FROM users WHERE id = $1",
  [id]
);
```

### Rule 5 --- Debugging

Identify the broken layer:

``` text
Browser
 ↓
React
 ↓
HTTP
 ↓
Express
 ↓
PostgreSQL / OpenAI
```

------------------------------------------------------------------------

# 56. Official References

For version-sensitive information, use the official documentation as the
source of truth:

-   Vite --- project scaffolding and dev server
-   Tailwind CSS --- current Vite integration
-   OpenAI Developer Quickstart --- current JavaScript SDK and API
    examples
-   PostgreSQL --- SQL and `psql`
-   Express --- routes and middleware
-   Node.js --- runtime and npm

------------------------------------------------------------------------

# 57. Final Mental Model

``` text
                    USER
                      |
                      v
              +---------------+
              | React + Vite  |
              |   Tailwind    |
              +-------+-------+
                      |
                    HTTP
                      |
                      v
              +---------------+
              | Node + Express|
              +-------+-------+
                      |
             +--------+--------+
             |                 |
             v                 v
      +-------------+   +-------------+
      | PostgreSQL  |   |  OpenAI API |
      |  Database   |   |     AI      |
      +-------------+   +-------------+
```

Remember:

``` text
Frontend = UI
Backend  = API/business logic
Database = persistent data
AI       = intelligence
.env     = secrets/config
Git      = version history
npm      = packages/scripts
Vite     = frontend tooling
```

------------------------------------------------------------------------

# 58. Fresh Project Quick Rebuild

``` powershell
mkdir TechFlow
cd TechFlow
git init

mkdir backend
cd backend
npm init -y
npm install express pg dotenv cors
npm install -D nodemon

cd ..
npm create vite@latest frontend
cd frontend
npm install
npm install tailwindcss @tailwindcss/vite
```

PostgreSQL:

``` powershell
psql -U postgres -h localhost
```

``` sql
CREATE DATABASE techflow;
\c techflow

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

AI:

``` powershell
cd backend
npm install openai
```

Then configure:

``` text
backend/.env
```

and start:

``` powershell
npm run dev
```

Frontend:

``` powershell
cd ../frontend
npm run dev
```

------------------------------------------------------------------------

## Final Goal

Is project ka purpose sirf app banana nahi hai.

Target ye hai ki tum eventually ye pura flow khud samajh sako:

``` text
Terminal
  ↓
Project setup
  ↓
npm / package.json
  ↓
Node.js
  ↓
Express
  ↓
PostgreSQL + SQL
  ↓
React
  ↓
Vite
  ↓
Tailwind
  ↓
API integration
  ↓
CRUD
  ↓
Authentication
  ↓
AI API
  ↓
AI + database tools
  ↓
Security
  ↓
Git/GitHub
  ↓
Deployment
```

**Command bhoolna problem nahi hai.** Is `SETUP.md` ko project ke
`docs/SETUP.md` mein rakho. Har command ke saath uska purpose bhi diya
gaya hai, taaki next setup mein tum sirf copy-paste na karo --- samjho
bhi ki command kya kar rahi hai.
