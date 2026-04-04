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
      
      // Backend: ApiResponse<AuthResponse>
      // axios wraps HTTP body in response.data, ApiResponse has .data field
      // So: axios.response.data = ApiResponse, ApiResponse.data = AuthResponse
      const authData = response.data?.data || response.data;
      // AuthResponse shape: { token, role, email, name, id }
      const token = authData.token;
      
      if (!token) throw new Error('No token received from server');

      localStorage.setItem(role === 'ADMIN' ? 'admin_token' : 'customer_token', token);
      // Store flat user info for use in Header/Profile
      localStorage.setItem('user', JSON.stringify({
        id: authData.id,
        name: authData.name,
        email: authData.email,
        role: authData.role,
        image: authData.image // optional
      }));
      localStorage.setItem('role', role);

      // Redirect both roles to dashboard
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
      {/* Forgot Password Modal */}
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

          <div className="text-center text-slate-500 text-sm mt-8 space-y-2">
            <div>
              Don't have an account? <span 
                onClick={() => navigate('/register')} 
                className="text-brand font-medium hover:underline cursor-pointer"
              >Register here</span>
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Debug: <span onClick={() => {
                setRole('ADMIN');
                setFormData({ email: 'admin@gmail.com', password: 'admin123' });
              }} className="underline cursor-pointer">Auto-fill test admin</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
