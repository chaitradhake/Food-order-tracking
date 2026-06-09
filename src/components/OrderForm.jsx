import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, CheckCircle, ShieldAlert } from 'lucide-react';
import api from '../api';
import LoadingSpinner from './LoadingSpinner';

const MENU = [
  { id: 'm1', name: 'Deluxe Thali', price: 250, desc: 'Complete Indian meal' },
  { id: 'm2', name: 'Paneer Butter Masala', price: 180, desc: 'Rich cottage cheese curry' },
  { id: 'm3', name: 'Garlic Naan', price: 40, desc: 'Tandoor-baked flatbread' },
  { id: 'm4', name: 'Biryani', price: 220, desc: 'Aromatic layered rice' },
  { id: 'm5', name: 'Gulab Jamun', price: 60, desc: 'Sweet dessert' },
];

function OrderForm() {
  const [name, setName] = useState('');
  const [quantities, setQuantities] = useState({});
  const [success, setSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateQty = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = current + delta;
      return { ...prev, [id]: next < 0 ? 0 : next };
    });
  };

  const total = MENU.reduce((sum, item) => sum + (item.price * (quantities[item.id] || 0)), 0);

  const submitOrder = async (e) => {
    e.preventDefault();
    const items = MENU.filter(item => quantities[item.id] > 0).map(item => ({
      name: item.name,
      price: item.price,
      quantity: quantities[item.id]
    }));

    if (items.length === 0 || !name.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/orders', { customerName: name, items, totalAmount: total });
      setCreatedOrderId(res.data._id);
      setSuccess(true);
      setName('');
      setQuantities({});
    } catch (err) {
      setError('Something went wrong, please try again');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success && createdOrderId) {
    return (
      <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center text-center animate-fade-in max-w-2xl mx-auto">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full animate-pulse-ring"></div>
          <CheckCircle className="w-20 h-20 text-green-500 relative z-10 bg-white rounded-full" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Order Confirmed!</h2>
        <p className="text-slate-500 mb-4">Your delicious food is being prepared shortly.</p>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6 w-full max-w-md">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Your Order ID</p>
          <p className="font-mono text-sm font-bold text-slate-700 select-all mt-1">{createdOrderId}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link to={`/track/${createdOrderId}`} className="px-6 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20 text-center">
            Track Order Status
          </Link>
          <button onClick={() => { setSuccess(false); setCreatedOrderId(''); }} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors">
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Menu Area */}
      <div className="flex-1 space-y-6">
        <div className="glass p-6 rounded-2xl animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-orange-500" />
            Menu
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {MENU.map(item => (
              <div key={item.id} className="border border-slate-100 p-4 rounded-xl hover:shadow-md transition-shadow bg-white/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <span className="font-bold text-orange-500">₹{item.price}</span>
                </div>
                <div className="flex items-center gap-3 mt-4 bg-slate-50 w-fit rounded-lg p-1">
                  <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded hover:shadow-sm transition-all text-slate-600"><Minus className="w-4 h-4" /></button>
                  <span className="font-medium w-4 text-center text-sm">{quantities[item.id] || 0}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded hover:shadow-sm transition-all text-orange-500"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout Sidebar */}
      <div className="w-full md:w-80 lg:w-96">
        <div className="glass p-6 rounded-2xl sticky top-24 animate-fade-in">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Cart Checkout</h3>
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-start gap-2 font-medium">
              <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submitOrder} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. John Doe" required />
            </div>
            
            <div className="border-t border-b border-slate-100 py-4 my-4 space-y-2 max-h-[30vh] overflow-y-auto">
              {MENU.map(item => quantities[item.id] ? (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600">{quantities[item.id]}x {item.name}</span>
                  <span className="font-medium text-slate-800">₹{item.price * quantities[item.id]}</span>
                </div>
              ) : null)}
              {total === 0 && <p className="text-sm text-slate-400 text-center italic py-2">Cart is empty</p>}
            </div>

            <div className="flex justify-between items-center pb-4">
              <span className="font-medium text-slate-600">Total to pay</span>
              <span className="text-2xl font-bold text-slate-800">₹{total}</span>
            </div>

            <button type="submit" disabled={total === 0 || !name.trim() || loading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-orange-500/30 flex justify-center items-center">
              {loading ? <LoadingSpinner size="sm" /> : 'Confirm Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OrderForm;
