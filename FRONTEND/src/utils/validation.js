// Input validation patterns
export const validationPatterns = {
  name: /^[a-zA-Z\s]{2,100}$/,
  idNumber: /^[A-Z0-9]{8,20}$/,
  accountNumber: /^[0-9]{10,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  amount: /^\d+(\.\d{1,2})?$/,
  swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  beneficiaryName: /^[a-zA-Z\s]{2,100}$/
};

export const validateInput = (type, value) => {
  const pattern = validationPatterns[type];
  if (!pattern) return true;

  return pattern.test(value);
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  // Remove potential XSS vectors
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.length < 8) return accountNumber;
  return `****${accountNumber.slice(-4)}`;
};

export const maskIdNumber = (idNumber) => {
  if (!idNumber || idNumber.length < 6) return idNumber;
  return `${idNumber.slice(0, 3)}***${idNumber.slice(-3)}`;
};