import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartDrawer from './CartDrawer'

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Menu', href: '#menu' },
    { label: 'About', href: '#about' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const { totalItems, setIsCartOpen } = useCart()
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)

    // Helper to determine link destinations
    const getHref = (hash) => location.pathname === '/' ? hash : `/${hash}`

    const handleLogout = () => {
        logout()
        setProfileOpen(false)
        navigate('/')
    }

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/80 backdrop-blur-lg shadow-lg shadow-orange-100'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                            <span className="text-white font-bold text-base">M</span>
                        </div>
                        <div className="leading-tight">
                            <span className="block text-orange-600 font-bold text-sm md:text-base" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Homemade Food
                            </span>
                            <span className="block text-orange-400 text-xs font-medium -mt-0.5">by Maria</span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <ul className="hidden md:flex items-center gap-7">
                        {navLinks.map(link => (
                            <li key={link.label}>
                                <a
                                    href={getHref(link.href)}
                                    className="text-stone-700 hover:text-orange-500 font-medium text-sm transition-colors duration-200 relative group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange-500 rounded-full group-hover:w-full transition-all duration-300" />
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-3">
                        {/* Cart Button */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2.5 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors duration-200"
                            aria-label="Open cart"
                        >
                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {totalItems > 0 && (
                                <motion.span
                                    key={totalItems}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center w-5 h-5"
                                >
                                    {totalItems}
                                </motion.span>
                            )}
                        </button>

                        {/* Auth / Profile CTA (desktop) */}
                        <div className="hidden md:block relative">
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-sm font-semibold hover:bg-orange-100 transition-colors"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                                            {user.avatar ? <img src={user.avatar} alt="" /> : <FiUser size={14} className="text-orange-600" />}
                                        </div>
                                        <span>{user.name.split(' ')[0]}</span>
                                    </button>

                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-orange-100 border border-orange-50 overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-orange-50 bg-stone-50">
                                                    <p className="text-sm font-bold text-stone-800">{user.name}</p>
                                                    <p className="text-xs text-stone-500 truncate">{user.email}</p>
                                                </div>
                                                <div className="p-1.5">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                                                    >
                                                        <FiLogOut size={16} /> Logout
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-semibold shimmer-btn shadow-md hover:scale-105 transition-transform duration-200"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden p-2 text-stone-700"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden bg-white/95 backdrop-blur-md border-t border-orange-100 overflow-hidden"
                        >
                            <ul className="px-6 py-4 flex flex-col gap-4">
                                {navLinks.map(link => (
                                    <li key={link.label}>
                                        <a
                                            href={getHref(link.href)}
                                            onClick={() => setMobileOpen(false)}
                                            className="text-stone-700 hover:text-orange-500 font-medium text-base transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                                {user ? (
                                    <button
                                        onClick={handleLogout}
                                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-red-600 bg-red-50 text-sm font-semibold shadow-sm mt-2"
                                    >
                                        <FiLogOut /> Logout ({user.name})
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold shimmer-btn shadow-md mt-2"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <CartDrawer />
        </>
    )
}
