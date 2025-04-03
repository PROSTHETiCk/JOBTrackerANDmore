<<<<<<< HEAD
# JOBTrackerANDmore
This is a web application designed to help track job applications, manage a professional profile, analyze job descriptions using AI, and generate a basic resume structure.
=======
# Sentrie.job Project

## Overview

Sentrie.job is a web application designed to help you keep track of job applications. The initial goal is to let you track applications, analyze job descriptions, and auto-fill parts of a resume.

## Tech Stack

* **Backend:** Python, Flask, SQLAlchemy, Flask-Migrate, MariaDB (PyMySQL driver), python-dotenv, Flask-Cors, Marshmallow (planned)
* **Frontend:** React, Vite, Axios
* **Database:** MariaDB
* **Version Control:** Git / GitHub

## Getting Started (Local Development)

**1. Prerequisites:**

* Install Git, Python 3, Node.js (npm), MariaDB Server. Ensure they are in your system PATH.

**2. Setup:**

* Clone repository or ensure project folder exists.
* Run `git init` (if needed) and setup `.gitignore`.
* **Backend:** `cd backend`, `python -m venv venv`, activate venv, ensure `requirements.txt` is correct, `pip install -r requirements.txt`.
* **Frontend:** `cd ../frontend`, ensure `package.json` is correct, `npm install`.
* **Config:** Create `backend/.env` with `SECRET_KEY`, MariaDB `DATABASE_URL`, `FLASK_APP`. Populate `backend/config.py`.
* **Database:** Create MariaDB database & user matching `.env` details using `mysql` client. Grant privileges.
* **Migrations:** Ensure `migrations/` files (`alembic.ini`, `env.py`, `script.py.mako`) are correct. Create `migrations/versions`. Run `flask db migrate -m "Initial migration"` then `flask db upgrade` (in activated backend venv).

## Running the App

1.  **Start Backend:** `cd backend`, activate venv, `flask run`. (Usually at http://127.0.0.1:5000)
2.  **Start Frontend:** `cd frontend`, `npm run dev`. (Usually at http://localhost:5173)
3.  Open frontend URL in browser.

## TODO

* Add detailed usage instructions.
* Add deployment guidelines.
* Flesh out Phase 1-5 features according to the roadmap.
>>>>>>> 1bc455c (Initial project setup (Phase 0 complete with MariaDB))
