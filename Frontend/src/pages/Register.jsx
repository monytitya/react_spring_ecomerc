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
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
