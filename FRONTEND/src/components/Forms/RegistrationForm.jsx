import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useSecurity } from '../../contexts/SecurityContext'
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'

const RegistrationForm = () => {
    const { register } = useAuth()
    const { sanitizeInput, validateInput, validatePasswordStrength, errorMessages } = useSecurity()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        full_name: '',
        id_number: '',
        account_number: '',
        username: '',
        password: '',
        confirm_password: ''
    })

    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        const sanitizedValue = sanitizeInput(value)

        setFormData(prev => ({
            ...prev,
            [name]: sanitizedValue
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }

        // Validate password strength in real-time
        if (name === 'password') {
            setPasswordStrength(validatePasswordStrength(sanitizedValue))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        // Validate fields (excluding confirm_password initially)
        Object.keys(formData).forEach(field => {
            if (field !== 'confirm_password' && !validateInput(formData[field], field)) {
                newErrors[field] = errorMessages[field]
            }
        })

        const currentPasswordStrength = validatePasswordStrength(formData.password)

        if (formData.password && !currentPasswordStrength.isStrong) {
            newErrors.password = currentPasswordStrength.feedback
        }

        if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match.'
        }

        setPasswordStrength(currentPasswordStrength)
        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        const result = await register(formData)

        if (result.success) {
            navigate('/login', {
                state: {
                    message: 'Registration successful! Please login to continue.'
                }
            })
        } else {
            setErrors({ submit: result.message })
        }

        setIsSubmitting(false)
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Customer Account</h2>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Full Name */}
                    <div style={styles.formGroup}>
                        <label htmlFor="full_name" style={styles.label}>Full Name *</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                ...(errors.full_name && styles.inputError)
                            }}
                            required
                            maxLength={100}
                        />
                        {errors.full_name && <span style={styles.error}>{errors.full_name}</span>}
                    </div>

                     {/* ID Number */}
                    <div style={styles.formGroup}>
                        <label htmlFor="id_number" style={styles.label}>ID Number *</label>
                        <input
                            type="text"
                            id="id_number"
                            name="id_number"
                            value={formData.id_number}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                ...(errors.id_number && styles.inputError)
                            }}
                            inputMode="numeric"
                            pattern="\d*"
                            required
                            maxLength={13}
                        />
                        {errors.id_number && <span style={styles.error}>{errors.id_number}</span>}
                    </div>

                    {/* Account Number */}
                    <div style={styles.formGroup}>
                        <label htmlFor="account_number" style={styles.label}>Account Number *</label>
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
                            inputMode="numeric"
                            pattern="\d*"
                            required
                            maxLength={16}
                        />
                        {errors.account_number && <span style={styles.error}>{errors.account_number}</span>}
                    </div>

                    {/* Username */}
                    <div style={styles.formGroup}>
                        <label htmlFor="username" style={styles.label}>Username *</label>
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
                            maxLength={20}
                        />
                        {errors.username && <span style={styles.error}>{errors.username}</span>}
                    </div>

                    {/* Password */}
                    <div style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>Password *</label>
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

                        {formData.password && (
                            <div style={styles.passwordStrength}>
                                <div style={styles.strengthIndicator}>
                                    {passwordStrength.isStrong ? (
                                        <>
                                            <CheckCircle size={16} color="var(--success-color)" />
                                            <span style={styles.strengthText}>Strong password</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={16} color="var(--error-color)" />
                                            <span style={styles.strengthText}>
                                                {passwordStrength.feedback}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        {errors.password && <span style={styles.error}>{errors.password}</span>}
                    </div>

                    {/* Confirm Password */}
                    <div style={styles.formGroup}>
                        <label htmlFor="confirm_password" style={styles.label}>Confirm Password *</label>
                        <input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                ...(errors.confirm_password && styles.inputError)
                            }}
                            required
                        />
                        {errors.confirm_password && (
                            <span style={styles.error}>{errors.confirm_password}</span>
                        )}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div style={styles.submitError}>{errors.submit}</div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            ...styles.submitButton,
                            ...(isSubmitting && styles.submitButtonDisabled)
                        }}
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </form>

                {/* Login Link */}
                <div style={styles.loginLink}>
                    <span>Already have an account? </span>
                    <Link to="/login" style={styles.link}>Login here</Link>
                </div>
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
        maxWidth: '480px'
    },
    title: {
        textAlign: 'center',
        marginBottom: '32px',
        color: 'var(--text-primary)',
        fontSize: '28px',
        fontWeight: 'bold'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    formGroup: {
        marginBottom: '24px'
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
    passwordStrength: {
        marginTop: '8px'
    },
    strengthIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px'
    },
    strengthText: {
        fontSize: '14px'
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
        backgroundColor: '#007BFF',        // ✅ Changed button background color
        color: '#FFFFFF',                  // ✅ Changed button text color
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
    loginLink: {
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

export default RegistrationForm
