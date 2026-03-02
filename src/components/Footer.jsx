const footerLinks = {
    'Quick Links': [
        { label: 'Home', href: '#home' },
        { label: 'Menu', href: '#menu' },
        { label: 'About Us', href: '#about' },
        { label: 'Testimonials', href: '#testimonials' },
        { label: 'Contact', href: '#contact' },
    ],
    'Our Menu': [
        { label: 'Rice & Biryani', href: '#menu' },
        { label: 'Curries', href: '#menu' },
        { label: 'Snacks', href: '#menu' },
        { label: 'Desserts', href: '#menu' },
        { label: 'Drinks', href: '#menu' },
    ],
    'Contact': [
        { label: '+880 1700-000000', href: 'tel:+8801700000000' },
        { label: 'maria@homefood.com', href: 'mailto:maria@homefood.com' },
        { label: 'Dhaka, Bangladesh', href: '#' },
        { label: 'Daily: 10 AM – 9 PM', href: '#' },
    ],
}

export default function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-base">M</span>
                            </div>
                            <div>
                                <span className="block text-white font-bold text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>Homemade Food</span>
                                <span className="block text-orange-400 text-xs -mt-0.5">by Maria</span>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-stone-400 mb-5">
                            Authentic homemade food delivered fresh to your doorstep. Made with love using traditional recipes.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { label: 'Facebook', icon: 'f', href: '#' },
                                { label: 'Instagram', icon: '📷', href: '#' },
                                { label: 'WhatsApp', icon: '💬', href: '#' },
                            ].map(s => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="w-9 h-9 rounded-full bg-stone-800 hover:bg-orange-500 flex items-center justify-center text-sm transition-colors duration-200"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h4>
                            <ul className="space-y-2.5">
                                {links.map(link => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-stone-400 hover:text-orange-400 text-sm transition-colors duration-200">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-stone-500 text-xs">
                        © {new Date().getFullYear()} Homemade Food by Maria. All rights reserved.
                    </p>
                    <p className="text-stone-500 text-xs flex items-center gap-1">
                        Made with <span className="text-red-400">❤️</span> in Dhaka, Bangladesh
                    </p>
                </div>
            </div>
        </footer>
    )
}
