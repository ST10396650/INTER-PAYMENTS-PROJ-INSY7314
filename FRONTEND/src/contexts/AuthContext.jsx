import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Auto-login if token exists
    useEffect(() => {
        if (token) {
            verifyToken()
        }
    }, [token])

    const verifyToken = useCallback(async () => {
        try {
            setLoading(true)
            const userData = await authService.verifyToken(token)
            setUser(userData)
        } catch (error) {
            console.error('Token verification failed:', error)
            logout()
        } finally {
            setLoading(false)
        }
    }, [token])

    const login = useCallback(async (loginData, userType) => {
        try {
            setLoading(true)
            setError('')

            const response = await authService.login(loginData, userType)
            const { token: newToken, data } = response

            setToken(newToken)
            setUser(data)
            localStorage.setItem('token', newToken)
            localStorage.setItem('userType', userType)

            return { success: true }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed'
            setError(message)
            return { success: false, message }
        } finally {
            setLoading(false)
        }
    }, [])

    const register = useCallback(async (userData) => {
        try {
            setLoading(true)
            setError('')

            const response = await authService.register(userData)
            return { success: true, data: response.data }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed'
            setError(message)
            return { success: false, message }
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        setToken(null)
        setError('')
        localStorage.removeItem('token')
        localStorage.removeItem('userType')

        // Call logout API
        authService.logout().catch(console.error)
    }, [])

    const value = {
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        userType: user?.userType || localStorage.getItem('userType')
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}