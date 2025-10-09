import React, { useState } from 'react' 
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useSecurity } from '../../contexts/SecurityContext'
import { Eye, EyeOff, User, CreditCard } from 'lucide-react'

const LoginForm = () => {
    const { login } = useAuth()
    const { sanitizeInput, validateInput, errorMessages } = useSecurity()
    const navigate = useNavigate()
    const location = useLocation()

    const [formData, setFormData] = useState({
        username: '',
        account_number: '',
        password: '',
        userType: 'customer'
    })

    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const message = location.state?.message

    const handleChange = (e) => {
        const { name, value } = e.target
        const sanitizedValue = sanitizeInput(value)

        setFormData(prev => ({
            ...prev,
            [name]: sanitizedValue
        }))

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (formData.userType === 'customer') {
            if (!validateInput(formData.username, 'username')) {
                newErrors.username = errorMessages.username
            }
            if (!validateInput(formData.account_number, 'account_number')) {
                newErrors.account_number = errorMessages.account_number
            }
        } else {
            if (!formData.username) {
                newErrors.username = 'Username is required'
            }
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        const loginData = formData.userType === 'customer'
            ? formData
            : { username: formData.username, password: formData.password }

        const result = await login(loginData, formData.userType)

        if (result.success) {
            navigate(formData.userType === 'employee' ? '/employee/dashboard' : '/dashboard')
        } else {
            setErrors({ submit: result.message })
        }

        setIsSubmitting(false)
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Login to Portal</h2>

                {message && (
                    <div style={styles.successMessage}>
                        {message}
                    </div>
                )}

                <div style={styles.userTypeSelector}>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, userType: 'customer' }))}
                        style={{
                            ...styles.userTypeButton,
                            ...(formData.userType === 'customer' && styles.userTypeButtonActive)
                        }}
                    >
                        <User size={20} />
                        Customer
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, userType: 'employee' }))}
                        style={{
                            ...styles.userTypeButton,
                            ...(formData.userType === 'employee' && styles.userTypeButtonActive)
                        }}
                    >
                        <CreditCard size={20} />
                        Employee
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="username" style={styles.label}>
                            {formData.userType === 'employee' ? 'Username or Employee ID *' : 'Username *'}
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                ...(errors.username && styles.inputError)
                            }}
                            required
                        />
                        {errors.username && (
                            <span style={styles.error}>{errors.username}</span>
                        )}
                    </div>

                    {formData.userType === 'customer' && (
                        <div style={styles.formGroup}>
                            <label htmlFor="account_number" style={styles.label}>
                                Account Number *
                            </label>
                            <input
                                type="text"
                                id="account_number"
                                name="account_number"
                                value={formData.account_number}
                                onChange={handleChange}
                                style={{
                                    ...styles.input,
                                    ...(errors.account_number && styles.inputError)
                                }}
                                required
                            />
                            {errors.account_number && (
                                <span style={styles.error}>{errors.account_number}</span>
                            )}
                        </div>
                    )}

                    <div style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>
                            Password *
                        </label>
                        <div style={styles.passwordContainer}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                style={{
                                    ...styles.input,
                                    ...styles.passwordInput,
                                    ...(errors.password && styles.inputError)
                                }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.passwordToggle}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <span style={styles.error}>{errors.password}</span>
                        )}
                    </div>

                    {errors.submit && (
                        <div style={styles.submitError}>{errors.submit}</div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            ...styles.submitButton,
                            ...(isSubmitting && styles.submitButtonDisabled)
                        }}
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {formData.userType === 'customer' && (
                    <div style={styles.registerLink}>
                        <span>Don't have an account? </span>
                        <Link to="/register" style={styles.link}>Register here</Link>
                    </div>
                )}
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: '20px'
    },
    card: {
        background: 'var(--surface-color)',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '440px'
    },
    title: {
        textAlign: 'center',
        marginBottom: '32px',
        color: 'var(--text-primary)',
        fontSize: '28px',
        fontWeight: 'bold'
    },
    successMessage: {
        backgroundColor: 'rgba(56, 161, 105, 0.1)',
        color: 'var(--success-color)',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        textAlign: 'center'
    },
    userTypeSelector: {
        display: 'flex',
        gap: '12px',
        marginBottom: '24px'
    },
    userTypeButton: {
        flex: 1,
        padding: '12px',
        border: '2px solid var(--border-color)',
        borderRadius: '6px',
        background: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s'
    },
    userTypeButtonActive: {
        borderColor: 'var(--accent-color)',
        backgroundColor: 'rgba(49, 130, 206, 0.1)'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    formGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: 'var(--text-primary)'
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid var(--border-color)',
        borderRadius: '6px',
        fontSize: '16px',
        transition: 'border-color 0.3s'
    },
    inputError: {
        borderColor: 'var(--error-color)'
    },
    passwordContainer: {
        position: 'relative'
    },
    passwordInput: {
        paddingRight: '50px'
    },
    passwordToggle: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-secondary)'
    },
    error: {
        color: 'var(--error-color)',
        fontSize: '14px',
        marginTop: '4px',
        display: 'block'
    },
    submitError: {
        backgroundColor: 'rgba(229, 62, 62, 0.1)',
        color: 'var(--error-color)',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '16px',
        textAlign: 'center'
    },
    submitButton: {
        backgroundColor: '#28a745',  // Updated: green background
        color: '#fff',               // Updated: white text color
        padding: '14px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
    },
    submitButtonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed'
    },
    registerLink: {
        textAlign: 'center',
        marginTop: '24px',
        color: 'var(--text-secondary)'
    },
    link: {
        color: 'var(--accent-color)',
        textDecoration: 'none',
        fontWeight: '600'
    }
}

export default LoginForm
