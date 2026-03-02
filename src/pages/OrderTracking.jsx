import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiPackage, FiTruck, FiHome, FiMapPin, FiClock } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const trackSteps = [
    { id: 1, label: 'Order Confirmed', icon: FiCheckCircle, desc: 'We have received your order.' },
    { id: 2, label: 'Preparing', icon: FiPackage, desc: 'Your food is being freshly prepared.' },
    { id: 3, label: 'On the Way', icon: FiTruck, desc: 'Out for delivery.' },
    { id: 4, label: 'Delivered', icon: FiHome, desc: 'Enjoy your meal!' },
]

export default function OrderTracking() {
    const { id } = useParams()
    const { user } = useAuth()

    // Fetch order data from API
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [currentStep, setCurrentStep] = useState(1)

    // Fetch order details
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/${id}`)
                if (!response.ok) {
                    throw new Error('Order not found')
                }
                const data = await response.json()
                setOrder(data)
                
                // Set current step based on order status
                const statusToStep = {
                    'Pending': 1,
                    'Preparing': 2,
                    'On the Way': 3,
                    'Delivered': 4,
                    'Cancelled': 0
                }
                setCurrentStep(statusToStep[data.status] || 1)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [id])

    // Simulate tracking updates for demo (remove in production)
    useEffect(() => {
        if (order && order.status === 'Pending') {
            const timers = [
                setTimeout(() => {
                    setOrder(prev => ({ ...prev, status: 'Preparing' }))
                    setCurrentStep(2)
                }, 3000),
                setTimeout(() => {
                    setOrder(prev => ({ ...prev, status: 'On the Way' }))
                    setCurrentStep(3)
                }, 8000),
            ]
            return () => timers.forEach(clearTimeout)
        }
    }, [order])

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-20 bg-[#fafaf9] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-stone-600">Loading order details...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen pt-24 pb-20 bg-[#fafaf9] flex items-center justify-center p-4">
                <div className="text-center bg-white rounded-3xl p-10 shadow-xl shadow-red-100/50 border border-red-100">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <FiPackage size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-800 mb-2">Order Not Found</h2>
                    <p className="text-stone-500 mb-6">{error}</p>
                    <Link to="/" className="inline-block px-6 py-3 bg-orange-500 text-white rounded-full font-bold">
                        Return Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#fafaf9] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-orange-100/50 p-6 md:p-10 border border-orange-50 relative overflow-hidden">

                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.5 }}
                            className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500"
                        >
                            <FiPackage size={28} />
                        </motion.div>
                        <h1 className="text-3xl font-extrabold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Track Your Order
                        </h1>
                        <p className="text-stone-500 mt-2 font-medium">Order ID: <span className="text-orange-600 font-bold">{id}</span></p>
                    </div>

                    {/* Delivery Info Card */}
                    <div className="bg-stone-50 rounded-2xl p-5 mb-10 border border-stone-100 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-2 bg-white rounded-full text-stone-400 shadow-sm">
                                <FiMapPin size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">Delivering to</p>
                                <p className="text-sm font-semibold text-stone-800 mt-0.5">{user?.name || 'Guest User'}</p>
                                <p className="text-xs text-stone-500 mt-0.5">Your Saved Address</p>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-stone-200 hidden md:block" />
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-2 bg-white rounded-full text-orange-400 shadow-sm">
                                <FiClock size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-orange-400 uppercase tracking-wide">Est. Delivery Time</p>
                                <p className="text-sm font-semibold text-stone-800 mt-0.5">35 - 45 Minutes</p>
                            </div>
                        </div>
                    </div>

                    {/* Tracking Pipeline */}
                    <div className="relative py-4 pl-4 md:pl-0">
                        {/* Vertical Line on mobile, Horizontal on desktop - handled via flex */}
                        <div className="flex flex-col md:flex-row justify-between relative">

                            {/* Desktop Connecting Line */}
                            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-1 bg-stone-100 rounded-full z-0">
                                <motion.div
                                    className="h-full bg-orange-500 rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${(currentStep - 1) * 33.33}%` }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                />
                            </div>

                            {/* Mobile Connecting Line */}
                            <div className="md:hidden absolute top-[28px] bottom-[28px] left-[27px] w-1 bg-stone-100 rounded-full z-0">
                                <motion.div
                                    className="w-full bg-orange-500 rounded-full"
                                    initial={{ height: '0%' }}
                                    animate={{ height: `${(currentStep - 1) * 33.33}%` }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                />
                            </div>

                            {trackSteps.map((step, index) => {
                                const isCompleted = currentStep >= step.id
                                const isCurrent = currentStep === step.id
                                const Icon = step.icon

                                return (
                                    <div key={step.id} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2 mb-8 md:mb-0 w-full md:w-1/4">
                                        {/* Circle */}
                                        <div
                                            className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-4 transition-colors duration-500 ${isCompleted
                                                    ? 'bg-orange-500 border-white text-white shadow-md shadow-orange-200'
                                                    : 'bg-white border-stone-100 text-stone-300'
                                                }`}
                                        >
                                            <Icon size={20} />

                                            {/* Pulse effect for current step */}
                                            {isCurrent && (
                                                <div className="absolute inset-0 rounded-full border-2 border-orange-500 animate-ping opacity-20" />
                                            )}
                                        </div>

                                        {/* Text */}
                                        <div className="md:text-center mt-1">
                                            <p className={`text-sm font-bold ${isCompleted ? 'text-stone-800' : 'text-stone-400'}`}>
                                                {step.label}
                                            </p>
                                            <p className="text-xs text-stone-500 mt-1 hidden md:block px-2">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/#menu"
                            className="px-6 py-3 rounded-full border-2 border-orange-100 text-orange-600 font-bold text-sm text-center hover:bg-orange-50 transition-colors"
                        >
                            Order More Food
                        </Link>
                        <Link
                            to="/"
                            className="px-6 py-3 rounded-full bg-stone-800 text-white font-bold text-sm text-center hover:bg-stone-700 transition-colors shadow-lg shadow-stone-200"
                        >
                            Return Home
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}
