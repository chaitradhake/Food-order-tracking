import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import OrderForm from './components/OrderForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import OrderHistory from './components/OrderHistory';
import TrackOrder from './components/TrackOrder';
import Login from './components/Login';
import Signup from './components/Signup';
import { ChefHat, Settings } from 'lucide-react';
import { useAuth } from './context/AuthContext';

function Navigation() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center rounded-b-2xl mx-4 lg:mx-auto max-w-6xl">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-orange-500 hover:text-orange-600 transition-colors">
        <ChefHat className="w-8 h-8" />
        <span>FoodieExpress</span>
      </Link>
      
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center">
        {!isAdmin ? (
          <>
            <Link to="/" className="text-slate-600 hover:text-orange-500 font-medium transition-colors text-sm sm:text-base">
              Order Food
            </Link>
            <Link to="/history" className="text-slate-600 hover:text-orange-500 font-medium transition-colors text-sm sm:text-base">
              Order History
            </Link>
            <Link to="/track" className="text-slate-600 hover:text-orange-500 font-medium transition-colors text-sm sm:text-base">
              Track Order
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <span className="text-sm font-semibold text-slate-700">Hi, {user?.name}</span>
                <button 
                  onClick={logout} 
                  className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-slate-600 hover:text-orange-500 font-medium transition-colors text-sm sm:text-base border-l border-slate-200 pl-4">
                Login
              </Link>
            )}

            <Link to="/admin/login" className="flex items-center gap-1.5 text-slate-600 hover:text-orange-500 font-medium transition-colors text-sm sm:text-base border-l border-slate-200 pl-4">
              <Settings className="w-4 h-4" />
              Admin Panel
            </Link>
          </>
        ) : (
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-orange-500 font-medium transition-colors text-sm sm:text-base">
            Order Food
          </Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium animate-pulse">Loading App session...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen pb-12">
        <Navigation />
        <main className="max-w-6xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<OrderForm />} />
            <Route path="/history" element={<OrderHistory />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/track/:id" element={<TrackOrder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
