import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function MakePayment() {
    const { token } = useAuth();
    const navigate = useNavigate();

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

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');

    const regex = {
        amount: /^\d+(\.\d{1,2})?$/,
        accountNumber: /^[A-Z0-9]{8,34}$/,
        beneficiaryName: /^[a-zA-Z\s\-']{2,100}$/,
        swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!regex.amount.test(form.amount)) newErrors.amount = 'Invalid amount (max 2 decimals)';
        if (!regex.accountNumber.test(form.beneficiary_account_number)) newErrors.beneficiary_account_number = 'Invalid account number';
        if (!regex.beneficiaryName.test(form.beneficiary_name)) newErrors.beneficiary_name = 'Invalid beneficiary name';
        if (!regex.swiftCode.test(form.swift_code)) newErrors.swift_code = 'Invalid SWIFT code';
        if (!form.bank_name) newErrors.bank_name = 'Bank name is required';
        if (!form.bank_country) newErrors.bank_country = 'Bank country is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        if (!validate()) return;

        try {
            if (!token) {
                setErrors({ submit: 'No authentication token found. Please login again.' });
                return;
            }

            // Replace the fetch call with:
            const response = await api.post('/customer/payment', form);

             if (response.data) {
             setSuccess('Payment submitted successfully!');
             // Reset form...
             setTimeout(() => {
             navigate('/dashboard');
             }, 1000);
            }
             else {
                const data = await response.json();
                setErrors({ submit: data.message || 'Payment failed' });
            }
        } catch (err) {
            setErrors({ submit: err.message });
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Make a Payment</h2>

            {success && <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-center font-medium">{success}</div>}
            {errors.submit && <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-center font-medium">{errors.submit}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount & Currency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Amount *</label>
                        <input
                            type="text"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder="100.00"
                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Currency *</label>
                        <select
                            name="currency"
                            value={form.currency}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            {['USD', 'EUR', 'GBP', 'AUD', 'JPY', 'CNY', 'CAD'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Provider */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Provider *</label>
                    <select
                        name="provider"
                        value={form.provider}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="SWIFT">SWIFT</option>
                    </select>
                </div>

                {/* Beneficiary Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Beneficiary Name *</label>
                        <input
                            type="text"
                            name="beneficiary_name"
                            value={form.beneficiary_name}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.beneficiary_name ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.beneficiary_name && <p className="text-red-600 text-sm mt-1">{errors.beneficiary_name}</p>}
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Account Number *</label>
                        <input
                            type="text"
                            name="beneficiary_account_number"
                            value={form.beneficiary_account_number}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.beneficiary_account_number ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.beneficiary_account_number && <p className="text-red-600 text-sm mt-1">{errors.beneficiary_account_number}</p>}
                    </div>
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">SWIFT Code *</label>
                    <input
                        type="text"
                        name="swift_code"
                        value={form.swift_code}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.swift_code ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.swift_code && <p className="text-red-600 text-sm mt-1">{errors.swift_code}</p>}
                </div>

                {/* Bank Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Bank Name *</label>
                        <input
                            type="text"
                            name="bank_name"
                            value={form.bank_name}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.bank_name ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.bank_name && <p className="text-red-600 text-sm mt-1">{errors.bank_name}</p>}
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Bank Country *</label>
                        <input
                            type="text"
                            name="bank_country"
                            value={form.bank_country}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.bank_country ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.bank_country && <p className="text-red-600 text-sm mt-1">{errors.bank_country}</p>}
                    </div>
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Bank Address</label>
                    <input
                        type="text"
                        name="bank_address"
                        value={form.bank_address}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-4 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    Pay Now
                </button>
            </form>
        </div>
    );
}