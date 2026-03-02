import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

// Helper to interact with localStorage
const setToken = (token) => localStorage.setItem('maria_auth_token', token)
const getToken = () => localStorage.getItem('maria_auth_token')
const removeToken = () => localStorage.removeItem('maria_auth_token')

// Base api instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust base URL as needed based on backend
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

    // On mount, check if token exists. In a real app we'd verify the token with /api/auth/me
    // For now, if token exists, we just mock a user to be "logged in" visually
    useEffect(() => {
        const token = getToken()
        if (token) {
            // Decode JWT or fetch user profile
            setUser({ name: 'Foodie', email: 'user@example.com' })
        }
        setLoading(false)
    }, [])

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password })
            // Assuming backend returns { token: '...', user: {...} }
            if (data.token) setToken(data.token)
            setUser(data.user || { name, email })
            return { success: true }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed.'
            }
        }
    }

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password })
            if (data.token) setToken(data.token)
            setUser(data.user || { name: 'Foodie', email })
            return { success: true }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Invalid email or password.'
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
