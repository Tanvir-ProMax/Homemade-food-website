# Homemade Food by Maria

A full-stack MERN application for ordering homemade food online. Built with React, Express, MongoDB, and TailwindCSS.

## 🚀 Live Demo

- **Frontend**: [Vercel Deployment](https://homemade-food.vercel.app) (Coming Soon)
- **Backend API**: [Render Deployment](https://homemade-food-api.onrender.com) (Coming Soon)

## 📋 Features

- **User Authentication**: Login and register with JWT-based authentication
- **Dynamic Menu**: Browse and filter through a variety of homemade food items
- **Shopping Cart**: Add items to cart, manage quantities, and view totals
- **Checkout System**: Secure order placement with user details
- **Order Tracking**: Track order status and history
- **Responsive Design**: Mobile-friendly interface built with TailwindCSS
- **Toast Notifications**: Real-time feedback for user actions

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS 4** - CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Icons** - Icon library

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Project Structure

```
homemade-food-by-maria/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── context/          # React context providers
│   └── assets/           # Static assets
├── Backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   └── routes/           # API routes
├── public/               # Static files
└── index.html            # Entry HTML file
```

## Installation

### Frontend Setup

```bash
npm install
npm run dev
```

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/database
JWT_SECRET=your-jwt-secret-here
NODE_ENV=development
```

Start the backend server:

```bash
npm start
```

Or using the server file directly:

```bash
node server.js
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `node server.js` - Start the backend server

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user/:userId` - Get user orders
- `GET /api/orders/:id` - Get order by ID

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Author

Tanvir-ProMax - [GitHub](https://github.com/Tanvir-ProMax)
