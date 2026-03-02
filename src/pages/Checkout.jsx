import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMapPin, FiPhone, FiUser, FiFileText, FiCheckCircle, FiArrowRight, FiShield, FiCreditCard } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Checkout() {
    const { cartItems, subtotal, discount, delivery, grandTotal, clearCart } = useCart()
    const { user, api } = useAuth()
    const { addToast } = useToast()
    const navigate = useNavigate()

    // Form State
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        address: '',
        note: '',
        paymentMethod: 'cod', // 'cod' or 'bkash'
    })

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errors, setErrors] = useState({})

    // If cart is empty, user shouldn't be here (ideally we redirect early, but for now just show empty message)
    if (cartItems.length === 0 && !success) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-[#fafaf9]">
                <h2 className="text-2xl font-bold text-stone-800 mb-4">Your cart is empty</h2>
                <button onClick={() => navigate('/#menu')} className="px-6 py-2 bg-orange-500 text-white rounded-full font-bold">
                    Browse Menu
                </button>
            </div>
        )
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error for that field
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = 'Name is required'
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
        if (!formData.address.trim()) newErrors.address = 'Delivery address is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault()
        if (!validate()) {
            addToast({ message: 'Please fill in required fields.' })
            return
        }

        setLoading(true)

        // Construct order payload
        const orderData = {
            ...formData,
            items: cartItems,
            subtotal,
            discount,
            deliveryCharge: delivery,
            grandTotal,
            status: 'Pending',
        }

        try {
            // API call to real backend
            console.log("Submitting order data:", orderData)
            const response = await api.post('/orders', orderData)
            const savedOrder = response.data

            // Success animation & redirect sequence
            setLoading(false)
            setSuccess(true)

            setTimeout(() => {
                clearCart()
                // Navigate to tracking with the real MongoDB Object ID
                navigate(`/tracking/${savedOrder._id}`, { replace: true })
            }, 2500)

        } catch (error) {
            console.error('Order API Error:', error.response?.data || error.message)
            addToast({ message: error.response?.data?.message || 'Failed to place order. Please try again.' })
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#fafaf9]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Secure Checkout
                    </h1>
                    <p className="text-stone-500 text-sm mt-1">Provide your details to complete the order.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left: Form */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-50 relative overflow-hidden">

                            {/* Success Overlay */}
                            <AnimatePresence>
                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center px-6"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', bounce: 0.5 }}
                                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-500"
                                        >
                                            <FiCheckCircle size={40} />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>Order Confirmed!</h2>
                                        <p className="text-stone-500 mt-2">Thank you for ordering. Redirecting to tracking...</p>

                                        {/* Progress bar */}
                                        <div className="w-48 h-1.5 bg-stone-100 rounded-full mt-6 overflow-hidden">
                                            <motion.div
                                                className="h-full bg-green-500"
                                                initial={{ width: '0%' }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 2.5, ease: 'linear' }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <h2 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">1</span>
                                Delivery Details
                            </h2>

                            <form className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5 ml-1">Full Name *</label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Maria Rahman"
                                            className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-sm ${errors.name ? 'border-red-300' : 'border-stone-200'}`}
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5 ml-1">Phone Number *</label>
                                    <div className="relative">
                                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+880 17XX XXXXXX"
                                            className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-sm ${errors.phone ? 'border-red-300' : 'border-stone-200'}`}
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5 ml-1">Delivery Address *</label>
                                    <div className="relative">
                                        <FiMapPin className="absolute left-4 top-3 text-stone-400" size={16} />
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="House, Road, Block, Area..."
                                            rows={3}
                                            className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-sm resize-none ${errors.address ? 'border-red-300' : 'border-stone-200'}`}
                                        />
                                    </div>
                                    {errors.address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.address}</p>}
                                </div>

                                {/* Optional Note */}
                                <div>
                                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5 ml-1">Order Note (Optional)</label>
                                    <div className="relative">
                                        <FiFileText className="absolute left-4 top-3 text-stone-400" size={16} />
                                        <textarea
                                            name="note"
                                            value={formData.note}
                                            onChange={handleInputChange}
                                            placeholder="E.g. Less spicy, extra napkins..."
                                            rows={2}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-sm resize-none"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-50">
                            <h2 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">2</span>
                                Payment Method
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* COD Option */}
                                <label className={`relative flex items-start gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50/50' : 'border-stone-200 hover:border-orange-300'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={handleInputChange}
                                        className="mt-1 w-4 h-4 text-orange-500 focus:ring-orange-400"
                                    />
                                    <div>
                                        <span className="block text-sm font-bold text-stone-800">Cash on Delivery</span>
                                        <span className="block text-xs text-stone-500 mt-0.5">Pay in cash when food arrives</span>
                                    </div>
                                    {formData.paymentMethod === 'cod' && <FiCheckCircle className="absolute top-4 right-4 text-orange-500 w-5 h-5" />}
                                </label>

                                {/* bKash Option */}
                                <label className={`relative flex items-start gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50/50' : 'border-stone-200 hover:border-pink-300'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="bkash"
                                        checked={formData.paymentMethod === 'bkash'}
                                        onChange={handleInputChange}
                                        className="mt-1 w-4 h-4 text-pink-500 focus:ring-pink-400"
                                    />
                                    <div>
                                        <span className="block text-sm font-bold text-stone-800 flex items-center gap-1.5">
                                            bKash <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-md">Digital</span>
                                        </span>
                                        <span className="block text-xs text-stone-500 mt-0.5">Pay via bKash app</span>
                                    </div>
                                    {formData.paymentMethod === 'bkash' && <FiCheckCircle className="absolute top-4 right-4 text-pink-500 w-5 h-5" />}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary Summary */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-white rounded-3xl p-6 shadow-md border border-orange-100 sticky top-28">
                            <h2 className="text-lg font-bold text-stone-800 mb-4 pb-4 border-b border-orange-50" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Order Summary
                            </h2>

                            {/* Items List */}
                            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative">
                                            <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                            <span className="absolute -top-1.5 -right-1.5 bg-stone-800 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                                {item.qty}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-stone-800 truncate">{item.name}</p>
                                            <p className="text-orange-600 text-xs font-bold">৳{item.price * item.qty}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-2 mb-6 bg-stone-50 p-4 rounded-2xl">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-stone-500">Subtotal</span>
                                    <span className="font-semibold text-stone-700">৳{subtotal}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between items-center text-sm text-green-600">
                                        <span>Discount</span>
                                        <span className="font-bold">−৳{discount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-stone-500">Delivery Fee</span>
                                    <span className="font-semibold text-stone-700">৳{delivery}</span>
                                </div>

                                <div className="border-t border-stone-200 mt-2 pt-2 flex justify-between items-center">
                                    <span className="font-bold text-stone-800">Grand Total</span>
                                    <span className="font-extrabold text-xl text-orange-600">৳{grandTotal}</span>
                                </div>
                            </div>

                            {/* Note */}
                            <div className="flex text-xs text-stone-400 mb-6 items-center justify-center gap-1.5">
                                <FiShield /> 100% Secure Checkout
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                onClick={handlePlaceOrder}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading || success}
                                className="w-full py-4 rounded-xl text-white font-bold text-base hover:shadow-lg shimmer-btn shadow-orange-300/40 relative overflow-hidden group transition-all"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Place Order · ৳{grandTotal}
                                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </motion.button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
