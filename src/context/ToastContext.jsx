/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react'
 
import { AnimatePresence, motion } from 'framer-motion'

const ToastContext = createContext()

let toastId = 0

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback(({ message, image, price }) => {
        const id = ++toastId
        setToasts(prev => [...prev, { id, message, image, price }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3000)
    }, [])

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {/* Toast container */}
            <div className="fixed bottom-24 right-4 z-[100] flex flex-col gap-3 items-end pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 40, scale: 0.85 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                            className="pointer-events-auto flex items-center gap-3 bg-white rounded-2xl shadow-2xl shadow-orange-200/60 border border-orange-100 pr-5 pl-2 py-2 min-w-[260px]"
                        >
                            {/* Food image thumbnail */}
                            {toast.image && (
                                <img
                                    src={toast.image}
                                    alt=""
                                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                />
                            )}

                            {/* Check icon bubble */}
                            {!toast.image && (
                                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <p className="text-stone-800 font-semibold text-sm leading-tight">{toast.message}</p>
                                {toast.price && (
                                    <p className="text-orange-500 text-xs font-medium mt-0.5">৳{toast.price} added to cart</p>
                                )}
                            </div>

                            {/* Dismiss */}
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-stone-400 hover:text-stone-600 flex-shrink-0 ml-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Progress bar */}
                            <motion.div
                                className="absolute bottom-0 left-0 h-0.5 bg-orange-400 rounded-full"
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: 3, ease: 'linear' }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => useContext(ToastContext)
