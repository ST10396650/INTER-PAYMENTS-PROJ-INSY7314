import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/api'
import { User, Shield, Calendar, CreditCard, Mail } from 'lucide-react'

const Profile = () => {
    const { user, userType } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const response = await authService.getProfile()
            setProfile(response.data)
        } catch (error) {
            console.error('Failed to load profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Never'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div style={styles.loading}>
                <div>Loading profile...</div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div style={styles.error}>
                <div>Failed to load profile</div>
            </div>
        )
    }

    return (
        <>
            <Helmet>
                <title>Profile - International Payments Portal</title>
            </Helmet>

            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Profile</h1>
                    <p style={styles.subtitle}>Manage your account information</p>
                </div>

                <div style={styles.profileGrid}>
                    {/* Personal Information */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <User size={24} />
                            <h2 style={styles.sectionTitle}>
                                {userType === 'employee' ? 'Employee Information' : 'Personal Information'}
                            </h2>
                        </div>

                        <div style={styles.infoGrid}>
                            <div style={styles.infoItem}>
                                <label style={styles.infoLabel}>
                                    {userType === 'employee' ? 'Employee Name' : 'Full Name'}
                                </label>
                                <div style={styles.infoValue}>
                                    {profile.full_name || profile.employee_name}
                                </div>
                            </div>

                            <div style={styles.infoItem}>
                                <label style={styles.infoLabel}>Username</label>
                                <div style={styles.infoValue}>{profile.username}</div>
                            </div>

                            {userType === 'employee' ? (
                                <>
                                    <div style={styles.infoItem}>
                                        <label style={styles.infoLabel}>Employee ID</label>
                                        <div style={styles.infoValue}>{profile.employee_id}</div>
                                    </div>
                                    <div style={styles.infoItem}>
                                        <label style={styles.infoLabel}>Department</label>
                                        <div style={styles.infoValue}>{profile.department}</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={styles.infoItem}>
                                        <label style={styles.infoLabel}>Customer ID</label>
                                        <div style={styles.infoValue}>{profile.customer_id}</div>
                                    </div>
                                    <div style={styles.infoItem}>
                                        <label style={styles.infoLabel}>Account Number</label>
                                        <div style={styles.infoValue}>
                                            {profile.masked_account_number || '****' + profile.account_number?.slice(-4)}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div style={styles.infoItem}>
                                <label style={styles.infoLabel}>Account Created</label>
                                <div style={styles.infoValue}>
                                    <Calendar size={16} />
                                    {formatDate(profile.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <Shield size={24} />
                            <h2 style={styles.sectionTitle}>Account Status</h2>
                        </div>

                        <div style={styles.statusGrid}>
                            <div style={styles.statusItem}>
                                <div style={styles.statusLabel}>Account Status</div>
                                <div style={{
                                    ...styles.statusValue,
                                    color: profile.is_active ? 'var(--success-color)' : 'var(--error-color)'
                                }}>
                                    {profile.is_active ? 'Active' : 'Inactive'}
                                </div>
                            </div>

                            {userType === 'customer' && (
                                <>
                                    <div style={styles.statusItem}>
                                        <div style={styles.statusLabel}>Account Locked</div>
                                        <div style={{
                                            ...styles.statusValue,
                                            color: profile.is_locked ? 'var(--error-color)' : 'var(--success-color)'
                                        }}>
                                            {profile.is_locked ? 'Yes' : 'No'}
                                        </div>
                                    </div>

                                    {profile.is_locked && profile.locked_until && (
                                        <div style={styles.statusItem}>
                                            <div style={styles.statusLabel}>Locked Until</div>
                                            <div style={styles.statusValue}>
                                                {formatDate(profile.locked_until)}
                                            </div>
                                        </div>
                                    )}

                                    <div style={styles.statusItem}>
                                        <div style={styles.statusLabel}>Failed Login Attempts</div>
                                        <div style={styles.statusValue}>
                                            {profile.failed_login_attempts || 0}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div style={styles.statusItem}>
                                <div style={styles.statusLabel}>Last Login</div>
                                <div style={styles.statusValue}>
                                    <Calendar size={16} />
                                    {formatDate(profile.last_login)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Role & Permissions */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <CreditCard size={24} />
                            <h2 style={styles.sectionTitle}>Role & Permissions</h2>
                        </div>

                        <div style={styles.roleInfo}>
                            <div style={styles.roleItem}>
                                <label style={styles.roleLabel}>Role</label>
                                <div style={styles.roleValue}>
                                    {profile.role_id?.role_name || userType}
                                </div>
                            </div>

                            {profile.role_id?.permissions && (
                                <div style={styles.permissions}>
                                    <label style={styles.permissionsLabel}>Permissions</label>
                                    <div style={styles.permissionsList}>
                                        {profile.role_id.permissions.map(permission => (
                                            <div key={permission} style={styles.permissionItem}>
                                                {permission.replace(/_/g, ' ')}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Security Information */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <Shield size={24} />
                            <h2 style={styles.sectionTitle}>Security Information</h2>
                        </div>

                        <div style={styles.securityInfo}>
                            <div style={styles.securityItem}>
                                <div style={styles.securityLabel}>Password Last Changed</div>
                                <div style={styles.securityValue}>
                                    {formatDate(profile.password_changed_at) || 'Unknown'}
                                </div>
                            </div>

                            <div style={styles.securityItem}>
                                <div style={styles.securityLabel}>Two-Factor Authentication</div>
                                <div style={styles.securityValue}>Not Enabled</div>
                            </div>

                            <div style={styles.securityTips}>
                                <h4 style={styles.tipsTitle}>Security Tips:</h4>
                                <ul style={styles.tipsList}>
                                    <li>Use a strong, unique password</li>
                                    <li>Never share your login credentials</li>
                                    <li>Log out after each session</li>
                                    <li>Report suspicious activity immediately</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
    },
    header: {
        marginBottom: '40px',
        textAlign: 'center'
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: 'var(--text-primary)',
        marginBottom: '8px'
    },
    subtitle: {
        fontSize: '18px',
        color: 'var(--text-secondary)'
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '18px',
        color: 'var(--text-secondary)'
    },
    error: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '18px',
        color: 'var(--error-color)'
    },
    profileGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px'
    },
    section: {
        background: 'var(--surface-color)',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid var(--border-color)'
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'var(--text-primary)'
    },
    infoGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    infoItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid var(--border-color)'
    },
    infoLabel: {
        fontWeight: '600',
        color: 'var(--text-secondary)',
        fontSize: '14px'
    },
    infoValue: {
        color: 'var(--text-primary)',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    statusGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    statusItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid var(--border-color)'
    },
    statusLabel: {
        fontWeight: '600',
        color: 'var(--text-secondary)',
        fontSize: '14px'
    },
    statusValue: {
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    roleInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    roleItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid var(--border-color)'
    },
    roleLabel: {
        fontWeight: '600',
        color: 'var(--text-secondary)',
        fontSize: '14px'
    },
    roleValue: {
        color: 'var(--text-primary)',
        fontSize: '14px',
        textTransform: 'capitalize'
    },
    permissions: {
        marginTop: '8px'
    },
    permissionsLabel: {
        fontWeight: '600',
        color: 'var(--text-secondary)',
        fontSize: '14px',
        marginBottom: '12px',
        display: 'block'
    },
    permissionsList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
    },
    permissionItem: {
        backgroundColor: 'rgba(49, 130, 206, 0.1)',
        color: 'var(--accent-color)',
        padding: '6px 12px',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'capitalize'
    },
    securityInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    securityItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid var(--border-color)'
    },
    securityLabel: {
        fontWeight: '600',
        color: 'var(--text-secondary)',
        fontSize: '14px'
    },
    securityValue: {
        color: 'var(--text-primary)',
        fontSize: '14px'
    },
    securityTips: {
        marginTop: '16px',
        padding: '16px',
        backgroundColor: 'rgba(49, 130, 206, 0.05)',
        borderRadius: '6px',
        border: '1px solid rgba(49, 130, 206, 0.2)'
    },
    tipsTitle: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '8px',
        color: 'var(--text-primary)'
    },
    tipsList: {
        fontSize: '12px',
        color: 'var(--text-secondary)',
        paddingLeft: '20px',
        lineHeight: '1.6'
    }
}

export default Profile