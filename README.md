<div align="center">

# 🔧 Chef Lokal - Server

### *Robust Backend API for Home-Cooked Meal Marketplace*

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-20.0.0-008CDD?style=for-the-badge&logo=stripe)](https://stripe.com/)

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Desktop%20Computer.png" alt="Server" width="150" height="150" />

---

### 🚀 Powering Seamless Food Marketplace Operations

</div>

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [NPM Packages](#-npm-packages-used)
- [Security](#-security)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)

---

## 🎯 About

The **Chef Lokal Server** is a RESTful API built with Node.js, Express, and MongoDB that powers the Chef Lokal marketplace. It handles authentication, order management, payment processing, and all business logic for connecting home chefs with customers.

### 🏗️ Architecture Highlights

- **RESTful API Design** - Clean, consistent endpoint structure
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Granular permission management
- **MongoDB Database** - Flexible NoSQL data storage
- **Stripe Integration** - Secure payment processing
- **Firebase Admin SDK** - Authentication verification
- **CORS Enabled** - Secure cross-origin requests

---

## ✨ Features

### 🔐 **Authentication & Security**
- JWT token generation and verification
- Firebase Admin SDK integration
- Password hashing and validation
- Role-based middleware protection
- Secure environment variable management

### 📊 **Data Management**
- User CRUD operations
- Meal creation and management
- Order processing and tracking
- Review and rating system
- Favorite meals management
- Role request handling

### 💳 **Payment Processing**
- Stripe payment intent creation
- Payment confirmation handling
- Payment history tracking
- Secure webhook processing

### 📈 **Admin Operations**
- User role management
- Fraud detection and marking
- Platform statistics calculation
- Request approval system
- Chef ID generation

### 🔍 **Advanced Features**
- Sorting and filtering
- Pagination support
- Search functionality
- Real-time status updates
- Aggregate statistics

---

## 🛠️ Tech Stack

<div align="center">

| Runtime | Framework | Database | Authentication | Payment |
|---------|-----------|----------|----------------|---------|
| Node.js | Express 5.2.1 | MongoDB 7.0.0 | Firebase Admin | Stripe 20.0.0 |

</div>

### Core Technologies
- **express** - Fast, unopinionated web framework
- **mongodb** - Official MongoDB driver for Node.js
- **firebase-admin** - Firebase Admin SDK for server-side operations
- **stripe** - Payment processing platform
- **cors** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management

---

## 🌐 API Endpoints

### Authentication
```http
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # User login
POST   /api/auth/verify-token      # Verify JWT token
```

### Users
```http
GET    /api/users                  # Get all users (Admin)
GET    /api/users/:email           # Get user by email
PATCH  /api/users/:email           # Update user profile
PATCH  /api/users/:email/role      # Update user role (Admin)
PATCH  /api/users/:email/status    # Mark user as fraud (Admin)
```

### Meals
```http
GET    /api/meals                  # Get all meals (with pagination)
GET    /api/meals/:id              # Get meal details
POST   /api/meals                  # Create meal (Chef)
PATCH  /api/meals/:id              # Update meal (Chef)
DELETE /api/meals/:id              # Delete meal (Chef)
GET    /api/meals/chef/:chefId     # Get meals by chef
```

### Orders
```http
GET    /api/orders                 # Get all orders (Admin)
GET    /api/orders/user/:email     # Get user orders
GET    /api/orders/chef/:chefId    # Get chef orders
POST   /api/orders                 # Create new order
PATCH  /api/orders/:id             # Update order status
DELETE /api/orders/:id             # Cancel order
```

### Reviews
```http
GET    /api/reviews/food/:foodId   # Get reviews for a meal
GET    /api/reviews/user/:email    # Get user's reviews
POST   /api/reviews                # Create review
PATCH  /api/reviews/:id            # Update review
DELETE /api/reviews/:id            # Delete review
```

### Favorites
```http
GET    /api/favorites/:email       # Get user favorites
POST   /api/favorites              # Add to favorites
DELETE /api/favorites/:id          # Remove from favorites
```

### Requests (Role Changes)
```http
GET    /api/requests                # Get all requests (Admin)
POST   /api/requests                # Submit role request
PATCH  /api/requests/:id/approve    # Approve request (Admin)
PATCH  /api/requests/:id/reject     # Reject request (Admin)
```

### Payments
```http
POST   /api/payments/create-intent  # Create payment intent
POST   /api/payments/confirm         # Confirm payment
GET    /api/payments/history/:email  # Get payment history
```

### Statistics
```http
GET    /api/statistics              # Get platform statistics (Admin)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB (local or Atlas cluster)
- Firebase Admin SDK credentials
- Stripe account and API keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TusharChow20/project-Chef-Lokal-server.git
   cd chef-lokal-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   
   # Firebase Admin SDK
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   
   # CORS
   CLIENT_URL=http://localhost:5173
   ```

4. **Initialize Firebase Admin**
   
   Place your `serviceAccountKey.json` in the root directory or use environment variables.

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Server is running!**
   ```
   Server running on http://localhost:5000
   ```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | ✅ |
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT signing | ✅ |
| `FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | ✅ |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret API key | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | ⚠️ |
| `CLIENT_URL` | Frontend application URL | ✅ |

### Environment Setup Example

```env
# Server Configuration
PORT=5000
NODE_ENV=production


# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d

# Firebase Admin SDK
FIREBASE_PROJECT_ID=chef-lokal
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@chef-lokal.iam.gserviceaccount.com


# CORS
CLIENT_URL=https://chef-lokal.vercel.app
```

---

## 💾 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  image: String,
  address: String,
  role: String, // "user" | "chef" | "admin"
  status: String, // "active" | "fraud"
  chefId: String, // Only for chefs
  createdAt: Date
}
```

### Meals Collection
```javascript
{
  _id: ObjectId,
  foodName: String,
  chefName: String,
  foodImage: String,
  price: Number,
  rating: Number,
  ingredients: [String],
  deliveryArea: String,
  estimatedDeliveryTime: String,
  chefExperience: String,
  chefId: String,
  userEmail: String,
  createdAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  foodId: ObjectId,
  mealName: String,
  price: Number,
  quantity: Number,
  chefId: String,
  paymentStatus: String, // "pending" | "paid"
  userEmail: String,
  userAddress: String,
  orderStatus: String, // "pending" | "accepted" | "delivered" | "cancelled"
  orderTime: Date
}
```

### Reviews Collection
```javascript
{
  _id: ObjectId,
  foodId: ObjectId,
  reviewerName: String,
  reviewerImage: String,
  rating: Number,
  comment: String,
  date: Date
}
```

### Favorites Collection
```javascript
{
  _id: ObjectId,
  userEmail: String,
  mealId: String,
  mealName: String,
  chefId: String,
  chefName: String,
  price: Number,
  addedTime: Date
}
```

### Requests Collection
```javascript
{
  _id: ObjectId,
  userName: String,
  userEmail: String,
  requestType: String, // "chef" | "admin"
  requestStatus: String, // "pending" | "approved" | "rejected"
  requestTime: Date
}
```

---

## 📦 NPM Packages Used

### Dependencies

- **express** (^5.2.1)
  - Fast, unopinionated, minimalist web framework for Node.js
  - Handles routing, middleware, and HTTP utilities

- **mongodb** (^7.0.0)
  - Official MongoDB driver for Node.js
  - Provides database connection and CRUD operations

- **cors** (^2.8.5)
  - Middleware for enabling Cross-Origin Resource Sharing
  - Allows frontend to communicate with backend

- **dotenv** (^17.2.3)
  - Loads environment variables from .env file
  - Keeps sensitive configuration secure

- **firebase-admin** (^13.6.0)
  - Firebase Admin SDK for server-side operations
  - Used for authentication verification and user management

- **stripe** (^20.0.0)
  - Official Stripe API library for Node.js
  - Handles payment processing and webhooks

### Dev Dependencies

```json
{
  "nodemon": "^3.0.0",        // Auto-restart server on changes
  "eslint": "^8.50.0",        // Code linting
  "prettier": "^3.0.0"        // Code formatting
}
```

---

## 🔒 Security

### Security Best Practices Implemented

1. **Environment Variables**
   - All sensitive data stored in `.env` file
   - Never committed to version control

2. **JWT Authentication**
   - Secure token-based authentication
   - Tokens expire after set duration
   - Refresh token mechanism

3. **Password Security**
   - Passwords hashed before storage
   - Bcrypt with salt rounds

4. **CORS Configuration**
   - Whitelisted origins only
   - Credentials enabled for authenticated requests

5. **Input Validation**
   - Sanitize all user inputs
   - Validate data before database operations

6. **Rate Limiting**
   - Prevent brute force attacks
   - Limit API request frequency

7. **Firebase Admin Verification**
   - Server-side token verification
   - No client-side security bypass

---

## 🚀 Deployment

### Deployment Checklist

- [ ] Set all environment variables in hosting platform
- [ ] Update `CLIENT_URL` with production frontend URL
- [ ] Configure MongoDB Atlas network access
- [ ] Set up Firebase project for production
- [ ] Configure Stripe webhooks for production
- [ ] Enable CORS for production domain
- [ ] Test all API endpoints
- [ ] Monitor error logs

### Recommended Platforms

| Platform | Best For | Free Tier |
|----------|----------|-----------|
| [Vercel](https://vercel.com) | Quick deployment | ✅ |

### Deployment Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Run with PM2 (production)
pm2 start server.js --name chef-lokal-api
```

---

## 📚 API Documentation

### Response Format

All API responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error message"
  }
}
```

### Authentication

Protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Pagination

List endpoints support pagination:

```http
GET /api/meals?page=1&limit=10
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

```
tests/
├── unit/
│   ├── models/
│   ├── controllers/
│   └── middleware/
├── integration/
│   └── api/
└── e2e/
    └── workflows/
```

---

## 📊 Monitoring & Logging

### Logging Levels

- **ERROR** - System errors and exceptions
- **WARN** - Warning messages
- **INFO** - General information
- **DEBUG** - Detailed debug information

### Recommended Monitoring Tools

- **Winston** - Flexible logging library
- **Morgan** - HTTP request logger
- **Sentry** - Error tracking and monitoring
- **New Relic** - Application performance monitoring

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Use ESLint configuration
- Follow Airbnb JavaScript style guide
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

**Project Maintainer:** Your Name

- 📧 Email: tusharchowdhury20211@gmail.com
- 🐙 GitHub: [Tushar Chowdhury](https://github.com/TusharChow20)

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Fast Node.js framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Firebase](https://firebase.google.com/) - Authentication platform
- [Stripe](https://stripe.com/) - Payment processing
- [Node.js](https://nodejs.org/) - JavaScript runtime

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

**Built with 💻 and powered by ☕**

![Server Animation](https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png)

</div>