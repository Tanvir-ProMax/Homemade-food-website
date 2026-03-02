import { motion } from 'framer-motion'
// removed useCart import

const FOOD_EMOJI = ['🍛', '🥘', '🫕', '🍜', '🍲', '🥗', '🍱', '🫔']

export default function Hero() {
    // removed unused useCart call

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center overflow-hidden pt-20"
            style={{ background: 'linear-gradient(135deg, #fffbf5 0%, #fff7ed 50%, #fed7aa 100%)' }}
        >
            {/* Background blobs */}
            <div className="absolute top-20 right-[-100px] w-[450px] h-[450px] rounded-full bg-orange-200/40 blob" />
            <div className="absolute bottom-[-80px] left-[-60px] w-[320px] h-[320px] rounded-full bg-orange-100/50 blob" style={{ animationDelay: '3s' }} />
            <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] rounded-full bg-amber-100/40 blob" style={{ animationDelay: '1.5s' }} />

            {/* Floating food emojis */}
            {FOOD_EMOJI.map((em, i) => (
                <div
                    key={i}
                    className="absolute text-3xl opacity-20 float-animation select-none pointer-events-none"
                    style={{
                        top: `${10 + (i * 11)}%`,
                        left: `${5 + (i * 11)}%`,
                        animationDelay: `${i * 0.4}s`,
                        animationDuration: `${3 + (i % 3)}s`,
                    }}
                >
                    {em}
                </div>
            ))}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center py-16">
                {/* Text Content */}
                <div className="z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        Now Accepting Orders
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-800 leading-tight"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        Authentic{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                            Homemade
                        </span>{' '}
                        Taste Delivered to Your Door
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-5 text-lg text-stone-600 max-w-lg leading-relaxed"
                    >
                        Fresh, hygienic, and made with love — just like your mother used to make.
                        Every dish is handcrafted with the finest ingredients for that perfect home-cooked feel.
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap gap-6 mt-8"
                    >
                        {[
                            { val: '500+', label: 'Happy Customers' },
                            { val: '50+', label: 'Menu Items' },
                            { val: '4.9★', label: 'Average Rating' },
                        ].map(stat => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{stat.val}</div>
                                <div className="text-xs text-stone-500 font-medium mt-0.5">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap items-center gap-4 mt-8"
                    >
                        <a
                            href="#menu"
                            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-base shimmer-btn shadow-xl shadow-orange-300/40 hover:scale-105 hover:shadow-orange-400/50 transition-all duration-300"
                        >
                            <span>Order Now</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                        <a
                            href="#about"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-orange-300 text-orange-600 font-bold text-base hover:bg-orange-50 hover:border-orange-400 transition-all duration-300"
                        >
                            Our Story
                        </a>
                    </motion.div>
                </div>

                {/* Hero Image / Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hidden lg:flex justify-center items-center z-10"
                >
                    <div className="relative">
                        {/* Main card */}
                        <div className="relative w-80 h-80 rounded-[3rem] overflow-hidden shadow-2xl shadow-orange-300/50 float-animation">
                            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-8xl mb-4">🍛</div>
                                    <p className="text-orange-700 font-semibold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        Today's Special
                                    </p>
                                    <p className="text-orange-500 font-medium mt-1">Chicken Biryani</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating badges */}
                        <motion.div
                            animate={{ y: [-5, 5, -5] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                            className="absolute -top-6 -right-6 glass-card rounded-2xl px-4 py-3 shadow-xl"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">⭐</span>
                                <div>
                                    <div className="text-sm font-bold text-stone-800">4.9 Rating</div>
                                    <div className="text-xs text-stone-500">500+ reviews</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [5, -5, 5] }}
                            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                            className="absolute -bottom-6 -left-6 glass-card rounded-2xl px-4 py-3 shadow-xl"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🚀</span>
                                <div>
                                    <div className="text-sm font-bold text-stone-800">Fast Delivery</div>
                                    <div className="text-xs text-stone-500">30-45 min</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Wave bottom */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="white" fillOpacity="0.5" />
                </svg>
            </div>
        </section>
    )
}
