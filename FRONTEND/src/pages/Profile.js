import React from 'react';


const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <div className="info-value">{user.name}</div>
            </div>
            <div className="info-item">
              <label>ID Number</label>
              <div className="info-value">{maskIdNumber(user.idNumber)}</div>
            </div>
            <div className="info-item">
              <label>Account Number</label>
              <div className="info-value">{maskAccountNumber(user.accountNumber)}</div>
            </div>
            <div className="info-item">
              <label>Role</label>
              <div className="info-value capitalize">{user.role}</div>
            </div>
            <div className="info-item">
              <label>Account Status</label>
              <div className="info-value status-active">Active</div>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h2>Security Information</h2>
          <div className="security-info">
            <div className="security-item">
              <span className="security-label">Last Login</span>
              <span className="security-value">Recently</span>
            </div>
            <div className="security-item">
              <span className="security-label">Password</span>
              <span className="security-value">••••••••</span>
            </div>
            <div className="security-item">
              <span className="security-label">Two-Factor Auth</span>
              <span className="security-value status-inactive">Not enabled</span>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h2>Account Actions</h2>
          <div className="action-buttons">
            <button className="btn-secondary">Change Password</button>
            <button className="btn-secondary">Enable 2FA</button>
            <button className="btn-secondary">Update Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;