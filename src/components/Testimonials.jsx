import { motion } from 'framer-motion'

const testimonials = [
    {
        name: 'Fatima Rahman',
        role: 'Regular Customer',
        emoji: '👩',
        stars: 5,
        text: "Maria's biryani is simply unmatched! It tastes exactly like what my mom used to make. I order every weekend without fail.",
    },
    {
        name: 'Karim Hossain',
        role: 'Office Worker',
        emoji: '👨',
        stars: 5,
        text: 'Honestly the best homemade food delivery in town. The mutton kosha is absolutely divine. Fresh, hot, and on time every single order.',
    },
    {
        name: 'Nusrat Jahan',
        role: 'Food Blogger',
        emoji: '👩‍💻',
        stars: 5,
        text: "I've tried dozens of home chefs and Maria stands out above them all. The authenticity of flavors is remarkable. Highly recommended!",
    },
    {
        name: 'Arafat Ahmed',
        role: 'Family Man',
        emoji: '👨‍👩‍👧',
        stars: 5,
        text: 'My whole family loves ordering from here. The kids especially love the desserts — the shemai is a household favorite now!',
    },
    {
        name: 'Sadia Islam',
        role: 'Student',
        emoji: '👩‍🎓',
        stars: 5,
        text: 'As a student living away from home, Maria\'s food gives me that comfort I miss. Affordable, delicious, and always consistent.',
    },
    {
        name: 'Rashed Khan',
        role: 'Entrepreneur',
        emoji: '🧑‍💼',
        stars: 5,
        text: 'I order lunch from Homemade Food by Maria for my entire office team. Everyone loves it and it keeps us energized throughout the day.',
    },
]

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-semibold mb-4">
                        Testimonials
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                        What Our Customers Say
                    </h2>
                    <p className="mt-3 text-stone-500 max-w-xl mx-auto">
                        Join hundreds of happy families who enjoy Maria's homemade goodness every day.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="glass-card rounded-3xl p-6 flex flex-col gap-4"
                        >
                            {/* Stars */}
                            <div className="flex gap-1">
                                {Array(t.stars).fill(0).map((_, s) => (
                                    <span key={s} className="text-amber-400 text-lg">★</span>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-stone-600 text-sm leading-relaxed italic flex-1">"{t.text}"</p>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-2 border-t border-orange-100">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-xl">
                                    {t.emoji}
                                </div>
                                <div>
                                    <div className="font-bold text-stone-800 text-sm">{t.name}</div>
                                    <div className="text-xs text-stone-500">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-16 rounded-3xl p-10 text-center relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #f97316, #fb923c, #fbbf24)' }}
                >
                    <div className="absolute inset-0 opacity-10">
                        {['🍛', '🥘', '🍲', '🥗', '🍮'].map((e, i) => (
                            <span key={i} className="absolute text-5xl" style={{ top: `${15 + i * 15}%`, left: `${5 + i * 20}%` }}>{e}</span>
                        ))}
                    </div>
                    <h3 className="relative text-2xl sm:text-3xl font-extrabold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Ready to taste the difference?
                    </h3>
                    <p className="relative text-orange-100 mb-6 max-w-md mx-auto">
                        Order your first meal today and experience the warmth of authentic homemade cooking.
                    </p>
                    <a
                        href="#menu"
                        className="relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-orange-600 font-bold text-base hover:scale-105 transition-transform duration-200 shadow-xl"
                    >
                        Browse Menu
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
