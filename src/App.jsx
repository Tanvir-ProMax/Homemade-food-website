import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Menu from './components/Menu'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingCart from './components/FloatingCart'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import AdminDashboard from './pages/AdminDashboard'

function HomePage() {
  return (
    <>
      <Hero />
      <Menu />
      <About />
      <Testimonials />
      <Contact />
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <div className="min-h-screen">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/tracking/:id" element={<OrderTracking />} />
                  <Route path="/dashboard" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
              <FloatingCart />
            </div>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}
