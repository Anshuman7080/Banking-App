# Banking App (React + Django)

A full-stack fintech-style banking application that allows users to manage wallets, transfer funds, and track financial activity securely.

## Features

- User Authentication (JWT)
- KYC Verification
- Wallet System
- Secure Fund Transfers
- Beneficiary Management
- Stripe Payment Integration (Wallet Top-up)
- Transaction History with Pagination
- Notification System
- API Rate Limiting
- Dark / Light Mode
- **Atomic Transactions for safe fund transfers**
- **Database Rollback on failed operations**
- **Row-Level Locking to prevent race conditions**

## Tech Stack

### Frontend
- React
- TailwindCSS

### Backend
- Django
- Django REST Framework

### Database
- PostgreSQL

### Payments
- Stripe

## Backend Architecture Highlights

- **Atomic Transactions**
  - Ensures that wallet transfers complete fully or not at all.
  - Prevents inconsistent balances.

- **Automatic Rollback**
  - If any step fails during a transfer, the database automatically rolls back.

- **Row-Level Locking**
  - Uses `select_for_update()` to lock sender and receiver wallets during transfers.
  - Prevents double spending during concurrent requests.

- **API Rate Limiting**
  - Protects sensitive endpoints like login and fund transfers.

## Project Structure

```
banking-app
 ├── Backend
 ├── frontend
 └── README.md
```

## Setup

### Backend

```
cd Backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```
cd frontend
npm install
npm run dev
```

## Future Improvements

- Email Notifications
- Docker Containerization
- Production Deployment
- Event-driven notifications