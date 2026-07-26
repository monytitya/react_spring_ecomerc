import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { UserPlus, Lock, Mail, User, MapPin, Phone, Home, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPass: '',
    customerCountry: '',
    customerCity: '',
    customerContact: '',
    customerAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.register(formData);
      // Backend returns ApiResponse<AuthResponse> on success
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-slate-200 overflow-hidden border border-slate-100"
      >
        <div className="bg-gradient-to-br from-sidebar to-sidebar/90 p-8 text-white text-center relative">
          <button 
            onClick={() => navigate('/login')}
            className="absolute left-6 top-8 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
          </button>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sidebar-200 mt-2">Join Blueberry CRM Marketplace</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-xl flex items-center">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded-xl flex items-center">
              <span>Registration successful! Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="customerName"
                    required
                    autoComplete="name"
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    placeholder="John Doe"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="customerEmail"
                    required
                    autoComplete="email"
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    placeholder="john@example.com"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    name="customerPass"
                    required
                    autoComplete="new-password"
                    minLength={6}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    placeholder="••••••••"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Contact Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="customerContact"
                    required
                    autoComplete="tel"
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    placeholder="+1 234 567 890"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Country</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="customerCountry"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    placeholder="USA"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">City</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="customerCity"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    placeholder="New York"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Residential Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand transition-colors">
                  <Home className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="customerAddress"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                  placeholder="123 Main St, Suite 100"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-brand/20 flex items-center justify-center space-x-2 mt-4"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or register with</span>
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
              className="w-full mt-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 px-4 border border-slate-200 rounded-2xl transition-all shadow-sm flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign up with Google OAuth2</span>
            </button>
          </div>

          <p className="text-center text-slate-500 text-sm mt-8">
            Already have an account? <span 
              onClick={() => navigate('/login')} 
              className="text-brand font-medium hover:underline cursor-pointer"
            >Sign in instead</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
