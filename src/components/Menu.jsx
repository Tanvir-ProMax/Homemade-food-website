import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiX, FiShoppingCart } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

// ─── Data ────────────────────────────────────────────────────────────────────
const categories = ['All', 'Rice', 'Chicken', 'Beef', 'Snacks', 'Desserts']

const tagMeta = {
    'Bestseller': { bg: 'bg-orange-500', text: 'text-white' },
    'Special': { bg: 'bg-amber-400', text: 'text-white' },
    'Chef Pick': { bg: 'bg-red-500', text: 'text-white' },
}

// ─── StarRating sub-component ─────────────────────────────────────────────────
function StarRating({ rating, reviews }) {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
                {Array(5).fill(0).map((_, i) => {
                    const filled = i < full
                    const isHalf = !filled && i === full && half
                    return (
                        <svg
                            key={i}
                            className={`w-3.5 h-3.5 ${filled || isHalf ? 'text-amber-400' : 'text-stone-200'}`}
                            fill={filled ? 'currentColor' : isHalf ? 'url(#half)' : 'currentColor'}
                            viewBox="0 0 24 24"
                        >
                            {isHalf && (
                                <defs>
                                    <linearGradient id="half">
                                        <stop offset="50%" stopColor="#fbbf24" />
                                        <stop offset="50%" stopColor="#e5e7eb" />
                                    </linearGradient>
                                </defs>
                            )}
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    )
                })}
            </div>
            <span className="text-xs font-semibold text-stone-600">{rating}</span>
            <span className="text-xs text-stone-400">({reviews})</span>
        </div>
    )
}

// ─── FoodCard sub-component ───────────────────────────────────────────────────
function FoodCard({ item, index }) {
    const { addToCart } = useCart()
    const { addToast } = useToast()
    const [added, setAdded] = useState(false)

    const handleAdd = () => {
        addToCart({ ...item, id: item._id || item.id })
        addToast({ message: `${item.name} added!`, image: item.image, price: item.price })
        setAdded(true)
        setTimeout(() => setAdded(false), 1400)
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, delay: index * 0.045 }}
            whileHover={{ y: -6 }}
            className="group bg-white rounded-3xl overflow-hidden shadow-md shadow-orange-100/60 border border-orange-50 hover:shadow-xl hover:shadow-orange-200/50 hover:border-orange-200 transition-all duration-300 flex flex-col"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 flex-shrink-0">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Tag badge */}
                {item.tag && tagMeta[item.tag] && (
                    <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${tagMeta[item.tag].bg} ${tagMeta[item.tag].text} shadow-md`}>
                        {item.tag}
                    </span>
                )}

                {/* Price pill on image */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow">
                    <span className="text-orange-600 font-extrabold text-sm">৳{item.price}</span>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1">
                {/* Rating */}
                <StarRating rating={item.rating} reviews={item.reviews} />

                <h3 className="font-bold text-stone-800 text-base mt-2 leading-snug">{item.name}</h3>
                <p className="text-stone-500 text-xs mt-1.5 leading-relaxed line-clamp-2 flex-1">{item.description || item.desc}</p>

                {/* Add to cart button */}
                <motion.button
                    onClick={handleAdd}
                    whileTap={{ scale: 0.95 }}
                    className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${added
                        ? 'bg-green-500 text-white'
                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-300/40'
                        }`}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {added ? (
                            <motion.span
                                key="added"
                                initial={{ y: -18, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 18, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                Added!
                            </motion.span>
                        ) : (
                            <motion.span
                                key="add"
                                initial={{ y: 18, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -18, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-1.5"
                            >
                                <FiShoppingCart size={15} />
                                Add to Cart
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.div>
    )
}

// ─── Main Menu Component ──────────────────────────────────────────────────────
export default function Menu() {
    const [activeCategory, setActiveCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [menuItems, setMenuItems] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`)
                if (response.ok) {
                    const data = await response.json()
                    setMenuItems(data)
                }
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const filtered = useMemo(() => {
        let items = menuItems
        if (activeCategory !== 'All') {
            items = items.filter(i => i.category === activeCategory)
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            items = items.filter(
                i => i.name.toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
            )
        }
        return items
    }, [activeCategory, searchQuery, menuItems])

    return (
        <section id="menu" className="py-20" style={{ background: '#fafaf9' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-4">
                        Our Menu
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl font-extrabold text-stone-800"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        Made Fresh, Every Single Day
                    </h2>
                    <p className="mt-3 text-stone-500 max-w-xl mx-auto text-sm">
                        Every dish is handcrafted with love using traditional family recipes.
                    </p>
                </motion.div>

                {/* Search + Filters Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
                    {/* Search */}
                    <div className="relative w-full sm:max-w-xs">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white border border-orange-100 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                            >
                                <FiX size={14} />
                            </button>
                        )}
                    </div>

                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                        {categories.map(cat => (
                            <motion.button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                whileTap={{ scale: 0.96 }}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeCategory === cat
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-300/40 scale-105'
                                    : 'bg-white text-stone-600 border border-orange-100 hover:bg-orange-50 hover:border-orange-300 shadow-sm'
                                    }`}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Results info */}
                <motion.p
                    layout
                    className="text-xs text-stone-400 font-medium mb-5 pl-1"
                >
                    {loading
                        ? 'Loading menu...'
                        : filtered.length === 0
                            ? 'No dishes found'
                            : `Showing ${filtered.length} dish${filtered.length !== 1 ? 'es' : ''}${activeCategory !== 'All' ? ` in "${activeCategory}"` : ''}${searchQuery ? ` matching "${searchQuery}"` : ''}`}
                </motion.p>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : (
                    /* Food Grid */
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filtered.length > 0 ? (
                                filtered.map((item, index) => (
                                    <FoodCard key={item._id || item.id} item={item} index={index} />
                                ))
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                                >
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-lg font-bold text-stone-700">No dishes found</h3>
                                    <p className="text-stone-400 text-sm mt-1">Try a different search term or category</p>
                                    <button
                                        onClick={() => { setSearchQuery(''); setActiveCategory('All') }}
                                        className="mt-4 px-5 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
                                    >
                                        Clear filters
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
