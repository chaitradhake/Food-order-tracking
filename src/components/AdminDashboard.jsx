import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Activity, Clock, CheckCircle, Package } from 'lucide-react';
import api from '../api';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/admin/login');
      }
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings/auto-update');
      setAutoUpdate(res.data.enabled);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchSettings();
    const interval = setInterval(fetchOrders, 3000); // UI poll matches 3s loop
    return () => clearInterval(interval);
  }, []);

  const toggleAutoUpdate = async () => {
    try {
      const res = await api.post('/settings/auto-update', { enabled: !autoUpdate });
      setAutoUpdate(res.data.enabled);
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const statusColors = {
    'Pending': 'bg-orange-100 text-orange-800 border-orange-200',
    'Preparing': 'bg-blue-100 text-blue-800 border-blue-200',
    'Out for Delivery': 'bg-purple-100 text-purple-800 border-purple-200',
    'Delivered': 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Order Management Tasks</h2>
          <p className="text-slate-500 text-sm">Monitor and update customer orders</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleAutoUpdate}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
              autoUpdate ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Activity className="w-4 h-4" />
            Auto-Updates: {autoUpdate ? 'ON' : 'OFF'}
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map(order => (
          <div key={order._id} className="glass p-6 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-800">{order.customerName}</h3>
                <span className={`text-xs font-bold px-3 py-1 border rounded-full ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-6">
                {order.items.map((item, idx) => (
                   <div key={idx} className="flex justify-between text-sm">
                     <span className="text-slate-600">{item.quantity}x {item.name}</span>
                     <span className="font-medium text-slate-800">₹{item.price}</span>
                   </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-500">Total Amount</span>
                <span className="text-lg font-bold text-slate-800">₹{order.total}</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-500 mb-1">Manual Override Options:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleStatusChange(order._id, 'Pending')} className="text-xs py-1.5 px-2 bg-slate-50 hover:bg-orange-50 text-slate-600 rounded border border-slate-200 transition-colors">Pending</button>
                  <button onClick={() => handleStatusChange(order._id, 'Preparing')} className="text-xs py-1.5 px-2 bg-slate-50 hover:bg-blue-50 text-slate-600 rounded border border-slate-200 transition-colors">Preparing</button>
                  <button onClick={() => handleStatusChange(order._id, 'Out for Delivery')} className="text-xs py-1.5 px-2 bg-slate-50 hover:bg-purple-50 text-slate-600 rounded border border-slate-200 transition-colors">Out for Delivery</button>
                  <button onClick={() => handleStatusChange(order._id, 'Delivered')} className="text-xs py-1.5 px-2 bg-slate-50 hover:bg-green-50 text-slate-600 rounded border border-slate-200 transition-colors">Delivered</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
