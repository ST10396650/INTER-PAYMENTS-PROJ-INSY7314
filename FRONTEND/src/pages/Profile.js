import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { customerService } from '../services/api';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const { user } = useAuth();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await customerService.getProfile();
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const maskSensitiveData = (data) => {
        if (!data) return '';
        return '****' + data.slice(-4);
    };

    if (loading) {
        return <div className="loading">Loading profile...</div>;
    }

    if (!profile) {
        return <div className="error">Error loading profile</div>;
    }

    return (
        <div className="profile">
            <div className="profile-header">
                <h1>Your Profile</h1>
                <p>Manage your account information</p>
            </div>

            {message && <div className="success-message">{message}</div>}

            <div className="profile-card">
                <div className="profile-section">
                    <h3>Personal Information</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Full Name</label>
                            <div className="info-value">{profile.full_name}</div>
                        </div>
                        <div className="info-item">
                            <label>Username</label>
                            <div className="info-value">{profile.username}</div>
                        </div>
                        <div className="info-item">
                            <label>ID Number</label>
                            <div className="info-value sensitive">
                                {maskSensitiveData(profile.id_number)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <h3>Account Information</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Account Number</label>
                            <div className="info-value sensitive">
                                {maskSensitiveData(profile.account_number)}
                            </div>
                        </div>
                        <div className="info-item">
                            <label>Customer ID</label>
                            <div className="info-value">{profile.customer_id}</div>
                        </div>
                        <div className="info-item">
                            <label>Last Login</label>
                            <div className="info-value">
                                {profile.last_login
                                    ? new Date(profile.last_login).toLocaleString()
                                    : 'Never'
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <h3>Security</h3>
                    <div className="security-info">
                        <p>Your password is securely stored using bcrypt hashing with salt.</p>
                        <p>For security reasons, sensitive information is masked in the interface.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;