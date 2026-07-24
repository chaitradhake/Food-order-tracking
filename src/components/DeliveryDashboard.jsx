import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle, Package, ShieldAlert } from 'lucide-react';
import api from '../api';
import LoadingSpinner from './LoadingSpinner';

function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await api.get('/delivery/orders');
      setOrders(res.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/delivery/login');
      } else {
        setError('Failed to fetch orders. Please try again.');
      }
      console.error(err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('deliveryToken');
    if (!token) {
      navigate('/delivery/login');
      return;
    }

    fetchOrders(true);

    // Setup periodic polling to keep dashboard up to date
    const interval = setInterval(() => fetchOrders(false), 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleMarkAsDelivered = async (id) => {
    try {
      setError('');
      await api.put(`/delivery/orders/${id}/status`, { status: 'Delivered' });
      // Refresh the orders list immediately on success
      await fetchOrders(false);
    } catch (err) {
      setError('Failed to update status. Please try again.');
      console.error('Status update failed:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('deliveryToken');
    navigate('/delivery/login');
  };

  if (loading) {
    return (
      <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center min-h-[400px] mt-8">
        <LoadingSpinner size="lg" />
        <p className="text-slate-500 mt-2">Loading deliveries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in mt-8">
      {/* Header */}
      <div className="glass p-6 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Delivery Dashboard</h2>
          <p className="text-slate-500 text-sm">Manage your assigned orders and deliveries</p>
        </div>
        <div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors font-semibold text-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-2 font-medium">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No pending deliveries assigned to you.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div key={order._id} className="glass p-6 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{order.customerName}</h3>
                    <p className="font-mono text-[10px] text-slate-400 select-all mt-0.5">{order._id}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-800 border border-purple-200 rounded-full shrink-0">
                    {order.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-600">{item.quantity}x {item.name}</span>
                      <span className="font-medium text-slate-800">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-dashed border-slate-200 pt-2 mt-2 flex justify-between font-bold text-slate-800">
                    <span>Total Amount</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleMarkAsDelivered(order._id)}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Delivered
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeliveryDashboard;
