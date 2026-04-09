# Banking App (React + Django)

A full-stack fintech-style banking application that allows users to securely manage wallets, transfer funds, and track financial activity.

The application focuses on **secure financial transactions**, **data integrity**, and **production-ready backend architecture**.

---

# Features

* User Authentication (JWT)
* KYC Verification
* Wallet System
* Secure Fund Transfers
* Beneficiary Management
* Stripe Payment Integration (Wallet Top-up)
* Transaction History with Pagination
* Notification System
* API Rate Limiting
* Dark / Light Mode UI

### Financial Safety Mechanisms

* **Atomic Transactions**

  * Ensures wallet transfers complete fully or not at all.

* **Automatic Database Rollback**

  * If any step fails during a transfer, all database changes are reverted.

* **Row-Level Locking**

  * lock wallets during transactions.
  * Prevents race conditions and double spending.

---

# Tech Stack

## Frontend

* React
* TailwindCSS

## Backend

* Django
* Django REST Framework
* Gunicorn (production server)

## Database

* PostgreSQL

## Payments

* Stripe

## Deployment

* **Frontend:** Vercel
* **Backend:** Render (Docker container)

---

# Backend Architecture Highlights

### Secure Transaction Processing

Financial transfers are protected using:

* Database transactions 
* Row-level locking 
* Automatic rollback on failure

This ensures **consistent wallet balances even during concurrent requests**.

---

### API Protection

Sensitive endpoints use **rate limiting** to prevent abuse.

Examples:

* Login endpoint
* Fund transfer endpoint

---

# Local Development Setup

## Backend

```bash
cd Backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at:

```
http://localhost:8000
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# Running Backend with Docker

Build Docker image:

```bash
docker build -t banking-backend .
```

Run container:

```bash
docker run -p 8000:8000 banking-backend
```

The API will be available at:

```
http://localhost:8000
```

---


# Future Improvements

* Email Notifications
* WebSocket-based real-time notifications
* Background jobs (Celery + Redis)
* Microservice architecture for payments
* Enhanced fraud detection mechanisms
