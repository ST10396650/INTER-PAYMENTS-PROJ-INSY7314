// Same patterns as backend for consistency
export const patterns = {
    fullName: /^[a-zA-Z\s\-']{2,100}$/,
    idNumber: /^\d{13}$/,
    accountNumber: /^\d{10,12}$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    amount: /^\d+(\.\d{1,2})?$/,
    currency: /^(USD|EUR|GBP|JPY|CNY|AUD|CAD)$/,
    swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
    beneficiaryAccount: /^[A-Z0-9]{8,34}$/,
    beneficiaryName: /^[a-zA-Z\s\-']{2,100}$/,
};

export const validateField = (value, field) => {
    if (!value || typeof value !== 'string') {
        return { isValid: false, error: `${field} is required` };
    }

    const pattern = patterns[field];
    if (!pattern) {
        return { isValid: false, error: `No validation pattern for ${field}` };
    }

    const isValid = pattern.test(value.trim());
    return {
        isValid,
        error: isValid ? null : `Invalid ${field} format`
    };
};

export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    return input
        .trim()
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
};

export const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&#]/.test(password)) score++;

    if (password.length < 8) feedback.push('Password must be at least 8 characters');
    if (!/[a-z]/.test(password)) feedback.push('Include at least one lowercase letter');
    if (!/[A-Z]/.test(password)) feedback.push('Include at least one uppercase letter');
    if (!/\d/.test(password)) feedback.push('Include at least one number');
    if (!/[@$!%*?&#]/.test(password)) feedback.push('Include at least one special character (@$!%*?&#)');

    return {
        isStrong: score >= 5,
        score,
        feedback
    };
};