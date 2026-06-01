import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import OrderForm from './components/OrderForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { ChefHat, Settings } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 mb-8 flex justify-between items-center rounded-b-2xl mx-4 lg:mx-auto max-w-6xl">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-orange-500 hover:text-orange-600 transition-colors">
        <ChefHat className="w-8 h-8" />
        <span>FoodieExpress</span>
      </Link>
      
      <div>
        {!isAdmin ? (
          <Link to="/admin/login" className="flex items-center gap-2 text-slate-600 hover:text-orange-500 font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Admin Panel
          </Link>
        ) : (
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-orange-500 font-medium transition-colors">
            Order Food
          </Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen pb-12">
        <Navigation />
        <main className="max-w-6xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<OrderForm />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
