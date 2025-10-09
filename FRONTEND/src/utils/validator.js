import validator from 'validator'

const validatorUtils = {
  // Validate email
  isEmail: (email) => {
    return validator.isEmail(email)
  },

  // Validate strong password (customize as needed)
  isStrongPassword: (password) => {
    return validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  },

  // Validate phone number (basic international)
  isMobilePhone: (phone, locale = 'any') => {
    return validator.isMobilePhone(phone, locale)
  },

  // Validate alphanumeric usernames
  isValidUsername: (username) => {
    return validator.isAlphanumeric(username.replace(/_/g, '')) &&
      username.length >= 3 &&
      username.length <= 20
  },

  // Validate currency code (ISO 4217)
  isCurrencyCode: (code) => {
    return /^[A-Z]{3}$/.test(code)
  },

  // Validate amount with up to two decimal places
  isValidAmount: (amount) => {
    return /^\d+(\.\d{1,2})?$/.test(amount)
  },

  // Sanitize input to prevent XSS
  sanitize: (input) => {
    if (typeof input !== 'string') return input
    return validator.escape(input.trim())
  },

  // Check if string is empty after trimming
  isEmpty: (str) => {
    return validator.isEmpty(str.trim())
  },

  // Validate SWIFT/BIC Code (basic format)
  isSwiftCode: (code) => {
    return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(code)
  }
}

export default validatorUtils
