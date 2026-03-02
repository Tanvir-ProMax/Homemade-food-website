import { motion } from 'framer-motion'

const features = [
    { icon: '🌿', title: 'Fresh Ingredients', desc: 'We source only the freshest, locally grown vegetables and premium quality meat every single day.' },
    { icon: '🧼', title: 'Hygienically Prepared', desc: 'Our kitchen maintains the highest standards of cleanliness and food safety at all times.' },
    { icon: '❤️', title: 'Made With Love', desc: 'Every dish is crafted with passion, following time-honored family recipes passed down generations.' },
    { icon: '🚀', title: 'Fast Delivery', desc: 'Hot, fresh food delivered right to your doorstep within 30–45 minutes of ordering.' },
]

export default function About() {
    return (
        <section id="about" className="py-20" style={{ background: 'linear-gradient(180deg, #fff7ed 0%, #fffbf5 100%)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative"
                    >
                        {/* Main blob card */}
                        <div className="relative w-full max-w-md mx-auto">
                            <div className="aspect-square rounded-[40%_60%_60%_40%_/_40%_40%_60%_60%] bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center shadow-2xl shadow-orange-200/60 overflow-hidden">
                                <div className="text-center p-10">
                                    <div className="text-7xl mb-4">👩‍🍳</div>
                                    <h3 className="text-2xl font-bold text-orange-700" style={{ fontFamily: 'Playfair Display, serif' }}>Hi, I'm Maria!</h3>
                                    <p className="text-stone-600 mt-2 text-sm leading-relaxed">
                                        Cooking authentic homemade food with 15+ years of passion and tradition.
                                    </p>
                                </div>
                            </div>

                            {/* Floating stat cards */}
                            <motion.div
                                animate={{ y: [-6, 6, -6] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute top-4 -right-4 glass-card rounded-2xl px-4 py-3 shadow-lg"
                            >
                                <div className="text-2xl font-bold text-orange-600">15+</div>
                                <div className="text-xs text-stone-500 font-medium">Years of Cooking</div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [6, -6, 6] }}
                                transition={{ repeat: Infinity, duration: 3.5 }}
                                className="absolute bottom-4 -left-4 glass-card rounded-2xl px-4 py-3 shadow-lg"
                            >
                                <div className="text-2xl font-bold text-orange-600">100%</div>
                                <div className="text-xs text-stone-500 font-medium">Natural & Fresh</div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-4">
                            Our Story
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-800 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Cooking from the Heart,{' '}
                            <span className="text-orange-500">Serving with Soul</span>
                        </h2>
                        <p className="mt-4 text-stone-600 leading-relaxed">
                            Homemade Food by Maria started as a small dream — bringing the warmth of
                            home-cooked meals to families who crave authentic flavors. Using recipes
                            inherited from my grandmother, every dish is a celebration of Bangladeshi
                            culinary heritage.
                        </p>
                        <p className="mt-3 text-stone-600 leading-relaxed">
                            No preservatives, no shortcuts — just pure, wholesome food made the traditional way.
                        </p>

                        {/* Feature cards */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {features.map((f, i) => (
                                <motion.div
                                    key={f.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    whileHover={{ y: -3 }}
                                    className="glass-card rounded-2xl p-4"
                                >
                                    <div className="text-2xl mb-2">{f.icon}</div>
                                    <div className="font-bold text-stone-800 text-sm">{f.title}</div>
                                    <div className="text-stone-500 text-xs mt-1 leading-relaxed">{f.desc}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
