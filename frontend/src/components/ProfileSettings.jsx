
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { User, Lock, Bell, Loader2, AlertCircle, CheckCircle, Smartphone, Mail, Plus, Trash2 } from 'lucide-react';

const ProfileSettings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile State
    const [profile, setProfile] = useState({
        full_name: '',
        username: '',
        avatar_url: '',
        mobile: '', // Primary mobile from profiles table
        email: ''   // Primary email from auth
    });

    // Additional Contact Info State
    const [extraEmails, setExtraEmails] = useState([]);
    const [extraMobiles, setExtraMobiles] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const [newMobile, setNewMobile] = useState('');

    // Security State
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Notifications State
    const [notifications, setNotifications] = useState({
        email_updates: true,
        weekly_digest: false,
        new_followers: true
    });

    useEffect(() => {
        if (user) {
            getProfile();
            // Load notification settings from user metadata if available
            if (user.user_metadata?.notifications) {
                setNotifications(user.user_metadata.notifications);
            }
            if (user.user_metadata?.additional_emails) {
                setExtraEmails(user.user_metadata.additional_emails);
            }
            if (user.user_metadata?.additional_mobiles) {
                setExtraMobiles(user.user_metadata.additional_mobiles);
            }
        }
    }, [user]);

    const getProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            if (data) {
                setProfile({
                    full_name: data.full_name || '',
                    username: data.username || '',
                    avatar_url: data.avatar_url || '',
                    mobile: data.mobile || '',
                    email: user.email // Email comes from auth user, not necessarily profiles table
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error.message);
        }
    };

    const handleAddEmail = () => {
        if (newEmail && !extraEmails.includes(newEmail)) {
            setExtraEmails([...extraEmails, newEmail]);
            setNewEmail('');
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        setExtraEmails(extraEmails.filter(e => e !== emailToRemove));
    };

    const handleAddMobile = () => {
        if (newMobile && !extraMobiles.includes(newMobile)) {
            setExtraMobiles([...extraMobiles, newMobile]);
            setNewMobile('');
        }
    };

    const handleRemoveMobile = (mobileToRemove) => {
        setExtraMobiles(extraMobiles.filter(m => m !== mobileToRemove));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // 1. Update Profile Data (Database - Primary Mobile)
            const updates = {
                id: user.id,
                full_name: profile.full_name,
                username: profile.username,
                avatar_url: profile.avatar_url,
                mobile: profile.mobile,
                updated_at: new Date()
            };

            const { error: profileError } = await supabase
                .from('profiles')
                .upsert(updates);

            if (profileError) throw profileError;

            // 2. Update Auth Data (Email & Metadata)
            const authUpdates = {
                data: {
                    full_name: profile.full_name,
                    username: profile.username,
                    additional_emails: extraEmails,
                    additional_mobiles: extraMobiles
                }
            };

            // Only update email if changed
            if (profile.email !== user.email) {
                authUpdates.email = profile.email;
            }

            const { error: authError, data } = await supabase.auth.updateUser(authUpdates);

            if (authError) throw authError;

            let successMsg = 'Profile updated successfully!';
            if (profile.email !== user.email) {
                successMsg += ' Please check your new email to confirm the change.';
            }

            setMessage({ type: 'success', text: successMsg });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match!' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // 1. Verify Old Password
            // We verify by attempting to sign in (without actually changing session if possible, or just re-authing)
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: passwords.currentPassword
            });

            if (signInError) {
                throw new Error("Incorrect current password.");
            }

            // 2. Update Password
            const { error: updateError } = await supabase.auth.updateUser({
                password: passwords.newPassword
            });

            if (updateError) throw updateError;
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationUpdate = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase.auth.updateUser({
                data: { notifications }
            });

            if (error) throw error;
            setMessage({ type: 'success', text: 'Notification preferences saved!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-6 py-4 w-full text-left transition-colors border-l-2 ${activeTab === id
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:bg-white/5 hover:text-foreground'
                }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-foreground">Account Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="bg-card border border-border rounded-xl h-fit overflow-hidden">
                    <nav className="flex flex-col">
                        <TabButton id="profile" label="Profile" icon={User} />
                        <TabButton id="security" label="Security" icon={Lock} />
                        <TabButton id="notifications" label="Notifications" icon={Bell} />
                    </nav>
                </div>

                {/* Content Area */}
                <div className="md:col-span-3">
                    <div className="bg-card border border-border rounded-xl p-8">
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                }`}>
                                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                {message.text}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <h2 className="text-xl font-bold mb-6 text-foreground">Public Profile</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">Username</label>
                                        <input
                                            type="text"
                                            value={profile.username}
                                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                            className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={profile.full_name}
                                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                            className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary focus:outline-none"
                                        />
                                    </div>

                                    {/* Email Section */}
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="block text-sm font-medium text-gray-500">Email Addresses</label>

                                        {/* Primary Email */}
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="w-full bg-background border border-border rounded-lg p-3 pl-10 text-foreground focus:border-primary focus:outline-none"
                                                placeholder="Primary Email"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary bg-primary/10 px-2 py-1 rounded">Primary</span>
                                        </div>

                                        {/* Additional Emails */}
                                        {extraEmails.map((email, index) => (
                                            <div key={index} className="relative flex gap-2">
                                                <div className="relative flex-1">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        value={email}
                                                        readOnly
                                                        className="w-full bg-background/50 border border-border rounded-lg p-3 pl-10 text-gray-400"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveEmail(email)}
                                                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Add Email Input */}
                                        <div className="flex gap-2">
                                            <input
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                className="flex-1 bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary focus:outline-none"
                                                placeholder="Add another email..."
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddEmail}
                                                className="bg-card hover:bg-card-hover border border-border text-foreground px-4 rounded-lg transition-colors"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mobile Section */}
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="block text-sm font-medium text-gray-500">Mobile Numbers</label>

                                        {/* Primary Mobile */}
                                        <div className="relative">
                                            <Smartphone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${!profile.mobile ? 'text-red-500' : 'text-primary'}`} />
                                            <input
                                                type="tel"
                                                value={profile.mobile}
                                                onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                                                className={`w-full bg-background border rounded-lg p-3 pl-10 text-foreground focus:outline-none ${!profile.mobile ? 'border-red-500/50 focus:border-red-500' : 'border-border focus:border-primary'}`}
                                                placeholder={!profile.mobile ? "Please add a primary mobile number first" : "Primary Mobile Number"}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary bg-primary/10 px-2 py-1 rounded">Primary</span>
                                        </div>
                                        {!profile.mobile && (
                                            <p className="text-sm text-red-400">A primary mobile number is required to add additional numbers.</p>
                                        )}

                                        {/* Additional Mobiles */}
                                        {extraMobiles.map((mobile, index) => (
                                            <div key={index} className="relative flex gap-2">
                                                <div className="relative flex-1">
                                                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        value={mobile}
                                                        readOnly
                                                        className="w-full bg-background/50 border border-border rounded-lg p-3 pl-10 text-gray-400"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMobile(mobile)}
                                                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Add Mobile Input */}
                                        {profile.mobile && (
                                            <div className="flex gap-2">
                                                <input
                                                    type="tel"
                                                    value={newMobile}
                                                    onChange={(e) => setNewMobile(e.target.value)}
                                                    className="flex-1 bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary focus:outline-none"
                                                    placeholder="Add another mobile number..."
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddMobile}
                                                    className="bg-card hover:bg-card-hover border border-border text-foreground px-4 rounded-lg transition-colors"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-border pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-primary text-black px-6 py-2 rounded-full font-bold hover:brightness-110 transition-all flex items-center gap-2"
                                    >
                                        {loading && <Loader2 className="animate-spin" size={18} />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'security' && (
                            <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                <h2 className="text-xl font-bold mb-6 text-foreground">Change Password</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary focus:outline-none"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Required to set a new password.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary focus:outline-none"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary focus:outline-none"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="border-t border-border pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-primary text-black px-6 py-2 rounded-full font-bold hover:brightness-110 transition-all flex items-center gap-2"
                                    >
                                        {loading && <Loader2 className="animate-spin" size={18} />}
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold mb-6 text-foreground">Notification Preferences</h2>

                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-background border border-border rounded-lg cursor-pointer">
                                        <div>
                                            <p className="font-medium text-foreground">Email Updates</p>
                                            <p className="text-sm text-gray-500">Receive news and product updates</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notifications.email_updates}
                                            onChange={(e) => setNotifications({ ...notifications, email_updates: e.target.checked })}
                                            className="accent-primary w-5 h-5"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-background border border-border rounded-lg cursor-pointer">
                                        <div>
                                            <p className="font-medium text-foreground">Weekly Digest</p>
                                            <p className="text-sm text-gray-500">Get a summary of your week in music</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notifications.weekly_digest}
                                            onChange={(e) => setNotifications({ ...notifications, weekly_digest: e.target.checked })}
                                            className="accent-primary w-5 h-5"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-background border border-border rounded-lg cursor-pointer">
                                        <div>
                                            <p className="font-medium text-foreground">New Followers</p>
                                            <p className="text-sm text-gray-500">Notify me when someone follows me</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notifications.new_followers}
                                            onChange={(e) => setNotifications({ ...notifications, new_followers: e.target.checked })}
                                            className="accent-primary w-5 h-5"
                                        />
                                    </label>
                                </div>

                                <div className="border-t border-border pt-6 flex justify-end">
                                    <button
                                        onClick={handleNotificationUpdate}
                                        disabled={loading}
                                        className="bg-primary text-black px-6 py-2 rounded-full font-bold hover:brightness-110 transition-all flex items-center gap-2"
                                    >
                                        {loading && <Loader2 className="animate-spin" size={18} />}
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
