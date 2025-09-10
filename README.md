# E-commerce Platform Backend

This is the backend for a comprehensive e-commerce platform built with Node.js and Express. It provides a robust set of features for user management, product handling, order processing, and more. The application is designed to be scalable, secure, and easy to maintain.

## Table of Contents

  - [Features](https://www.google.com/search?q=%23features)
  - [Technologies Used](https://www.google.com/search?q=%23technologies-used)
  - [Getting Started](https://www.google.com/search?q=%23getting-started)
      - [Prerequisites](https://www.google.com/search?q=%23prerequisites)
      - [Installation](https://www.google.com/search?q=%23installation)
  - [Environment Variables](https://www.google.com/search?q=%23environment-variables)
  - [API Endpoints](https://www.google.com/search?q=%23api-endpoints)
      - [Auth Routes](https://www.google.com/search?q=%23auth-routes)
      - [User Routes](https://www.google.com/search?q=%23user-routes)
      - [Product Routes](https://www.google.com/search?q=%23product-routes)
      - [Order Routes](https://www.google.com/search?q=%23order-routes)
  - [Project Structure](https://www.google.com/search?q=%23project-structure)
  - [Seeder Script](https://www.google.com/search?q=%23seeder-script)

## Features

  - **User Authentication**: Secure user registration and login with JWT-based authentication. Includes password hashing with `bcryptjs` and forgot/reset password functionality.
  - **Google OAuth 2.0**: Seamless user login and registration using Google accounts.
  - **User Profile Management**: Users can view and update their profile information, including name, email, and mobile number.
  - **Avatar Uploads**: Supports user avatar uploads, which are stored and managed via the Cloudinary cloud-based service.
  - **Address Management**: Users can add and update their shipping address.
  - **Product Management**: The system can manage a catalog of products, categorized for easy browsing.
  - **Order Processing**: Users can create orders, view their order history, and receive email confirmations.
  - **Email Notifications**: Automated email notifications for key events such as user signup, login, order confirmation, and password reset, using Nodemailer with Gmail.
  - **Database Seeding**: A simple script to populate the database with initial product data for development and testing.

## Technologies Used

  - **Backend**: Node.js, Express.js
  - **Database**: MongoDB, Mongoose
  - **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, Google Auth Library (`google-auth-library`)
  - **File Storage**: Cloudinary for cloud-based image storage, Multer for handling file uploads
  - **Email**: Nodemailer
  - **Environment Management**: `dotenv`
  - **CORS**: `cors` middleware

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

  - [Node.js](https://nodejs.org/) (v16.x or later recommended)
  - [npm](https://www.npmjs.com/)
  - [MongoDB](https://www.mongodb.com/try/download/community) installed and running.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/e-commerce-platform-backend.git
    cd e-commerce-platform-backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the variables listed in the [Environment Variables](https://www.google.com/search?q=%23environment-variables) section.

4.  **Seed the database:**
    To populate the database with initial product data, run the seeder script:

    ```bash
    npm run seed
    ```

5.  **Start the server:**

    ```bash
    npm start
    ```

    The server will start on `http://localhost:5000`.

## Environment Variables

Create a `.env` file in the root of the project and add the following variables. Replace the placeholder values with your actual credentials.

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/ecommerce

# JWT Secret Key
JWT_SECRET=your_jwt_secret_key

# Google OAuth Client ID
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE

# Nodemailer (Gmail) Credentials
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## API Endpoints

### Auth Routes

  * `POST /api/auth/signup`: Register a new user.
  * `POST /api/auth/login`: Authenticate a user and get a JWT token.
  * `POST /api/auth/google-login`: Authenticate a user with a Google ID token.
  * `POST /api/auth/forgotpassword`: Send a password reset email.
  * `POST /api/auth/resetpassword/:token`: Reset user password with a valid token.

### User Routes

  * `GET /api/user/profile`: (Protected) Get the logged-in user's profile.
  * `PUT /api/user/profile`: (Protected) Update the logged-in user's profile.
  * `POST /api/user/avatar`: (Protected) Upload an avatar for the user.
  * `PUT /api/user/address`: (Protected) Update the user's address.
  * `PUT /api/user/password`: (Protected) Change the user's password.

### Product Routes

  * `GET /api/products/demanded`: Get all products marked as "demanded".
  * `GET /api/products/men`: Get all products in the "men" category.
  * `GET /api/products/women`: Get all products in the "women" category.
  * `GET /api/products/kids`: Get all products in the "kids" category.
  * `GET /api/products/beauty`: Get all products in the "beauty" category.

### Order Routes

  * `POST /api/orders`: (Protected) Create a new order.
  * `GET /api/orders/myorders`: (Protected) Get all orders for the logged-in user.
  * `POST /api/orders/confirmation`: (Protected) Send an order confirmation email.
  * `GET /api/orders/invoice/:orderId`: (Protected) Download a placeholder invoice for an order.

## Project Structure

```
E-commerce-platform-backend/
├── config/
│   ├── cloudinary.js     # Cloudinary configuration
│   └── db.js             # Database connection logic
├── controllers/
│   ├── authController.js   # Logic for authentication
│   ├── orderController.js  # Logic for order management
│   ├── productController.js# Logic for fetching products
│   └── userController.js   # Logic for user profile management
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── models/
│   ├── Order.js          # Order database schema
│   ├── Product.js        # Product database schema
│   └── User.js           # User database schema
├── routes/
│   ├── authRoutes.js     # Authentication API routes
│   ├── orderRoutes.js    # Order API routes
│   ├── productRoutes.js  # Product API routes
│   └── userRoutes.js     # User API routes
├── utils/
│   ├── data.js           # Sample product data for seeder
│   └── mailer.js         # Nodemailer email sending utility
├── .env                  # Environment variables (ignored by git)
├── package.json
├── package-lock.json
├── seeder.js             # Script to seed database with initial data
└── server.js             # Main server entry point
```

## Seeder Script

The `seeder.js` script is used to populate the database with initial product data from `utils/data.js`.

**To import data:**

```bash
npm run seed
```

This command will clear the existing `products` collection and insert the products from the `data.js` file.
