import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Truck, Headphones } from 'lucide-react';

const Facebook = ({ className }) => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const Twitter = ({ className }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const Instagram = ({ className }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const Youtube = ({ className }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    Shop: [
      { label: 'All Products', to: '/shop' },
      { label: 'New Arrivals', to: '/shop?label=new' },
      { label: 'Featured Items', to: '/shop?label=featured' },
      { label: 'Deals & Sale', to: '/shop?label=deals' },
    ],
    Company: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Careers', to: '/about' },
      { label: 'Store Locations', to: '/contact' },
    ],
    Support: [
      { label: 'Help Center', to: '/contact' },
      { label: 'Track Order', to: '/orders' },
      { label: 'Shipping & Returns', to: '/contact' },
      { label: 'Privacy Policy', to: '/about' },
    ],
  };

  const socials = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-[#050B14] text-slate-400 border-t border-slate-800/80">
      {/* Newsletter Banner */}
      <div className="border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-3xl bg-blue-600 p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
            <div>
              <h3 className="text-2xl lg:text-3xl font-black text-white">Subscribe to Our Newsletter</h3>
              <p className="text-blue-100 mt-2 text-sm">Get 15% off your first order and stay updated on exclusive deals.</p>
            </div>
            <form className="flex gap-3 w-full lg:w-auto" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 lg:w-80 px-5 py-3.5 rounded-xl bg-white/15 backdrop-blur text-white placeholder-blue-200 border border-white/20 outline-none focus:ring-2 focus:ring-white/30 text-sm font-medium"
              />
              <button
                type="submit"
                className="px-7 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm flex items-center gap-2 whitespace-nowrap shadow-md"
              >
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/home" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                <span className="text-white font-black text-xl">A</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">Ecomerc shop</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs text-slate-400">
              Premium accessories designed for work, travel and lifestyle. Experience high quality gear with fast worldwide delivery.
            </p>
            <div className="space-y-3">
              {[
                { icon: Mail, text: 'support@accesora.com' },
                { icon: Phone, text: '+1 (800) 555-0199' },
                { icon: MapPin, text: '789 Commerce Way, Tech District' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-slate-800/80 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">{title}</h4>
              <ul className="space-y-3">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm hover:text-white transition-colors inline-block"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">© {year} Ecomerc shop. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
