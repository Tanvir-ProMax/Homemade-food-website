import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

// Helper to interact with localStorage
const setToken = (token) => localStorage.setItem('maria_auth_token', token)
const getToken = () => localStorage.getItem('maria_auth_token')
const removeToken = () => localStorage.removeItem('maria_auth_token')

// Base api instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 30000, // 30 second timeout for Render cold starts
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to attach JWT
api.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Set loading to false immediately on mount
    useEffect(() => {
        setLoading(false)
    }, [])

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password })
            // Assuming backend returns { token: '...', user: {...} }
            if (data.token) setToken(data.token)
            setUser({
                name: data.name || name,
                email: email,
                isAdmin: data.isAdmin || false,
            })
            return { success: true }
        } catch (error) {
            console.error('Registration error:', error)
            // Handle different error scenarios
            if (error.code === 'ECONNABORTED') {
                return {
                    success: false,
                    message: 'Server is starting up. Please try again in a few seconds.'
                }
            }
            if (error.response) {
                // Server responded with error
                return {
                    success: false,
                    message: error.response.data?.message || 'Registration failed'
                }
            }
            if (error.request) {
                // Request was made but no response received
                return {
                    success: false,
                    message: 'No response from server. Please check your connection.'
                }
            }
            // Other errors
            return {
                success: false,
                message: error.message || 'Registration failed. Please try again.'
            }
        }
    }

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password })
            if (data.token) setToken(data.token)
            setUser({
                name: data.name || 'Foodie',
                email: email,
                isAdmin: data.isAdmin || false,
            })
            return { success: true }
        } catch (error) {
            console.error('Login error:', error)
            // Handle different error scenarios
            if (error.code === 'ECONNABORTED') {
                return {
                    success: false,
                    message: 'Server is starting up. Please try again in a few seconds.'
                }
            }
            if (error.response) {
                // Server responded with error
                return {
                    success: false,
                    message: error.response.data?.message || 'Invalid email or password'
                }
            }
            if (error.request) {
                // Request was made but no response received
                return {
                    success: false,
                    message: 'No response from server. Please check your connection.'
                }
            }
            // Other errors
            return {
                success: false,
                message: error.message || 'Login failed. Please try again.'
            }
        }
    }

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password })
            if (data.token) setToken(data.token)
            setUser({
                name: data.name || 'Foodie',
                email: email,
                isAdmin: data.isAdmin || false,
            })
            return { success: true }
        } catch (error) {
            console.error('Login error:', error)
            // Handle different error scenarios
            if (error.code === 'ECONNABORTED') {
                return {
                    success: false,
                    message: 'Server is starting up. Please try again in a few seconds.'
                }
            }
            if (error.response) {
                // Server responded with error
                return {
                    success: false,
                    message: error.response.data?.message || 'Invalid email or password'
                }
            }
            if (error.request) {
                // Request was made but no response received
                return {
                    success: false,
                    message: 'No response from server. Please check your connection.'
                }
            }
            // Other errors
            return {
                success: false,
                message: error.message || 'Login failed. Please try again.'
            }
        }
    }

    const logout = () => {
        removeToken()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, api }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
