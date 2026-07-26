import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { LogIn, Lock, Mail, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [role, setRole] = useState('ADMIN'); // Default to ADMIN as per original UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [showForgot, setShowForgot] = useState(false);
  const [resetData, setResetData] = useState({ email: '', newPassword: '' });
  const [resetLoading, setResetLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      await authApi.resetPassword(resetData);
      setShowForgot(false);
      setFormData({ ...formData, email: resetData.email });
      alert('Password reset successful! You can now log in.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const loginFn = role === 'ADMIN' ? authApi.login : authApi.customerLogin;
      const response = await loginFn(formData);

      const authData = response.data?.data || response.data;
      const token = authData.token;

      if (!token) throw new Error('No token received from server');

      localStorage.setItem(role === 'ADMIN' ? 'admin_token' : 'customer_token', token);
      localStorage.setItem('user', JSON.stringify({
        id: authData.id,
        name: authData.name,
        email: authData.email,
        role: authData.role,
        image: authData.image
      }));
      localStorage.setItem('role', role);

      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Invalid credentials. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
      {showForgot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-slate-100"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-2">Reset Password</h2>
            <p className="text-sm text-slate-500 mb-6 font-medium">Enter your account email and choose a new password.</p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-brand transition-colors" />
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    placeholder="name@email.com"
                    onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-brand transition-colors" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    placeholder="••••••••"
                    onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="flex-1 py-3 px-4 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all border border-slate-200/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 py-3 px-4 bg-brand text-white font-bold rounded-xl hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 flex items-center justify-center"
                >
                  {resetLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Reset'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200 overflow-hidden border border-slate-100"
      >
        <div className="bg-gradient-to-br from-sidebar to-sidebar/90 p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sidebar-200 mt-2">Sign in to Blueberry CRM</p>

          <div className="mt-6 flex bg-white/10 p-1 rounded-xl backdrop-blur-sm">
            <button
              onClick={() => setRole('ADMIN')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${role === 'ADMIN' ? 'bg-white text-sidebar shadow-sm' : 'text-white hover:bg-white/5'}`}
            >
              Admin
            </button>
            <button
              onClick={() => setRole('CUSTOMER')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${role === 'CUSTOMER' ? 'bg-white text-sidebar shadow-sm' : 'text-white hover:bg-white/5'}`}
            >
              Customer
            </button>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-center">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                  placeholder="admin@mail.com"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-600">
                <input type="checkbox" className="rounded border-slate-300 text-brand focus:ring-brand mr-2" />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-brand hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-brand/20 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={() => {
                const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-google-client-id.apps.googleusercontent.com';
                const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/callback`);
                const scope = encodeURIComponent('email profile');
                window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&prompt=consent`;
              }}
              className="w-full mt-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 border border-slate-200 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google OAuth2</span>
            </button>
          </div>

          <div className="text-center text-slate-500 text-sm mt-8 space-y-2">
            <div>
              Don't have an account? <span
                onClick={() => navigate('/register')}
                className="text-brand font-medium hover:underline cursor-pointer"
              >Register here</span>
            </div>
            <div className="text-xs text-slate-400 mt-2 flex flex-wrap justify-center gap-2">
              <span>Debug Auto-fill:</span>
              <span onClick={() => {
                setRole('ADMIN');
                setFormData({ email: 'lolo@gmail.com', password: 'admin123' });
              }} className="underline cursor-pointer text-brand">lolo@gmail.com</span>
              <span>|</span>
              <span onClick={() => {
                setRole('ADMIN');
                setFormData({ email: 'tityamonymac@gmail.com', password: 'admin123' });
              }} className="underline cursor-pointer text-brand">tityamonymac@gmail.com</span>
              <span>|</span>
              <span onClick={() => {
                setRole('CUSTOMER');
                setFormData({ email: 'customer@mail.com', password: 'customer123' });
              }} className="underline cursor-pointer text-brand">customer@mail.com</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
