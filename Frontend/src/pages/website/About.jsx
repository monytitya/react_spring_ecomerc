import React, { useEffect, useState } from 'react';
import { Users, Award, Globe, Heart, Loader2, ShoppingBag } from 'lucide-react';
import { cmsApi } from '../../services/api';

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cmsApi.getAbout()
      .then(r => setAbout(r.data?.data || r.data))
      .catch(() => setAbout(null))
      .finally(() => setLoading(false));
  }, []);

  const STATS = [
    { icon: Users,       value: '50,000+', label: 'Happy Customers' },
    { icon: ShoppingBag, value: '10,000+', label: 'Products Listed' },
    { icon: Globe,       value: '25+',     label: 'Countries Served' },
    { icon: Award,       value: '4.9★',    label: 'Average Rating' },
  ];

  const TEAM = [
    { name: 'Alex Chen',    role: 'Founder & CEO',          initials: 'AC', gradient: 'from-blue-400 to-blue-600' },
    { name: 'Maria Rossi',  role: 'Head of Design',         initials: 'MR', gradient: 'from-purple-400 to-purple-600' },
    { name: 'James Park',   role: 'CTO',                    initials: 'JP', gradient: 'from-indigo-400 to-indigo-600' },
    { name: 'Sofia Torres', role: 'Customer Experience',    initials: 'ST', gradient: 'from-pink-400 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1d4ed8] py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 mb-8">
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            <span className="text-white/90 text-sm font-semibold">Our Story</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Built with Passion,<br />Delivered with Love
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Blueberry was founded with a simple mission: to make premium products accessible to everyone.
            We curate the finest items and deliver them straight to your door.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center p-8 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all group">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                  <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
                <p className="text-slate-400 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CMS Content / Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">Our Mission</p>
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
                {loading ? 'Loading...' : (about?.title || 'Empowering Your Lifestyle')}
              </h2>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className={`h-4 bg-slate-100 rounded animate-pulse ${i===3?'w-4/5':''}`} />)}
                </div>
              ) : (
                <div className="text-slate-500 leading-relaxed space-y-4 text-sm">
                  <p>{about?.description || 'We are a team of passionate individuals dedicated to bringing you the best shopping experience possible.'}</p>
                  <p>{about?.vision || 'Our vision is to create a world where premium quality is accessible to all — not just a privileged few.'}</p>
                  <p>From sourcing to delivery, every step is crafted with care. We believe shopping should be joyful, seamless, and trustworthy.</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Quality First', desc: 'Every product is carefully vetted before it reaches you.', color: 'bg-blue-50 border-blue-100' },
                { title: 'Fast Delivery', desc: 'From warehouse to door in 2–3 business days.', color: 'bg-indigo-50 border-indigo-100' },
                { title: 'Eco Friendly', desc: 'We use sustainable packaging wherever possible.', color: 'bg-green-50 border-green-100' },
                { title: 'Customer First', desc: '24/7 support for any question or concern.', color: 'bg-amber-50 border-amber-100' },
              ].map(({ title, desc, color }) => (
                <div key={title} className={`p-5 rounded-2xl border ${color}`}>
                  <p className="font-black text-slate-800 mb-2 text-sm">{title}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">Meet the Team</p>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900">The People Behind Blueberry</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, initials, gradient }) => (
              <div key={name} className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white font-black text-xl mx-auto mb-4 shadow-lg`}>
                  {initials}
                </div>
                <p className="font-black text-slate-800 text-sm">{name}</p>
                <p className="text-slate-500 text-xs mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-blue-300 font-bold text-sm uppercase tracking-widest mb-4">Our Values</p>
          <h2 className="text-4xl font-black text-white mb-4">What We Stand For</h2>
          <p className="text-white/60 text-lg mb-14">Everything we do is guided by these core principles.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '🎯', title: 'Integrity',     desc: 'Honest products, honest prices. No hidden fees, no gimmicks.' },
              { emoji: '💡', title: 'Innovation',    desc: 'We constantly improve our platform and product lineup.' },
              { emoji: '🤝', title: 'Community',     desc: 'We give back — a portion of profits go to local charities.' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-6 text-left">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-black text-white text-base mb-2">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
