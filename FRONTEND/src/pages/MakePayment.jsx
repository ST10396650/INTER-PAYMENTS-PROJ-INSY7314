import React, { useState } from 'react';

export default function MakePayment() {
  // State to hold form input values
  const [form, setForm] = useState({
    amount: '',
    currency: 'USD',
    provider: 'SWIFT',
    beneficiary_account_number: '',
    beneficiary_name: '',
    swift_code: '',
    bank_name: '',
    bank_address: '',
    bank_country: ''
  });

  // State to hold validation errors for each field and the other hold success message after successful submission
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Regex patterns matching backend validation rules
  const regex = {
    amount: /^\d+(\.\d{1,2})?$/, // Amount can have max 2 decimal places
    accountNumber: /^[A-Z0-9]{8,34}$/, // Account number: uppercase letters & numbers, 8–34 chars
    beneficiaryName: /^[a-zA-Z\s\-']{2,100}$/, // Beneficiary name: letters, spaces, hyphen, apostrophe
    swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/ // SWIFT code format
  };

  // Handle input changes and update form state
  const handleChange = (e) => {
    // Automatically convert input values to uppercase where applicable
    setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
  };

  // Validate form inputs against regex and required fields
  const validate = () => {
    const newErrors = {};

    if (!regex.amount.test(form.amount)) newErrors.amount = 'Invalid amount (max 2 decimals)';
    if (!regex.accountNumber.test(form.beneficiary_account_number)) newErrors.beneficiary_account_number = 'Invalid account number';
    if (!regex.beneficiaryName.test(form.beneficiary_name)) newErrors.beneficiary_name = 'Invalid beneficiary name';
    if (!regex.swiftCode.test(form.swift_code)) newErrors.swift_code = 'Invalid SWIFT code';
    if (!form.bank_name) newErrors.bank_name = 'Bank name is required';
    if (!form.bank_country) newErrors.bank_country = 'Bank country is required';

    // Update errors state
    setErrors(newErrors);
    // Return true if no errors, false otherwise
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setSuccess(''); // Reset previous success messages

    if (!validate()) return; // Stop if validation fails

    try {
      // Send form data to backend API (Note I used a dummy directory (was for the morkApi)
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        // If successful, show success message and reset form
        setSuccess('Payment submitted successfully!');
        setForm({
          amount: '',
          currency: 'USD',
          provider: 'SWIFT',
          beneficiary_account_number: '',
          beneficiary_name: '',
          swift_code: '',
          bank_name: '',
          bank_address: '',
          bank_country: ''
        });
      } else {
        // If API returns error, show error message
        const data = await response.json();
        setErrors({ submit: data.message || 'Payment failed' });
      }
    } catch (err) {
      // This is to handle network or unexpected errors
      setErrors({ submit: err.message });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Make a Payment</h2>

      {/* Display success message */}
      {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{success}</div>}
      {/* Display submission error message */}
      {errors.submit && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{errors.submit}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        {/* Amount input */}
        <div>
          <label className="block font-semibold">Amount</label>
          <input
            type="text"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="100.00"
          />
          {errors.amount && <p className="text-red-600 text-sm">{errors.amount}</p>}
        </div>

        {/* Currency selection */}
        <div>
          <label className="block font-semibold">Currency</label>
          <select name="currency" value={form.currency} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            {['USD','EUR','GBP','AUD','JPY','CNY','CAD'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Provider selection */}
        <div>
          <label className="block font-semibold">Provider</label>
          <select name="provider" value={form.provider} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option value="SWIFT">SWIFT</option>
          </select>
        </div>

        {/* Beneficiary Name input */}
        <div>
          <label className="block font-semibold">Beneficiary Name</label>
          <input type="text" name="beneficiary_name" value={form.beneficiary_name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          {errors.beneficiary_name && <p className="text-red-600 text-sm">{errors.beneficiary_name}</p>}
        </div>

        {/* Beneficiary Account Number input */}
        <div>
          <label className="block font-semibold">Beneficiary Account Number</label>
          <input type="text" name="beneficiary_account_number" value={form.beneficiary_account_number} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          {errors.beneficiary_account_number && <p className="text-red-600 text-sm">{errors.beneficiary_account_number}</p>}
        </div>

        {/* SWIFT Code input */}
        <div>
          <label className="block font-semibold">SWIFT Code</label>
          <input type="text" name="swift_code" value={form.swift_code} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          {errors.swift_code && <p className="text-red-600 text-sm">{errors.swift_code}</p>}
        </div>

        {/* Bank Name input */}
        <div>
          <label className="block font-semibold">Bank Name</label>
          <input type="text" name="bank_name" value={form.bank_name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          {errors.bank_name && <p className="text-red-600 text-sm">{errors.bank_name}</p>}
        </div>

        {/* Bank Address input */}
        <div>
          <label className="block font-semibold">Bank Address</label>
          <input type="text" name="bank_address" value={form.bank_address} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        {/* Bank Country input */}
        <div>
          <label className="block font-semibold">Bank Country</label>
          <input type="text" name="bank_country" value={form.bank_country} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          {errors.bank_country && <p className="text-red-600 text-sm">{errors.bank_country}</p>}
        </div>

        {/* Submit button */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Pay Now</button>
      </form>
    </div>
  );
}
