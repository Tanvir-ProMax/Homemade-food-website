import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiTag, FiCheck, FiTruck, FiChevronRight } from 'react-icons/fi'
import { useCart } from '../context/CartContext'

/* ── Empty State ─────────────────────────────────────────────────────────── */
function EmptyCart({ onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6 text-center"
        >
            <div className="relative mb-5">
                <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center">
                    <FiShoppingBag size={40} className="text-orange-300" />
                </div>
                <motion.div
                    animate={{ rotate: [0, 15, -10, 15, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.6 }}
                    className="absolute top-0 right-0 text-2xl"
                >
                    🛒
                </motion.div>
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                Your cart is empty!
            </h3>
            <p className="text-stone-500 text-sm mb-6">
                Add some delicious homemade food to get started.
            </p>
            <button
                onClick={onClose}
                className="px-7 py-2.5 rounded-full shimmer-btn text-white text-sm font-bold shadow-lg hover:scale-105 transition-transform"
            >
                Browse Menu
            </button>
            <p className="text-xs text-stone-400 mt-4">
                Free delivery hint: Not available yet 😄
            </p>
        </motion.div>
    )
}

/* ── Cart Item Row ───────────────────────────────────────────────────────── */
function CartItemRow({ item, onRemove, onInc, onDec }) {
    const [removing, setRemoving] = useState(false)

    const handleRemove = () => {
        setRemoving(true)
        setTimeout(() => onRemove(item.id), 280)
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: removing ? 0 : 1, x: removing ? 60 : 0 }}
            transition={{ duration: 0.25 }}
            className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm border border-orange-50"
        >
            {/* Food image */}
            <div className="relative flex-shrink-0">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                />
                {/* qty bubble on image */}
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                    {item.qty}
                </span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-1">
                    <h4 className="font-semibold text-stone-800 text-sm leading-tight truncate pr-1">{item.name}</h4>
                    <button
                        onClick={handleRemove}
                        className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-red-50 flex items-center justify-center text-stone-300 hover:text-red-500 transition-colors duration-200"
                        aria-label="Remove"
                    >
                        <FiTrash2 size={12} />
                    </button>
                </div>

                <div className="flex items-center justify-between mt-1">
                    {/* Price */}
                    <span className="text-orange-600 font-extrabold text-sm">৳{item.price * item.qty}</span>

                    {/* Qty controls */}
                    <div className="flex items-center gap-1.5 bg-orange-50 rounded-full px-1 py-0.5">
                        <button
                            onClick={() => onDec(item.id, -1)}
                            className="w-6 h-6 rounded-full hover:bg-orange-200 flex items-center justify-center transition-colors"
                            aria-label="Decrease"
                        >
                            <FiMinus size={11} className="text-orange-700" />
                        </button>
                        <span className="text-sm font-bold text-stone-800 w-5 text-center">{item.qty}</span>
                        <button
                            onClick={() => onInc(item.id, 1)}
                            className="w-6 h-6 rounded-full hover:bg-orange-200 flex items-center justify-center transition-colors"
                            aria-label="Increase"
                        >
                            <FiPlus size={11} className="text-orange-700" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

/* ── Coupon Input ────────────────────────────────────────────────────────── */
function CouponInput() {
    const { couponCode, setCouponCode, appliedCoupon, applyCoupon, removeCoupon, couponError } = useCart()
    const [shake, setShake] = useState(false)

    const handleApply = () => {
        const success = applyCoupon(couponCode)
        if (!success) {
            setShake(true)
            setTimeout(() => setShake(false), 500)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleApply()
    }

    return (
        <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                <FiTag size={12} /> Coupon Code
            </label>

            {appliedCoupon ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5"
                >
                    <FiCheck size={16} className="text-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <span className="text-green-700 font-bold text-sm">{appliedCoupon.code}</span>
                        <span className="text-green-600 text-xs ml-1.5">– {appliedCoupon.label} applied!</span>
                    </div>
                    <button
                        onClick={removeCoupon}
                        className="text-green-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                        <FiX size={14} />
                    </button>
                </motion.div>
            ) : (
                <div className="space-y-1.5">
                    <motion.div
                        animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="flex gap-2"
                    >
                        <input
                            type="text"
                            value={couponCode}
                            onChange={e => setCouponCode(e.target.value.toUpperCase())}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. MARIA20"
                            maxLength={12}
                            className={`flex-1 px-3 py-2.5 rounded-xl text-sm border bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 transition-all ${couponError ? 'border-red-300 focus:ring-red-300' : 'border-orange-100 focus:ring-orange-400'
                                }`}
                        />
                        <button
                            onClick={handleApply}
                            className="px-4 py-2.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold text-sm transition-colors whitespace-nowrap"
                        >
                            Apply
                        </button>
                    </motion.div>
                    {couponError && (
                        <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs pl-1"
                        >
                            {couponError}
                        </motion.p>
                    )}
                    <p className="text-stone-400 text-xs pl-1">
                        Try: <button onClick={() => setCouponCode('MARIA20')} className="underline hover:text-orange-500">MARIA20</button>,{' '}
                        <button onClick={() => setCouponCode('SAVE50')} className="underline hover:text-orange-500">SAVE50</button>,{' '}
                        <button onClick={() => setCouponCode('WELCOME')} className="underline hover:text-orange-500">WELCOME</button>
                    </p>
                </div>
            )}
        </div>
    )
}

/* ── Price Row helper ────────────────────────────────────────────────────── */
function PriceRow({ label, value, highlight, discount, large }) {
    return (
        <div className={`flex justify-between items-center ${large ? 'py-1' : ''}`}>
            <span className={`${large ? 'font-bold text-stone-800 text-base' : 'text-stone-500 text-sm'}`}>{label}</span>
            <span className={`font-bold ${large ? 'text-xl text-orange-600' : discount ? 'text-green-600' : highlight ? 'text-stone-700' : 'text-stone-700'} text-sm`}>
                {discount && value > 0 ? `−` : ''}{value > 0 || discount ? `৳${value}` : 'FREE'}
            </span>
        </div>
    )
}

/* ── Main CartDrawer ─────────────────────────────────────────────────────── */
export default function CartDrawer() {
    const {
        cartItems, isCartOpen, setIsCartOpen,
        removeFromCart, updateQty, clearCart,
        subtotal, discount, delivery, grandTotal, totalItems,
    } = useCart()
    const navigate = useNavigate()

    const handleCheckout = () => {
        setIsCartOpen(false)
        navigate('/checkout')
    }

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* ── Backdrop ── */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* ── Sidebar Panel ── */}
                    <motion.aside
                        key="sidebar"
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
                        className="fixed right-0 top-0 h-full w-full max-w-[400px] z-50 flex flex-col"
                        style={{ background: '#fffbf5' }}
                    >
                        {/* ── Header ── */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-orange-100 bg-white/80 backdrop-blur-md flex-shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center">
                                    <FiShoppingBag className="text-orange-500" size={18} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-stone-800 text-base leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        Your Cart
                                    </h2>
                                    <p className="text-xs text-stone-400">
                                        {totalItems === 0 ? 'No items' : `${totalItems} item${totalItems !== 1 ? 's' : ''}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {cartItems.length > 0 && (
                                    <button
                                        onClick={clearCart}
                                        className="px-3 py-1.5 text-xs font-semibold text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                                    >
                                        Clear
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-8 h-8 rounded-full hover:bg-orange-100 flex items-center justify-center text-stone-500 hover:text-stone-700 transition-colors"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        </div>

                        {/* ── Delivery Banner ── */}
                        {cartItems.length > 0 && (
                            <div className="flex items-center gap-2 px-5 py-2.5 bg-orange-50 border-b border-orange-100 flex-shrink-0">
                                <FiTruck size={14} className="text-orange-500 flex-shrink-0" />
                                <p className="text-xs text-orange-700 font-medium">
                                    Delivery charge: <strong>৳60</strong> — Estimated arrival: <strong>30–45 min</strong>
                                </p>
                            </div>
                        )}

                        {/* ── Items List ── */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                            {cartItems.length === 0 ? (
                                <EmptyCart onClose={() => setIsCartOpen(false)} />
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {cartItems.map(item => (
                                        <CartItemRow
                                            key={item.id}
                                            item={item}
                                            onRemove={removeFromCart}
                                            onInc={updateQty}
                                            onDec={updateQty}
                                        />
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* ── Footer: coupon + totals + checkout ── */}
                        {cartItems.length > 0 && (
                            <div className="flex-shrink-0 border-t border-orange-100 bg-white/90 backdrop-blur-sm px-5 pt-4 pb-5 space-y-4">
                                {/* Coupon */}
                                <CouponInput />

                                {/* Divider */}
                                <div className="border-t border-dashed border-orange-100" />

                                {/* Price breakdown */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-500 text-sm">Subtotal</span>
                                        <span className="font-semibold text-stone-700 text-sm">৳{subtotal}</span>
                                    </div>

                                    {discount > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="flex justify-between items-center"
                                        >
                                            <span className="text-green-600 text-sm font-medium">Coupon Discount</span>
                                            <span className="font-bold text-green-600 text-sm">−৳{discount}</span>
                                        </motion.div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-500 text-sm flex items-center gap-1">
                                            <FiTruck size={12} /> Delivery
                                        </span>
                                        <span className="font-semibold text-stone-700 text-sm">৳{delivery}</span>
                                    </div>

                                    {/* Grand total */}
                                    <div className="flex justify-between items-center pt-2 border-t border-orange-100">
                                        <span className="font-extrabold text-stone-800 text-base">Grand Total</span>
                                        <motion.span
                                            key={grandTotal}
                                            initial={{ scale: 1.2, color: '#f97316' }}
                                            animate={{ scale: 1, color: '#ea580c' }}
                                            transition={{ duration: 0.3 }}
                                            className="font-extrabold text-xl text-orange-600"
                                        >
                                            ৳{grandTotal}
                                        </motion.span>
                                    </div>
                                </div>

                                {/* Checkout button */}
                                <motion.button
                                    onClick={handleCheckout}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg shimmer-btn text-white shadow-orange-300/40 hover:scale-[1.02]"
                                >
                                    Confirm Order · ৳{grandTotal}
                                    <FiChevronRight size={18} />
                                </motion.button>

                                <p className="text-center text-stone-400 text-xs">
                                    🔒 Secure checkout — Cash on delivery
                                </p>
                            </div>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}
