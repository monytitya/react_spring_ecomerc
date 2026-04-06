import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut, LayoutDashboard, Trash2, ArrowRight, Loader2, ShoppingBag } from 'lucide-react';
import { cartApi, wishlistApi } from '../../services/api';

const BASE = 'http://localhost:9090/api/files/';
const img  = (f) => (f ? `${BASE}${f}` : null);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart Sidebar State
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const role = localStorage.getItem('role');
  const isLoggedIn = !!(localStorage.getItem('admin_token') || localStorage.getItem('customer_token'));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      cartApi.get().then(r => {
        setCartItems(r.data?.data || []);
        setCartCount(r.data?.data?.length || 0);
      }).catch(() => {});
      if (user?.id) {
        wishlistApi.get(user.id).then(r => setWishlistCount(r.data?.data?.length || 0)).catch(() => {});
      }
    }
  }, [isLoggedIn]);

  const loadCart = () => {
    if (!isLoggedIn) return;
    setCartLoading(true);
    cartApi.get().then(r => {
      setCartItems(r.data?.data || []);
      setCartCount(r.data?.data?.length || 0);
    }).finally(() => setCartLoading(false));
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setCartSidebarOpen(true);
    loadCart();
  };

  const handleRemoveItem = async (productId) => {
    await cartApi.remove(productId).catch(() => {});
    setCartItems(prev => prev.filter(i => i.productId !== productId));
    setCartCount(prev => prev - 1);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/home');
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 animate-in fade-in duration-200"
          onClick={() => setSearchOpen(false)}
        >
          <form
            onSubmit={handleSearch}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center px-6 py-4 gap-4">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories…"
                className="flex-1 text-lg text-slate-800 placeholder-slate-400 outline-none bg-transparent"
              />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Dark Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#0f172a] ${
          scrolled ? 'shadow-xl shadow-blue-900/20' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
                <span className="text-white font-black text-sm">B</span>
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Blueberry
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                        : 'text-blue-100 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl transition-all text-blue-100 hover:bg-white/10 hover:text-white"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2.5 rounded-xl transition-all group">
                <Heart className="w-5 h-5 transition-colors text-blue-100 group-hover:text-red-300" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <button onClick={handleCartClick} className="relative p-2.5 rounded-xl transition-all group">
                <ShoppingCart className="w-5 h-5 transition-colors text-blue-100 group-hover:text-amber-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-400 text-slate-900 text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-amber-400/30">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Admin/Dashboard Fast Action Button */}
              {isLoggedIn && (role === 'ADMIN' || role === 'admin') && (
                <Link
                  to="/dashboard"
                  className="hidden xl:flex items-center gap-2 ml-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-0.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-200" />
                  Dashboard
                </Link>
              )}

              {/* Auth */}
              {isLoggedIn ? (
                <div className="relative group hidden lg:block ml-2">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all text-blue-100 hover:bg-white/10">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold border border-blue-500/30">
                      {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                    </div>
                    <span className="hidden xl:block text-white group-hover:text-blue-100 transition-colors">
                      {user?.firstName || user?.username || 'Account'}
                    </span>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 py-2">
                      <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <User className="w-4 h-4 ztext-slate-400" /> My Orders
                      </Link>
                      {(role === 'ADMIN' || role === 'admin') && (
                        <Link to="/dashboard" className="xl:hidden flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-slate-400" /> Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-slate-100 my-1" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4 opacity-70" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 ml-2"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2.5 rounded-xl transition-all text-blue-100 hover:bg-white/10"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-[#0f172a] border-t border-white/10 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive ? 'bg-blue-600 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className="pt-3 pb-2 border-t border-white/10 mt-3">
                {isLoggedIn ? (
                  <>
                    {(role === 'ADMIN' || role === 'admin') && (
                      <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-blue-400 hover:bg-white/10 rounded-xl transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                      </Link>
                    )}
                    <Link to="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-blue-100 hover:bg-white/10 hover:text-white rounded-xl transition-colors">
                      <User className="w-4 h-4" /> My Orders
                    </Link>
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-400 hover:bg-white/10 rounded-xl transition-colors">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3.5 mt-2 bg-blue-600 text-white text-sm font-black rounded-xl text-center shadow-lg shadow-blue-900/50">
                    Sign In to Account
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      {/* Cart Sidebar Drawer */}
      {cartSidebarOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setCartSidebarOpen(false)} />
          <div className="relative w-full sm:w-[400px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-blue-600" /> Your Cart
              </h2>
              <button onClick={() => setCartSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-full text-slate-500 hover:bg-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                  <p className="font-bold text-slate-800 text-lg mb-2">Cart is empty</p>
                  <p className="text-slate-500 text-sm">Looks like you haven't added anything yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => {
                    const price = item.salePrice ?? item.price ?? 0;
                    const image = img(item.imageName || item.imageFile);
                    return (
                      <div key={item.productId} className="flex gap-4 group">
                        <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                           {image ? <img src={image} className="w-full h-full object-cover" /> : <ShoppingBag className="w-8 h-8 text-slate-300 m-auto mt-6" />}
                        </div>
                        <div className="flex-1 flex flex-col min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug">{item.productTitle || item.title}</h4>
                            <button onClick={() => handleRemoveItem(item.productId)} className="text-slate-300 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-end justify-between">
                            <p className="text-sm font-semibold text-slate-500">Qty: {item.qty}</p>
                            <p className="font-black text-blue-600 text-sm">${(price * item.qty).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50">
                <div className="flex justify-between mb-4">
                  <span className="font-bold text-slate-600">Subtotal</span>
                  <span className="font-black text-slate-900 text-xl">
                    ${cartItems.reduce((acc, i) => acc + (i.salePrice ?? i.price ?? 0) * i.qty, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => { setCartSidebarOpen(false); navigate('/cart'); }} className="w-full py-4 bg-white text-blue-600 font-bold border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">
                    View Full Cart
                  </button>
                  <button onClick={() => { setCartSidebarOpen(false); navigate('/checkout/new'); }} className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                    Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
