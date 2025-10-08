

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    accountNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { user, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/customer/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateInput('name', formData.name)) {
      newErrors.name = 'Name must contain only letters and spaces (2-100 characters)';
    }

    if (!validateInput('idNumber', formData.idNumber)) {
      newErrors.idNumber = 'ID number must be 8-20 alphanumeric characters';
    }

    if (!validateInput('accountNumber', formData.accountNumber)) {
      newErrors.accountNumber = 'Account number must be 10-20 digits';
    }

    if (!validateInput('password', formData.password)) {
      newErrors.password = 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const result = await register({
      name: formData.name,
      idNumber: formData.idNumber,
      accountNumber: formData.accountNumber,
      password: formData.password
    });

    setLoading(false);

    if (result.success) {
      navigate('/customer/dashboard');
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              pattern="[a-zA-Z\s]{2,100}"
              title="Name must contain only letters and spaces (2-100 characters)"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>ID Number</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              required
              pattern="[A-Z0-9]{8,20}"
              title="ID number must be 8-20 alphanumeric characters"
            />
            {errors.idNumber && <span className="error">{errors.idNumber}</span>}
          </div>

          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              required
              pattern="[0-9]{10,20}"
              title="Account number must be 10-20 digits"
            />
            {errors.accountNumber && <span className="error">{errors.accountNumber}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
              title="Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>

          {errors.submit && <div className="error submit-error">{errors.submit}</div>}

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Creating Account...' : 'Register'}
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