import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext()

const DELIVERY_CHARGE = 60

const VALID_COUPONS = {
    MARIA20: { type: 'percent', value: 20, label: '20% off' },
    SAVE50: { type: 'flat', value: 50, label: '৳50 off' },
    WELCOME: { type: 'percent', value: 10, label: '10% off' },
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [couponError, setCouponError] = useState('')

    /* ── cart mutations ─────────────────────────────────── */
    const addToCart = useCallback((item) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id)
            if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
            return [...prev, { ...item, qty: 1 }]
        })
    }, [])

    const removeFromCart = useCallback((id) => {
        setCartItems(prev => prev.filter(i => i.id !== id))
    }, [])

    const updateQty = useCallback((id, delta) => {
        setCartItems(prev =>
            prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
        )
    }, [])

    const clearCart = useCallback(() => {
        setCartItems([])
        setAppliedCoupon(null)
        setCouponCode('')
        setCouponError('')
    }, [])

    /* ── coupon ─────────────────────────────────────────── */
    const applyCoupon = useCallback((code) => {
        const upper = code.trim().toUpperCase()
        const coupon = VALID_COUPONS[upper]
        if (!upper) {
            setCouponError('Enter a coupon code.')
            return false
        }
        if (!coupon) {
            setCouponError('Invalid coupon code.')
            setAppliedCoupon(null)
            return false
        }
        setAppliedCoupon({ code: upper, ...coupon })
        setCouponError('')
        return true
    }, [])

    const removeCoupon = useCallback(() => {
        setAppliedCoupon(null)
        setCouponCode('')
        setCouponError('')
    }, [])

    /* ── derived totals ─────────────────────────────────── */
    const totalItems = cartItems.reduce((s, i) => s + i.qty, 0)
    const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)

    let discount = 0
    if (appliedCoupon) {
        if (appliedCoupon.type === 'percent') discount = Math.round(subtotal * appliedCoupon.value / 100)
        else discount = Math.min(appliedCoupon.value, subtotal)
    }

    const delivery = subtotal > 0 ? DELIVERY_CHARGE : 0
    const grandTotal = Math.max(0, subtotal - discount + delivery)

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, removeFromCart, updateQty, clearCart,
            totalItems, subtotal, discount, delivery, grandTotal,
            isCartOpen, setIsCartOpen,
            couponCode, setCouponCode,
            appliedCoupon, applyCoupon, removeCoupon,
            couponError,
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
