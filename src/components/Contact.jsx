import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from 'react-icons/fi'
const contactInfo = [
    { icon: FiPhone, label: 'Phone', value: '+880 1407-781117' },
    { icon: FiMail, label: 'Email', value: 'maria@homefood.com', href: 'mailto:maria@homefood.com' },
    { icon: FiMapPin, label: 'Area', value: 'Dhaka, Bangladesh', href: '#' },
    { icon: FiClock, label: 'Hours', value: 'Daily: 10 AM – 9 PM', href: '#' },
];

export default function Contact() {
    const [form, setForm] = useState({ name: '', phone: '', address: '', order: '' })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    const handleSubmit = e => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
        setForm({ name: '', phone: '', address: '', order: '' })
    }

    return (
        <section id="contact" className="py-20" style={{ background: 'linear-gradient(180deg, #fff7ed 0%, #fffbf5 100%)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-4">
                        Order Now
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Place Your Order Today
                    </h2>
                    <p className="mt-3 text-stone-500 max-w-xl mx-auto">
                        Fill in the form below or reach out directly. We'll confirm your order shortly!
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {contactInfo.map((item) => (
                                <motion.a
                                    key={item.label}
                                    href={item.href}
                                    whileHover={{ y: -4 }}
                                    className="glass-card rounded-2xl p-4 block hover:shadow-orange-200/60 transition-shadow"
                                >
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                                        <item.icon className="text-orange-600" size={18} />
                                    </div>
                                    <div className="text-xs text-stone-500 font-medium mb-0.5">{item.label}</div>
                                    <div className="text-sm font-semibold text-stone-800">{item.value}</div>
                                </motion.a>
                            ))}
                        </div>

                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/qr/35YR2H6WT5HUO1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 w-full p-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors duration-200 shadow-lg shadow-green-300/40 group"
                        >
                            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Order via WhatsApp
                            <svg className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </motion.div>

                    {/* Order Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass-card rounded-3xl p-8"
                    >
                        <h3 className="text-xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Quick Order Form</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {[
                                { name: 'name', placeholder: 'Your Full Name', type: 'text', required: true },
                                { name: 'phone', placeholder: 'Phone Number', type: 'tel', required: true },
                                { name: 'address', placeholder: 'Delivery Address', type: 'text', required: true },
                            ].map(field => (
                                <input
                                    key={field.name}
                                    type={field.type}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/70 border border-orange-100 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                />
                            ))}
                            <textarea
                                name="order"
                                placeholder="What would you like to order? (e.g., 2x Chicken Biryani, 1x Dal Tadka)"
                                required
                                rows={4}
                                value={form.order}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/70 border border-orange-100 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-none"
                            />
                            <motion.button
                                type="submit"
                                whileTap={{ scale: 0.97 }}
                                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-base transition-all duration-300 ${submitted
                                    ? 'bg-green-500 text-white'
                                    : 'shimmer-btn text-white shadow-lg shadow-orange-300/40 hover:scale-[1.02]'
                                    }`}
                            >
                                {submitted ? (
                                    <>✓ Order Sent! We'll call you soon</>
                                ) : (
                                    <>
                                        <FiSend size={16} />
                                        Place Order
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
