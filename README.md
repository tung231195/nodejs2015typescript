# E-Commerce & Blog Platform

> Full-featured E-commerce website with Blog system, real-time likes & comments using WebSocket. Built with **TypeScript**, **React**, **Node.js**, **MUI**, **Socket.io**, and **MongoDB**.

---

## 🚀 Live Demo / Deploy

### 🌐 Frontend (Next.js 15 + TypeScript)

https://nextjs15typescript.vercel.app/en

### 🛠️ Admin Dashboard

https://nextjs15typescript.vercel.app/en/dashboard

### 🔗 Backend API (Node.js + TypeScript)

https://nodejs2015typescript.onrender.com

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Run](#setup--run)
- [Production Docker Build & Run](#production-docker-build--run)
- [Docker (Dev Mode)](#docker-dev-mode)
- [Database & Environment Setup](#database--environment-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contact](#contact)

---

## Overview

This project is a **full-stack E-commerce platform** integrated with a full Blog system. It supports real-time interactions using WebSocket.

### Purpose

- Provide a complete online shopping system.
- Offer a blog platform for better user engagement.
- Support real-time like + comment interactions.

---

## Features

### E-Commerce

- Product listing, filtering, categories
- Product detail page
- Shopping cart & checkout
- User authentication (signup/login)
- Forgot Password & Reset Password (email-based)
- Send email notifications
- Order management
- Admin Dashboard
  - Manage products
  - Manage orders
  - Manage users
  - Manage blog posts
  - Manage payments & shipping methods

### Blog

- Admin can create, edit, delete posts
- Users can view posts
- Real-time likes & comments (**Socket.io**)
- Nested comment replies
- Real-time notifications

### Other

- Responsive UI with **Material-UI (MUI)**
- JWT Authentication (Access + Refresh Tokens)
- Error handling & validations
- Full **TypeScript** support

---

## Tech Stack

- **Frontend:** React.js, MUI, TypeScript
- **Backend:** Node.js, Express.js, TypeScript, Socket.io
- **Database:** MongoDB (Atlas or local)
- **Authentication:** JWT
- **Dev Tools:** Docker, Git, VSCode
- **Deployment:** Docker, Vercel/Render/Heroku optional

---

## Setup & Run

Run locally without Docker:

```bash
# Clone the repo
git https://github.com/tung231195/nodejs2015typescript.git
cd nodejs2015typescript

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup
cd ../frontend
npm install
npm start
```

---

## Production Docker Build & Run

```bash
# Build images
docker-compose build

# Run containers
docker-compose up

# Detached mode
docker-compose up -d
```

Frontend → http://localhost:3000  
Backend → http://localhost:5000

---

## Docker (Dev Mode)

Enable hot reload for backend & frontend.

Run:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

---

## Database & Environment Setup

Create a `.env` file inside **backend/**:

```
FRONTEND_ORIGIN=http://localhost:3000
BACKEND_ORIGIN=http://localhost:5000
MONGO_URI=<your_mongodb_uri>
PORT=5000
JWT_SECRET=<your_jwt_secret>
JWT_REFRESH_SECRET=<your_jwt_refresh_secret>
PAYPAL_CLIENT_ID=<your_paypal_client_id>
PAYPAL_CLIENT_SECRET=<your_paypal_client_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
NODE_ENV=developer
FB_CLIENT_ID=<your_facebook_client_id>
FB_CLIENT_SECRET=<your_facebook_client_secret>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>

MOMO_PARTNER_CODE=<your_momo_partner_code>
MOMO_ACCESS_KEY=<your_momo_access_key>
MOMO_SECRET_KEY=<your_momo_secret_key>
MOMO_RETURN_URL=http://localhost:3000/momo-return
MOMO_NOTIFY_URL=http://localhost:3000/api/momo-webhook

VNP_TMNCODE=<your_vnp_tmncode>
VNP_HASHSECRET=<your_vnp_hashsecret>
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:3000/payment/result

SMTP_HOST=<your_smtp_host>
SMTP_PORT=<your_smtp_port>
SMTP_USERNAME=<your_smtp_username>
SMTP_PASSWORD=<your_smtp_password>
REDIS_URL=redis://127.0.0.1:6379
IS_DOCKER=false
```

Optional: seed database

```bash
npm run seed
```

---

## Usage

- Open `http://localhost:3000`
- Register/login
- Reset password via email
- Browse products & checkout
- Interact with blog posts in real-time

---

## Contributing

- Fork the repo
- Create your feature branch
- Submit pull request

---

## Contact

**Kenny Danh**  
📧 Email: kennydanh11195@gmail.com
