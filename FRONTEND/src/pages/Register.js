import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateField, sanitizeInput, checkPasswordStrength } from '../utils/validation';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        id_number: '',
        account_number: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = sanitizeInput(value);

        setFormData(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Check password strength in real-time
        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(sanitizedValue));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const fields = ['full_name', 'id_number', 'account_number', 'username', 'password'];

        fields.forEach(field => {
            const validation = validateField(formData[field], field);
            if (!validation.isValid) {
                newErrors[field] = validation.error;
            }
        });

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!passwordStrength.isStrong) {
            newErrors.password = 'Password is not strong enough';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const { confirmPassword, ...submitData } = formData;

        const result = await register(submitData);

        if (result.success) {
            navigate('/login', {
                state: { message: 'Registration successful! Please login.' }
            });
        } else {
            setErrors({ submit: result.error });
        }

        setIsSubmitting(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>

                {errors.submit && <div className="error-message">{errors.submit}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="full_name">Full Name</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className={errors.full_name ? 'error' : ''}
                            required
                        />
                        {errors.full_name && <span className="field-error">{errors.full_name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="id_number">ID Number</label>
                        <input
                            type="text"
                            id="id_number"
                            name="id_number"
                            value={formData.id_number}
                            onChange={handleChange}
                            className={errors.id_number ? 'error' : ''}
                            maxLength="13"
                            required
                        />
                        {errors.id_number && <span className="field-error">{errors.id_number}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="account_number">Account Number</label>
                        <input
                            type="text"
                            id="account_number"
                            name="account_number"
                            value={formData.account_number}
                            onChange={handleChange}
                            className={errors.account_number ? 'error' : ''}
                            maxLength="12"
                            required
                        />
                        {errors.account_number && <span className="field-error">{errors.account_number}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={errors.username ? 'error' : ''}
                            required
                        />
                        {errors.username && <span className="field-error">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            required
                        />
                        {errors.password && <span className="field-error">{errors.password}</span>}

                        {formData.password && (
                            <div className="password-strength">
                                <div className="strength-meter">
                                    <div
                                        className={`strength-bar ${passwordStrength.score >= 4 ? 'strong' : passwordStrength.score >= 3 ? 'medium' : 'weak'}`}
                                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="strength-feedback">
                                    {passwordStrength.feedback.map((msg, index) => (
                                        <div key={index} className="feedback-item">{msg}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'error' : ''}
                            required
                        />
                        {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="auth-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;