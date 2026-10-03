# 🛒 My-Kart

<p align="center">
  <img src="https://img.shields.io/badge/My--Kart-E--Commerce-orange?style=for-the-badge" alt="My-Kart" />
  <img src="https://img.shields.io/badge/Full--Stack-Application-blue?style=for-the-badge" alt="Full Stack" />
  <img src="https://img.shields.io/badge/Status-Deployment%20Ready-success?style=for-the-badge" alt="Status" />
</p>

<p align="center">
  A modern full-stack e-commerce platform built with a scalable frontend,
  RESTful backend, PostgreSQL database, real-time communication,
  online payment integration and cloud-based services.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-technology-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-challenges--solutions">Challenges</a> •
  <a href="#-limitations">Limitations</a> •
  <a href="#-installation">Installation</a>
</p>

---

# 🛍️ About My-Kart

**My-Kart** is a full-stack e-commerce application developed to simulate a real-world online shopping platform.

The application provides a complete shopping workflow:

```text
👤 User
   ↓
🔐 Authentication
   ↓
🛍️ Browse Products
   ↓
🛒 Add to Cart
   ↓
📦 Checkout
   ↓
💳 Payment
   ↓
📋 Order Management
   ↓
⭐ Product Rating
```

The project goes beyond basic CRUD functionality and includes:

* 🔐 JWT authentication
* 👥 Role-based authorization
* 🛍️ Product management
* 🛒 Persistent shopping cart
* 📦 Order management
* 💵 Cash on Delivery
* 💳 SSLCommerz online payment
* ⭐ Purchased-user-only product rating
* ⚡ Real-time rating updates with Socket.IO
* 🔑 Forgot Password / Password Reset
* ☁️ Cloudinary image upload
* 📧 Resend email integration
* 📊 Admin analytics
* 🧾 Order invoice
* 🔄 Strict order status workflow
* 🚀 Production deployment architecture

---

# ✨ Features

## 👤 Customer Features

* 📝 User registration
* 🔐 User login
* 🚪 Logout
* 🪪 JWT-based authentication
* 👤 User profile
* ✏️ Edit name, email and phone
* 🔑 Forgot password
* 🔄 Reset password
* 🛍️ Browse products
* 🔎 Product details
* 🖼️ Product images
* 🛒 Add to cart
* ➕ Increase quantity
* ➖ Decrease quantity
* ❌ Remove cart item
* 🧹 Clear cart
* 💰 Subtotal calculation
* 🚚 Shipping calculation
* 📦 Checkout
* 💵 Cash on Delivery
* 💳 Online payment
* 📋 View orders
* 🔍 View order details
* ❌ Cancel eligible orders
* ⭐ Rate purchased products
* ✏️ Update existing rating
* ⚡ Real-time rating updates

---

## 👨‍💼 Admin Features

* 📊 Admin dashboard
* 📈 Order analytics
* 💰 Revenue analytics
* 📦 Product management
* 🛍️ Order management
* 🔄 Strict order status control
* 💳 Payment status monitoring
* 🧾 Order invoice
* 🔐 Admin-only protected routes

---

# 🧰 Technology Stack

The project is divided into separate **Frontend**, **Backend**, **Database**, and **External Services** layers.

---

## 🎨 Frontend

| Technology               | Usage                    |
| ------------------------ | ------------------------ |
| ⚛️ **React**             | UI development           |
| ▲ **Next.js**            | Frontend framework       |
| 🔷 **TypeScript**        | Type-safe development    |
| 🎨 **Tailwind CSS**      | UI styling               |
| 📡 **Axios**             | API communication        |
| 🧠 **React Context API** | Global state management  |
| 🍞 **React Hot Toast**   | Notifications            |
| ✨ **Lucide React**       | UI icons                 |
| ⚡ **Socket.IO Client**   | Real-time rating updates |
| 📊 **Recharts**          | Admin analytics/charts   |

### Frontend Architecture

```text
Next.js
   │
   ├── App Router
   ├── React Components
   ├── Context API
   │     ├── AuthContext
   │     └── CartContext
   │
   ├── Axios API Client
   ├── Tailwind CSS
   ├── Socket.IO Client
   ├── React Hot Toast
   └── Recharts
```

---

# ⚙️ Backend

| Technology            | Usage                          |
| --------------------- | ------------------------------ |
| 🐈 **NestJS**         | Backend framework              |
| 🔷 **TypeScript**     | Type-safe backend development  |
| 🗄️ **TypeORM**       | ORM / database communication   |
| 🔐 **JWT**            | Authentication                 |
| 🛂 **Passport**       | Authentication strategy        |
| 🔒 **bcrypt**         | Password hashing               |
| ✅ **class-validator** | DTO validation                 |
| ⚡ **Socket.IO**       | Real-time communication        |
| 🌐 **REST API**       | Frontend/backend communication |

### Backend Modules

```text
NestJS Backend
│
├── 🔐 Auth
├── 👤 Users
├── 🛍️ Products
├── 🛒 Cart
├── 📦 Orders
├── 💳 Payments
├── ⭐ Ratings
└── ☁️ Upload
```

---

# 🗄️ Database

## 🐘 PostgreSQL

PostgreSQL is used as the primary relational database.

### ORM

🔗 **TypeORM**

TypeORM manages:

* 👤 Users
* 🛍️ Products
* 🛒 Cart Items
* 📦 Orders
* 📦 Order Items
* ⭐ Ratings
* 🔑 Password reset fields

### Main Relationships

```text
👤 User
 │
 ├── 🛒 Cart Items
 │
 ├── 📦 Orders
 │      │
 │      └── 📦 Order Items
 │
 └── ⭐ Ratings

🛍️ Product
 │
 ├── 🛒 Cart Items
 ├── 📦 Order Items
 └── ⭐ Ratings
```

---

# ☁️ External Services

## 🖼️ Cloudinary

Used for:

* Product image upload
* Cloud-based image storage
* Image URL delivery

```text
Frontend
   ↓
Backend
   ↓
Cloudinary
   ↓
Image URL
   ↓
Database
```

---

## 💳 SSLCommerz

Used for online payments.

Supported flow:

```text
🛒 Checkout
     ↓
📦 Create Order
     ↓
💳 Initiate SSLCommerz
     ↓
🌐 Payment Gateway
     ↓
✅ Success Callback
     ↓
🔎 Payment Validation
     ↓
💰 Order → PAID
     ↓
🧹 Cart Cleared
```

Supported callbacks:

* ✅ Success
* ❌ Fail
* 🚫 Cancel
* 🔄 IPN

---

## 📧 Resend

Used for password reset email delivery.

Password reset flow:

```text
🔑 Forgot Password
       ↓
📧 Email Request
       ↓
🔐 Secure Token Generated
       ↓
# Token Hash Stored
       ↓
📨 Resend
       ↓
🔗 Reset Link
       ↓
🔑 New Password
```

---

# 🔐 Authentication

My-Kart uses JWT-based authentication.

### Login Flow

```text
👤 User
  ↓
📧 Email + Password
  ↓
🔐 Backend
  ↓
🔎 Verify User
  ↓
🔑 JWT Token
  ↓
💾 localStorage
  ↓
🛡️ Protected API Requests
```

### Role-based Access

Two user roles are supported:

```text
CUSTOMER
ADMIN
```

Admin routes are protected using JWT authentication and role guards.

---

# 🔑 Forgot Password / Password Reset

My-Kart includes a complete password reset system.

### Security Flow

```text
👤 User
   ↓
🔑 Forgot Password
   ↓
📧 Enter Email
   ↓
🎲 Secure Random Token
   ↓
# SHA-256 Hash
   ↓
🗄️ Store Token Hash
   ↓
⏱️ 15 Minute Expiration
   ↓
📨 Resend
   ↓
🔗 Reset Link
   ↓
🔑 New Password
   ↓
🔒 bcrypt Hash
   ↓
🗑️ Invalidate Reset Token
```

### Security Features

* 🎲 Secure random reset token
* # SHA-256 token hashing
* ⏱️ Token expiration
* 🔒 bcrypt password hashing
* 🗑️ Token invalidation after successful reset
* 🚫 No plaintext password storage
* 🚫 No plaintext password sent by email

---

# ⚠️ Important Password Reset Limitation

> ## 📧 Resend Testing Configuration

The **password reset functionality itself is fully implemented and tested**, but the current email delivery setup uses the **Resend testing configuration**.

The current sender configuration uses a Resend-provided testing sender such as:

```text
onboarding@resend.dev
```

This is suitable for development/testing, but it is **not the final production email configuration** for sending password reset emails to arbitrary users.

### What currently works

| Component                  | Status |
| -------------------------- | ------ |
| 🔑 Forgot Password API     | ✅      |
| 🎲 Token Generation        | ✅      |
| # Token Hashing            | ✅      |
| ⏱️ Token Expiration        | ✅      |
| 🔗 Reset Link              | ✅      |
| 🔑 Reset Password          | ✅      |
| 🔒 bcrypt Password Hashing | ✅      |
| 🗑️ Token Invalidation     | ✅      |
| 📧 Resend Integration      | ✅      |
| 🌐 Production Email Domain | ⏳      |

### Current Limitation

With the current Resend testing setup, email delivery is restricted by the provider's testing configuration.

Therefore, **a password reset request may not be delivered to an arbitrary user's email address while using the current test sender configuration**.

This means:

```text
Password Reset Logic
        ↓
       ✅
Email Sending Integration
        ↓
       ✅
Production Email Delivery
        ↓
       ⏳
Verified Sending Domain Required
```

### Production Solution

For production email delivery:

1. 🌐 Add a domain to Resend.
2. 🔎 Verify the domain through DNS.
3. ⚙️ Configure the required DNS records.
4. 📧 Use a sender address from the verified domain.
5. 🔐 Update the production `RESEND_API_KEY`.
6. 🔄 Update the backend sender configuration.

Example:

```env
FRONTEND_URL=https://your-frontend-domain.com
RESEND_API_KEY=your_resend_api_key
```

Production sender:

```text
My-Kart <no-reply@yourdomain.com>
```

This limitation is a **deployment/email-provider configuration issue**, not a missing password-reset feature.

---

# 🛒 Cart System

The cart is persistent and user-specific.

Users can:

* ➕ Add items
* ➖ Update quantity
* ❌ Remove items
* 🧹 Clear cart
* 💰 Calculate subtotal
* 🔢 View total item count

### Payment-aware Cart Clearing

The cart is cleared **only after successful payment validation**.

```text
🛒 Cart
  ↓
📦 Order Created
  ↓
💳 SSLCommerz
  ↓
✅ Payment Validated
  ↓
📦 Order → PAID
  ↓
🧹 Delete Cart Items
  ↓
🛒 Badge → 0
```

If payment fails:

```text
❌ Payment Failed
      ↓
🛒 Cart Remains
```

If payment is cancelled:

```text
🚫 Payment Cancelled
      ↓
🛒 Cart Remains
```

---

# 📦 Order Management

The backend uses a strict order status workflow.

## Order Status

```text
🟡 PENDING
     │
     ├────→ 💚 PAID
     │          │
     │          ├────→ ⚙️ PROCESSING
     │          │          │
     │          │          └────→ 🚚 SHIPPED
     │          │                     │
     │          │                     └────→ ✅ DELIVERED
     │          │
     │          └────→ ❌ CANCELLED
     │
     └────→ ❌ CANCELLED
```

Invalid transitions are rejected by the backend.

For example:

```text
❌ PENDING → SHIPPED
❌ PAID → SHIPPED
❌ DELIVERED → PROCESSING
```

This prevents invalid order states.

---

# ⭐ Product Rating System

The rating system follows real-world e-commerce rules.

### Rules

* 🔐 User must be authenticated.
* 🛍️ User must have purchased the product.
* ❌ Cancelled orders do not qualify.
* 1️⃣ One rating per user/product.
* ✏️ Existing ratings can be updated.
* ⭐ Rating range is 1–5.
* 📊 Average rating is calculated dynamically.

### Database Constraint

```ts
@Unique(['userId', 'productId'])
```

This prevents duplicate ratings for the same user/product combination.

---

# ⚡ Real-Time Rating

Socket.IO is used for real-time rating synchronization.

```text
👤 User A
   ↓
⭐ Submit Rating
   ↓
⚙️ NestJS
   ↓
🗄️ PostgreSQL
   ↓
⚡ Socket.IO Event
   ↓
👥 Connected Users
   ↓
⭐ Rating Updates
```

Event:

```text
ratingUpdated
```

Example payload:

```json
{
  "productId": "product-id",
  "averageRating": 4.5,
  "totalRatings": 10
}
```

---

# 🏠 Home Page Product Ratings

Product cards display ratings directly on the homepage.

Example:

```text
📱 Nothing 4a Pro

৳ 45,000

⭐ 4.5
(24 ratings)
```

Users do not need to open the product details page to see the rating.

---

# 📊 Admin Analytics

The admin dashboard includes analytics for:

* 📦 Total orders
* 💳 Paid orders
* ❌ Cancelled orders
* 💰 Total revenue
* 📋 Order status breakdown

Charts are implemented using:

📊 **Recharts**

---

# 🧾 Invoice / Receipt

Admin users can access order invoices.

Invoice information includes:

* 🛒 My-Kart branding
* 🔢 Order number
* 👤 Customer information
* 📍 Shipping information
* 🛍️ Products
* 🔢 Quantity
* 💰 Pricing
* 💳 Payment information
* 📦 Order status
* 🧮 Total amount

The invoice supports browser print/download functionality.

---

# 🧩 Challenges & Solutions

Building My-Kart involved several real-world technical challenges.

---

## 🐘 1. TypeORM + PostgreSQL Data Type Error

### Problem

While implementing password reset fields, PostgreSQL produced:

```text
DataTypeNotSupportedError:
Data type "Object" in
"User.resetPasswordTokenHash"
is not supported by "postgres"
```

### Cause

TypeORM could not correctly infer the database type for the nullable field.

### Solution

Explicit PostgreSQL-compatible types were added:

```ts
@Column({
  type: 'varchar',
  nullable: true,
})
resetPasswordTokenHash: string | null;

@Column({
  type: 'timestamp',
  nullable: true,
})
resetPasswordExpires: Date | null;
```

### Result

✅ Database connection restored.

---

# ⚡ 2. NestJS WebSocket Version Conflict

### Problem

The project was using NestJS 11, while installing the latest WebSocket packages introduced dependency conflicts with NestJS 12 packages.

### Solution

NestJS 11-compatible packages were installed:

```bash
npm install @nestjs/websockets@^11 @nestjs/platform-socket.io@^11 socket.io
```

### Result

✅ Socket.IO integration worked with the existing NestJS version.

---

# 🔌 3. Socket.IO Invalid Namespace Error

### Problem

The initial Socket.IO connection returned:

```text
Invalid namespace
```

### Cause

The client URL/path configuration did not correctly match the Socket.IO server configuration.

### Solution

The client was configured explicitly:

```ts
const socket = io('http://localhost:4000', {
  path: '/socket.io',
  transports: ['websocket'],
});
```

### Result

```text
Rating socket connected
```

✅ Real-time rating synchronization worked.

---

# ⭐ 4. Real-Time Rating Synchronization

### Problem

A rating submitted from one browser was not immediately reflected in another browser.

### Solution

Socket.IO was introduced.

```text
⭐ Rating Submitted
       ↓
⚙️ Backend
       ↓
🗄️ Database
       ↓
⚡ WebSocket Event
       ↓
👥 Connected Clients
```

### Result

✅ Rating updates appear in real time without refreshing.

---

# 🛍️ 5. Purchased-User-Only Rating

### Problem

A basic rating API could allow an authenticated user to rate products they never purchased.

### Solution

The backend checks:

```text
👤 User
 ↓
📦 Order Exists
 ↓
🛍️ Product Exists in Order
 ↓
🚫 Order Not Cancelled
 ↓
⭐ Rating Allowed
```

Otherwise:

```text
403 Forbidden
```

### Lesson

Business rules must be enforced on the backend, not only through frontend UI.

---

# 1️⃣ 6. Duplicate Product Ratings

### Problem

A user could potentially create multiple ratings for the same product.

### Solution

A database-level unique constraint was added:

```ts
@Unique(['userId', 'productId'])
```

Existing ratings are updated instead of creating another rating.

### Result

```text
👤 User + 🛍️ Product
        ↓
    ⭐ One Rating
        ↓
Future Rating → ✏️ Update
```

---

# 📦 7. Invalid Order Status Transitions

### Problem

During development, an admin attempted to move:

```text
PAID → SHIPPED
```

directly.

The backend correctly rejected the invalid transition.

### Solution

A strict transition map was implemented.

```text
PENDING
  ↓
PAID
  ↓
PROCESSING
  ↓
SHIPPED
  ↓
DELIVERED
```

### Result

✅ Invalid order transitions are rejected server-side.

---

# 💳 8. SSLCommerz Local Callback Problem

### Problem

During local development, the backend was running on:

```text
http://localhost:4000
```

But SSLCommerz needs a publicly accessible callback URL.

### Solution

ngrok was used during local payment testing:

```bash
ngrok http 4000
```

This temporarily exposed the local backend to the internet.

### Important

ngrok is only a **development/testing tool**.

It is not required for production.

After deployment:

```text
SSLCommerz
    ↓
https://your-backend.onrender.com/api/payments/success
```

---

# 🔎 9. SSLCommerz Payment Validation

### Problem

A frontend redirect alone cannot be treated as proof of successful payment.

### Solution

The backend validates the payment with SSLCommerz before marking the order as paid.

```text
💳 Payment Callback
       ↓
🔎 SSLCommerz Validation
       ↓
✅ VALID / VALIDATED
       ↓
📦 Order → PAID
```

### Result

✅ Payment status is controlled by the backend.

---

# 🛒 10. Cart Badge Did Not Clear After Payment

### Problem

After successful payment:

```text
📦 Order → PAID
🛒 Cart → 1
```

The order was paid, but the cart remained.

### Cause

The database cart was not cleared after successful payment confirmation.

### Solution

Cart items are deleted only after verified payment:

```text
💳 Payment
   ↓
🔎 Validation
   ↓
📦 Order → PAID
   ↓
🧹 CartItem DELETE
   ↓
🛒 Cart Badge → 0
```

### Result

✅ Cart stays empty after refresh as well.

---

# 👤 11. `/auth/me` Missing Phone Number

### Problem

The phone number existed in the database but disappeared after refreshing the page.

### Cause

The JWT strategy returned:

```text
id
email
role
name
```

but not:

```text
phone
```

### Solution

The JWT validation response was updated:

```ts
return {
  id: user.id,
  email: user.email,
  role: user.role,
  name: user.name,
  phone: user.phone,
};
```

### Result

✅ Phone information persists correctly after authentication refresh.

---

# 🔄 12. Home Page Rating API Optimization

Currently, product ratings are fetched individually.

Conceptually:

```text
GET /products

GET /ratings/product/1
GET /ratings/product/2
GET /ratings/product/3
...
```

This works for the current project.

For a significantly larger catalog, the system can later be optimized using:

* 📊 Product-level rating aggregation
* 📡 Bulk rating endpoint
* 🗄️ Cached rating summaries

This is an optimization opportunity, not a current functional issue.

---

# 🏗️ Architecture

```text
                         🌐 Internet
                              │
                              ▼
                    ┌──────────────────┐
                    │     Next.js      │
                    │    Frontend      │
                    │                  │
                    │ ⚛️ React         │
                    │ 🎨 Tailwind      │
                    │ 📡 Axios         │
                    │ 🧠 Context API   │
                    │ ⚡ Socket.IO     │
                    └────────┬─────────┘
                             │
                             │ REST API
                             ▼
                    ┌──────────────────┐
                    │     NestJS       │
                    │     Backend      │
                    │                  │
                    │ 🔐 Auth          │
                    │ 👤 Users         │
                    │ 🛍️ Products      │
                    │ 🛒 Cart          │
                    │ 📦 Orders        │
                    │ 💳 Payments      │
                    │ ⭐ Ratings       │
                    │ ☁️ Upload        │
                    └───────┬──────────┘
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
       ┌─────────────────┐      ┌─────────────────┐
       │ 🐘 PostgreSQL   │      │ ☁️ Cloudinary   │
       │                 │      │                 │
       │ Users           │      │ Product Images  │
       │ Products        │      └─────────────────┘
       │ Cart            │
       │ Orders          │
       │ Ratings         │
       └─────────────────┘

                 External Integrations
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
       💳 SSLCommerz  📧 Resend   ⚡ Socket.IO
         Payment       Email       Realtime
```

---

# 📁 Project Structure

```text
my_kart/
│
├── frontend/
│   │
│   ├── app/
│   │   ├── admin/
│   │   ├── checkout/
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── reset-password/
│   │   └── ...
│   │
│   ├── components/
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   │
│   ├── lib/
│   ├── types/
│   └── ...
│
├── backend/
│   │
│   └── src/
│       ├── auth/
│       ├── cart/
│       ├── orders/
│       ├── payments/
│       ├── products/
│       ├── ratings/
│       ├── users/
│       ├── upload/
│       └── ...
│
└── README.md
```

---

# 🔐 Environment Variables

## 🎨 Frontend

Development:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Production:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

---

## ⚙️ Backend

Example:

```env
PORT=4000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:3000

BACKEND_URL=http://localhost:4000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_LIVE=false

RESEND_API_KEY=your_resend_api_key
```

> 🔒 **Never commit real secrets, API keys, passwords or database credentials to GitHub.**

---

# 🚀 Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/raihankabir1952/my-kart.git
cd my-kart
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Configure `.env`.

Then:

```bash
npm run start:dev
```

Backend:

```text
http://localhost:4000
```

API:

```text
http://localhost:4000/api
```

---

## 3️⃣ Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# 🧪 Tested Development Flows

## 🔐 Authentication

```text
📝 Register
   ↓
🔐 Login
   ↓
🎟️ JWT
   ↓
🔄 Refresh
   ↓
👤 Authenticated User
```

## 🛒 Cart

```text
➕ Add
 ↓
🔢 Quantity
 ↓
❌ Remove
 ↓
🧹 Clear
```

## 💵 COD

```text
🛒 Cart
 ↓
📦 Checkout
 ↓
💵 COD
 ↓
📦 Order Created
```

## 💳 Online Payment

```text
🛒 Cart
 ↓
📦 Create Order
 ↓
💳 SSLCommerz
 ↓
✅ Payment
 ↓
🔎 Validation
 ↓
📦 PAID
 ↓
🧹 Cart Cleared
```

## ⭐ Rating

```text
📦 Purchased Product
 ↓
⭐ Submit Rating
 ↓
🔎 Backend Verification
 ↓
🗄️ Save
 ↓
⚡ Socket.IO
 ↓
👥 Real-Time UI Update
```

## 🔑 Password Reset

```text
🔑 Forgot Password
 ↓
📧 Email
 ↓
🔗 Reset Link
 ↓
🔑 New Password
 ↓
✅ Login
```

---

# ⚠️ Current Limitations

## 📧 1. Resend Testing Configuration

The password reset feature is implemented, but production email delivery requires an appropriate verified sending domain/configuration.

See:

**[Forgot Password / Password Reset](#-forgot-password--password-reset)**

---

## 💳 2. SSLCommerz Sandbox

The project uses SSLCommerz sandbox/test credentials during development.

Production deployment requires:

* Production merchant credentials
* Production payment configuration
* Production callback URLs

---

## 📊 3. Product Rating API Optimization

The current homepage retrieves ratings individually for each product.

For large catalogs, a bulk rating API or product-level rating aggregation can reduce API requests.

---

## 🌐 4. Local Payment Callback

During local development, ngrok may be required for payment callbacks.

After deployment, the public backend URL can be used directly.

---

# 🔒 Security Considerations

Implemented:

* 🔐 JWT authentication
* 🛂 Role-based authorization
* 🔒 bcrypt password hashing
* # SHA-256 reset-token hashing
* ⏱️ Reset-token expiration
* 🛡️ Protected backend routes
* ✅ DTO validation
* 🔎 Server-side payment validation
* 1️⃣ Database-level rating uniqueness
* 🚫 Backend business-rule enforcement

Potential future hardening:

* 🚦 Rate limiting
* 🛡️ Security headers
* 🌐 Production CORS restrictions
* 🗄️ Database migrations
* 📋 Centralized logging
* 🚨 Error monitoring
* 🔄 Secret rotation
* 🧪 Automated tests

---

# 🚀 Deployment Architecture

The planned production architecture:

```text
                    🌐 Users
                       │
                       ▼
               ┌─────────────────┐
               │     Vercel      │
               │    Next.js      │
               └────────┬────────┘
                        │
                        ▼
               ┌─────────────────┐
               │     Render      │
               │     NestJS      │
               └───────┬─────────┘
                       │
             ┌─────────┴──────────┐
             ▼                    ▼
      ┌──────────────┐     ┌──────────────┐
      │ 🐘 Supabase  │     │ ☁️ Cloudinary │
      │ PostgreSQL   │     │    Images    │
      └──────────────┘     └──────────────┘

               External Services
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
        💳 SSLCommerz          📧 Resend
          Payment                Email
```

---

# 📈 Future Improvements

Possible future improvements:

* 🔎 Advanced product search
* 🏷️ Product filtering
* 📄 Pagination
* ❤️ Wishlist
* 🎟️ Coupon system
* 💬 Product reviews/comments
* 📧 Order confirmation emails
* 📦 Inventory reservation
* ⚡ Redis caching
* 📊 Bulk rating endpoint
* 🗄️ Database migrations
* 🧪 Automated testing
* 🔄 CI/CD
* 🚨 Error monitoring
* 📈 Advanced admin reporting

---

# 🎓 What This Project Demonstrates

My-Kart demonstrates practical full-stack development experience across:

### 🎨 Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Context API
* Axios
* Socket.IO Client
* Recharts

### ⚙️ Backend

* NestJS
* TypeScript
* REST APIs
* JWT
* Passport
* bcrypt
* TypeORM
* class-validator
* Socket.IO

### 🗄️ Database

* PostgreSQL
* Relational data modeling
* TypeORM relationships
* Unique constraints

### ☁️ Services

* Cloudinary
* SSLCommerz
* Resend

### 🧠 Engineering

* Authentication
* Authorization
* Business-rule validation
* Payment validation
* Real-time communication
* State synchronization
* Error handling
* Third-party integrations
* Production deployment preparation

---

# 🧑‍💻 Developer

## Md Raihan Kabir

**Full-Stack Web Developer**

### 💻 Core Technologies

```text
⚛️ React.js
▲ Next.js
🐈 NestJS
🔷 TypeScript
🐘 PostgreSQL
🗄️ TypeORM
🔐 JWT
⚡ Socket.IO
☁️ Cloudinary
💳 SSLCommerz
📧 Resend
```

### 🔗 GitHub

https://github.com/raihankabir1952

---

# 📊 Project Status

| Area                       | Status         |
| -------------------------- | -------------- |
| 🎨 Frontend                | ✅ Complete     |
| ⚙️ Backend                 | ✅ Complete     |
| 🗄️ Database               | ✅ Complete     |
| 🔐 Authentication          | ✅ Complete     |
| 🛒 Cart                    | ✅ Complete     |
| 📦 Orders                  | ✅ Complete     |
| 💳 Payment Integration     | ✅ Complete     |
| ⭐ Rating System            | ✅ Complete     |
| ⚡ Real-Time Rating         | ✅ Complete     |
| 📊 Admin Analytics         | ✅ Complete     |
| 🧾 Invoice                 | ✅ Complete     |
| 🔑 Password Reset          | ✅ Complete     |
| 📧 Production Email Domain | ⏳ Pending      |
| 🌐 Production Deployment   | 🚧 In Progress |

---

# ❤️ Built Through Real-World Debugging

My-Kart was developed as a hands-on full-stack project focused not only on building features, but also on understanding and solving real integration problems.

During development, the project involved challenges across:

```text
🐘 PostgreSQL
🗄️ TypeORM
🔐 Authentication
⚡ WebSockets
⭐ Real-Time Ratings
💳 Payment Gateway
🌐 Callback URLs
🛒 Cart State
📧 Email Delivery
☁️ Cloud Storage
📊 Admin Analytics
```

Each challenge required debugging across multiple layers of the application.

The goal of My-Kart was not simply to build an e-commerce interface, but to understand how a complete full-stack application behaves when frontend, backend, database and third-party services work together.

---

<p align="center">
  <strong>🛒 My-Kart — Full-Stack E-Commerce Application</strong>
</p>

<p align="center">
  Built with ❤️ using modern web technologies.
</p>
