import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

export default function FloatingCart() {
    const { totalItems, setIsCartOpen } = useCart()

    return (
        <AnimatePresence>
            {totalItems > 0 && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-8 right-6 z-40 w-14 h-14 rounded-full shimmer-btn shadow-2xl shadow-orange-400/50 flex items-center justify-center relative"
                    aria-label="Open cart"
                >
                    {/* Pulse ring */}
                    <span className="absolute inset-0 rounded-full bg-orange-400 opacity-30 animate-ping" />

                    <svg className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>

                    <motion.span
                        key={totalItems}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs font-extrabold rounded-full w-5 h-5 flex items-center justify-center border-2 border-orange-400 z-20"
                    >
                        {totalItems}
                    </motion.span>
                </motion.button>
            )}
        </AnimatePresence>
    )
}
