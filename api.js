import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' }
})

// Add token automatically
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
            console.log('[API] Sending token:', token)
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Handle 401 globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('[API] Unauthorized - logging out')
            localStorage.removeItem('token')
            localStorage.removeItem('userType')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export const authService = {
    async login(credentials, userType) {
        const endpoint = userType === 'employee' ? '/employee/login' : '/customer/login'
        const response = await apiClient.post(endpoint, credentials)
        return response.data
    },

    async register(userData) {
        const response = await apiClient.post('/customer/register', userData)
        return response.data
    },

    async logout() {
        const userType = localStorage.getItem('userType')
        const endpoint = userType === 'employee' ? '/employee/logout' : '/customer/logout'
        return await apiClient.post(endpoint)
    },

    async verifyToken() {
        const userType = localStorage.getItem('userType')
        const endpoint = userType === 'employee' ? '/employee/profile' : '/customer/profile'
        const response = await apiClient.get(endpoint)
        return response.data
    },

    async getProfile() {
        const userType = localStorage.getItem('userType')
        const endpoint = userType === 'employee' ? '/employee/profile' : '/customer/profile'
        const response = await apiClient.get(endpoint)
        return response.data
    }
}

export const paymentService = {
    async createPayment(paymentData) {
        const response = await apiClient.post('/customer/payment', paymentData)
        return response.data
    },

    async getTransactions(filters = {}) {
        const response = await apiClient.get('/customer/transactions', { params: filters })
        return response.data
    },

    async getTransactionById(id) {
        const response = await apiClient.get(`/customer/transactions/${id}`)
        return response.data
    },

    async updateTransactionStatus(id, status) {
        const response = await apiClient.patch(`/employee/transactions/${id}/status`, { status })
        return response.data
    },

    async submitToSwift(id) {
        const response = await apiClient.post(`/employee/transactions/${id}/submit-to-swift`)
        return response.data
    }
}

export default apiClient
