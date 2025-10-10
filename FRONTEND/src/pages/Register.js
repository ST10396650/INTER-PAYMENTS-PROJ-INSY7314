import { useState, useEffect } from 'react'; // Import hooks for state and effect
import { useNavigate } from 'react-router-dom'; // Import to navigate between routes
import { useAuth } from './useAuth'; // Import custom hook for authentication

const Register = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    accountNumber: '',
    password: '',
    confirmPassword: ''
  });

  // State to hold error messages for form validation
  const [errors, setErrors] = useState({});
  
  // Loading state for submit button
  const [loading, setLoading] = useState(false);

  // Destructuring user data and register function from useAuth hook
  const { user, register } = useAuth();

  // useNavigate hook for redirecting users after successful registration
  const navigate = useNavigate();

  // Effect hook to redirect user to dashboard if they are already logged in
  useEffect(() => {
    if (user) {
      navigate('/customer/dashboard'); // Redirect to dashboard if user is logged in
    }
  }, [user, navigate]); // Dependency array to trigger effect on user or navigate change

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Sanitizing input values (implement this function as needed)
    const sanitizedValue = sanitizeInput(value);

    // Update form data state with the sanitized value
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue // Dynamically set form field value
    }));

    // If there's an existing error for the field, clear it
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '' // Remove field-specific error message
      }));
    }
  };

  // Form validation function
  const validateForm = () => {
    const newErrors = {}; // Object to store error messages for each field

    // Validate name (only letters and spaces, between 2 and 100 characters)
    if (!validateInput('name', formData.name)) {
      newErrors.name = 'Name must contain only letters and spaces (2-100 characters)';
    }

    // Validate ID number (8-20 alphanumeric characters)
    if (!validateInput('idNumber', formData.idNumber)) {
      newErrors.idNumber = 'ID number must be 8-20 alphanumeric characters';
    }

    // Validate account number (10-20 digits)
    if (!validateInput('accountNumber', formData.accountNumber)) {
      newErrors.accountNumber = 'Account number must be 10-20 digits';
    }

    // Validate password (minimum 8 characters, one uppercase, one lowercase, one number, one special character)
    if (!validateInput('password', formData.password)) {
      newErrors.password = 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character';
    }

    // Confirm password matches the password field
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors); // Update errors state
    return Object.keys(newErrors).length === 0; // If no errors, return true (valid form)
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    // If form validation fails, don't proceed
    if (!validateForm()) return;

    setLoading(true); // Set loading state to true while processing registration

    // Call register function from useAuth and pass form data
    const result = await register({
      name: formData.name,
      idNumber: formData.idNumber,
      accountNumber: formData.accountNumber,
      password: formData.password
    });

    setLoading(false); // Reset loading state after registration process

    // If registration is successful, navigate to dashboard
    if (result.success) {
      navigate('/customer/dashboard');
    } else {
      setErrors({ submit: result.error }); // Set error message if registration fails
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name Field */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              pattern="[a-zA-Z\s]{2,100}" // Pattern to validate name format
              title="Name must contain only letters and spaces (2-100 characters)" // Tooltip on invalid input
            />
            {errors.name && <span className="error">{errors.name}</span>} {/* Display error if name is invalid */}
          </div>

          {/* ID Number Field */}
          <div className="form-group">
            <label>ID Number</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              required
              pattern="[A-Z0-9]{8,20}" // Pattern to validate ID number format
              title="ID number must be 8-20 alphanumeric characters" // Tooltip on invalid input
            />
            {errors.idNumber && <span className="error">{errors.idNumber}</span>} {/* Display error if ID number is invalid */}
          </div>

          {/* Account Number Field */}
          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              required
              pattern="[0-9]{10,20}" // Pattern to validate account number format
              title="Account number must be 10-20 digits" // Tooltip on invalid input
            />
            {errors.accountNumber && <span className="error">{errors.accountNumber}</span>} {/* Display error if account number is invalid */}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$" // Pattern to validate password strength
              title="Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character" // Tooltip on invalid input
            />
            {errors.password && <span className="error">{errors.password}</span>} {/* Display error if password is invalid */}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>} {/* Display error if passwords don't match */}
          </div>

          {/* Submit Error */}
          {errors.submit && <div className="error submit-error">{errors.submit}</div>} {/* Display any submit error */}

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Creating Account...' : 'Register'} {/* Button text changes based on loading state */}
          </button>
        </form>

        {/* Login Link */}
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
