import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle, MessageSquare } from 'lucide-react';
import { cmsApi } from '../../services/api';

const Contact = () => {
  const [contact, setContact]   = useState(null);
  const [stores,  setStores]    = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form,    setForm]      = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending]   = useState(false);
  const [sent,    setSent]      = useState(false);
  const [error,   setError]     = useState('');

  useEffect(() => {
    Promise.all([
      cmsApi.getContact().catch(() => ({ data: { data: null } })),
      cmsApi.getStores().catch(() => ({ data: { data: [] } })),
    ]).then(([c, s]) => {
      setContact(c.data?.data || c.data);
      setStores(s.data?.data || s.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setSending(true);
    // Simulate sending (no real API endpoint)
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
  };

  const INFO = [
    {
      icon: Mail,
      label: 'Email Us',
      value: contact?.email || 'hello@blueberry.store',
      sub: 'We reply within 24 hours',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Phone,
      label: 'Call Us',
      value: contact?.phone || '+1 (555) 123-4567',
      sub: 'Mon–Fri, 9am – 6pm',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: MapPin,
      label: 'Visit Us',
      value: contact?.address || '123 E-Commerce Blvd, Suite 400, Tech City',
      sub: 'Open by appointment',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Clock,
      label: 'Working Hours',
      value: 'Mon–Fri: 9am – 6pm',
      sub: 'Sat: 10am – 4pm',
      color: 'bg-green-50 text-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1d4ed8] py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 mb-8">
            <MessageSquare className="w-4 h-4 text-blue-300" />
            <span className="text-white/90 text-sm font-semibold">Get in Touch</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            We'd Love to<br />Hear From You
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
            Have a question, feedback, or just want to say hi? Our team is always here to help.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INFO.map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/60 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="font-black text-slate-800 text-sm mb-1">{label}</p>
              <p className="text-slate-700 text-sm font-medium mb-1">{value}</p>
              <p className="text-slate-400 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-2">Send a Message</h2>
              <p className="text-slate-500 text-sm mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-sm mb-6">Thank you for reaching out. We'll reply to <strong>{form.email}</strong> shortly.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm font-medium">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black rounded-2xl shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/40"
                  >
                    {sending ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</>
                    ) : (
                      <><Send className="w-5 h-5" /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar: FAQ + Stores */}
          <div className="lg:col-span-2 space-y-8">
            {/* FAQ */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-black text-slate-900 mb-5">Frequently Asked</h2>
              <div className="space-y-4">
                {[
                  { q: 'How long does shipping take?',    a: 'Standard shipping takes 2–3 business days. Express is available at checkout.' },
                  { q: 'Can I return my order?',          a: 'Yes! We offer a 30-day hassle-free return policy for all products.' },
                  { q: 'Do you ship internationally?',    a: 'We ship to 25+ countries. Shipping costs and times vary by location.' },
                  { q: 'How do I track my order?',        a: 'Once shipped, you\'ll receive a tracking link via email automatically.' },
                ].map(({ q, a }) => (
                  <details key={q} className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none py-3 border-b border-slate-100 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">
                      {q}
                      <span className="text-slate-300 group-open:rotate-45 transition-transform text-xl font-light ml-3 flex-shrink-0">+</span>
                    </summary>
                    <p className="pt-3 pb-2 text-slate-500 text-xs leading-relaxed">{a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Store Locations */}
            {stores.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-lg font-black text-slate-900 mb-5">Our Stores</h2>
                <div className="space-y-4">
                  {stores.slice(0, 3).map((store, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{store.city || store.name}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{store.address}</p>
                        {store.phone && <p className="text-blue-600 text-xs mt-0.5 font-medium">{store.phone}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map placeholder */}
            <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-48 flex flex-col items-center justify-center gap-3">
                <MapPin className="w-8 h-8 text-blue-500" />
                <p className="text-sm font-bold text-slate-600">Interactive Map</p>
                <p className="text-xs text-slate-400">123 E-Commerce Blvd, Tech City</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
