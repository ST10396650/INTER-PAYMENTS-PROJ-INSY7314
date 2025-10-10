import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/api'
import { User, Shield, Calendar, CreditCard, AlertCircle } from 'lucide-react'

const Profile = () => {
    const { userType } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
         if (userType) {
            loadProfile();
        } else {
            setError('Please login to view transactions');
            setLoading(false);
        };
        
    }, [userType])

    const loadProfile = async () => {
        try {
            setLoading(true)
            setError('')
            
            console.log(' Loading profile...')
            const response = await authService.getProfile()
            
            console.log(' Profile response:', response)
            
            // Handle the response structure: { success: true, data: {...} }
            if (response.success && response.data) {
                setProfile(response.data)
            } else {
                setError('Invalid profile data received')
            }
        } catch (error) {
            console.error('❌ Failed to load profile:', error)
            setError(error.response?.data?.message || error.message || 'Failed to load profile')
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div style={{ marginTop: '16px' }}>Loading profile...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.errorCard}>
                    <AlertCircle size={48} color="var(--error-color)" />
                    <h2 style={{ fontSize: '24px', marginTop: '16px' }}>Failed to Load Profile</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{error}</p>
                    <button 
                        onClick={loadProfile}
                        style={styles.retryButton}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div style={styles.error}>
                <div>No profile data available</div>
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
                            <User size={24} color="var(--accent-color)" />
                            <h2 style={styles.sectionTitle}>Personal Information</h2>
                        </div>

                        <div style={styles.infoGrid}>
                            <div style={styles.infoItem}>
                                <label style={styles.infoLabel}>Full Name</label>
                                <div style={styles.infoValue}>
                                    {profile.full_name || 'N/A'}
                                </div>
                            </div>

                            <div style={styles.infoItem}>
                                <label style={styles.infoLabel}>Username</label>
                                <div style={styles.infoValue}>
                                    {profile.username || 'N/A'}
                                </div>
                            </div>

                            <div style={styles.infoItem}>
                                <label style={styles.infoLabel}>Customer ID</label>
                                <div style={styles.infoValue}>
                                    {profile.customer_id || 'N/A'}
                                </div>
                            </div>

                            <div style={styles.infoItem}>
                                <label style={styles.infoLabel}>Account Number</label>
                                <div style={styles.infoValue}>
                                    {profile.masked_account_number || 'N/A'}
                                </div>
                            </div>

                            <div style={styles.infoItem}>
                                <label style={styles.infoLabel}>Account Created</label>
                                <div style={styles.infoValue}>
                                    <Calendar size={16} style={{ marginRight: '8px' }} />
                                    {formatDate(profile.created_at || profile.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <Shield size={24} color="var(--accent-color)" />
                            <h2 style={styles.sectionTitle}>Account Status</h2>
                        </div>

                        <div style={styles.statusGrid}>
                            <div style={styles.statusItem}>
                                <div style={styles.statusLabel}>Account Status</div>
                                <div style={{
                                    ...styles.statusBadge,
                                    backgroundColor: profile.is_active ? 'rgba(56, 161, 105, 0.1)' : 'rgba(229, 62, 62, 0.1)',
                                    color: profile.is_active ? 'var(--success-color)' : 'var(--error-color)'
                                }}>
                                    {profile.is_active ? '✓ Active' : '✗ Inactive'}
                                </div>
                            </div>

                            <div style={styles.statusItem}>
                                <div style={styles.statusLabel}>Last Login</div>
                                <div style={styles.statusValue}>
                                    <Calendar size={16} style={{ marginRight: '8px' }} />
                                    {formatDate(profile.last_login)}
                                </div>
                            </div>

                            <div style={styles.statusItem}>
                                <div style={styles.statusLabel}>Account Age</div>
                                <div style={styles.statusValue}>
                                    {profile.created_at ? 
                                        `${Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))} days` 
                                        : 'N/A'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Role & Permissions */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <CreditCard size={24} color="var(--accent-color)" />
                            <h2 style={styles.sectionTitle}>Role & Access</h2>
                        </div>

                        <div style={styles.roleInfo}>
                            <div style={styles.roleItem}>
                                <label style={styles.roleLabel}>Role</label>
                                <div style={styles.roleBadge}>
                                    {profile.role || 'Customer'}
                                </div>
                            </div>

                            <div style={styles.accessInfo}>
                                <h4 style={styles.accessTitle}>Account Features:</h4>
                                <ul style={styles.featuresList}>
                                    <li>✓ Make international payments</li>
                                    <li>✓ View transaction history</li>
                                    <li>✓ Manage account settings</li>
                                    <li>✓ Secure payment portal</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Security Information */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <Shield size={24} color="var(--accent-color)" />
                            <h2 style={styles.sectionTitle}>Security Information</h2>
                        </div>

                        <div style={styles.securityInfo}>
                            <div style={styles.securityNotice}>
                                <p style={styles.noticeText}>
                                    Your account is protected with industry-standard security measures.
                                </p>
                            </div>

                            <div style={styles.securityTips}>
                                <h4 style={styles.tipsTitle}>Security Best Practices:</h4>
                                <ul style={styles.tipsList}>
                                    <li>Use a strong, unique password for your account</li>
                                    <li>Never share your login credentials with anyone</li>
                                    <li>Always log out after completing your transactions</li>
                                    <li>Report any suspicious activity immediately</li>
                                    <li>Keep your contact information up to date</li>
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
        flexDirection: 'column',
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
    errorCard: {
        background: 'var(--surface-color)',
        padding: '48px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto'
    },
    retryButton: {
        marginTop: '24px',
        padding: '12px 24px',
        backgroundColor: 'var(--accent-color)',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
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
        alignItems: 'center'
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
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center'
    },
    statusBadge: {
        fontSize: '14px',
        fontWeight: '600',
        padding: '6px 12px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
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
    roleBadge: {
        backgroundColor: 'rgba(49, 130, 206, 0.1)',
        color: 'var(--accent-color)',
        padding: '6px 16px',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'capitalize'
    },
    accessInfo: {
        marginTop: '8px'
    },
    accessTitle: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '12px',
        color: 'var(--text-primary)'
    },
    featuresList: {
        fontSize: '13px',
        color: 'var(--text-secondary)',
        paddingLeft: '0',
        listStyle: 'none',
        lineHeight: '2'
    },
    securityInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    securityNotice: {
        padding: '16px',
        backgroundColor: 'rgba(56, 161, 105, 0.05)',
        borderRadius: '6px',
        border: '1px solid rgba(56, 161, 105, 0.2)'
    },
    noticeText: {
        fontSize: '14px',
        color: 'var(--text-primary)',
        margin: 0
    },
    securityTips: {
        padding: '16px',
        backgroundColor: 'rgba(49, 130, 206, 0.05)',
        borderRadius: '6px',
        border: '1px solid rgba(49, 130, 206, 0.2)'
    },
    tipsTitle: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '12px',
        color: 'var(--text-primary)'
    },
    tipsList: {
        fontSize: '13px',
        color: 'var(--text-secondary)',
        paddingLeft: '20px',
        lineHeight: '1.8',
        margin: 0
    }
}

export default Profile