import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import api from '../api';

function DeliveryLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/delivery/login', { email, password });
      localStorage.setItem('deliveryToken', res.data.token);
      navigate('/delivery/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto glass p-8 rounded-2xl animate-fade-in mt-12">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-orange-100 p-3 rounded-full mb-4">
          <Truck className="w-8 h-8 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Delivery Login</h2>
      </div>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center font-medium">{error}</div>}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
            placeholder="delivery@foodflow.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default DeliveryLogin;
