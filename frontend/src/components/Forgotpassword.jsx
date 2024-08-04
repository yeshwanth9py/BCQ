import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (data.success) {
                setOtpSent(true);
                toast.success('OTP sent to your email, it will expire in 5 minutes');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Error sending OTP. Please try again.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/send-otp', { // Ensure this endpoint is correct
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await response.json();

            if (data.success) {
                toast.success('Password reset successfully');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Error resetting password. Please try again.");
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <Toaster />
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="text-6xl font-bold italic text-amber-800">Code Combat</h1>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Forgot Password
                </h2>
                {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-amber-800 py-2 px-4 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                            >
                                Send OTP
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                OTP
                            </label>
                            <div className="mt-1">
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    type="password"
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-amber-800 py-2 px-4 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>
                )}
            </div>
            <p className="mt-10 text-center text-sm text-gray-500">
                Already a member?{' '}
                <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 text-lg">
                  Login
                </Link>
              </p>
        </div>
    );
};

export default ForgotPassword;
