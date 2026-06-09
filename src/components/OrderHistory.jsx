import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Calendar, ArrowRight, ShieldAlert, ShoppingBag } from 'lucide-react';
import api from '../api';
import LoadingSpinner from './LoadingSpinner';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      setError('Something went wrong, please try again');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusColors = {
    'Pending': 'bg-orange-100 text-orange-800 border-orange-200',
    'Preparing': 'bg-blue-100 text-blue-800 border-blue-200',
    'Out for Delivery': 'bg-purple-100 text-purple-800 border-purple-200',
    'Delivered': 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="glass p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <History className="w-6 h-6 text-orange-500" />
            Order History
          </h2>
          <p className="text-slate-500 text-sm mt-1">Review all your past and active orders</p>
        </div>
        <Link 
          to="/" 
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-md shadow-orange-500/20"
        >
          New Order
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass p-12 rounded-2xl">
          <LoadingSpinner size="lg" />
          <p className="text-slate-500 text-center mt-2">Loading past orders...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="glass p-8 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="bg-red-50 p-3 rounded-full mb-3">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">{error}</h3>
          <button 
            onClick={fetchOrders}
            className="mt-3 text-orange-500 hover:text-orange-600 font-semibold text-sm underline"
          >
            Retry Fetching
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && orders.length === 0 && (
        <div className="glass p-12 rounded-2xl text-center space-y-4">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">No Orders Placed Yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Looks like you haven't ordered anything yet. Browse our delicious menu and place your first order now!
          </p>
          <Link 
            to="/" 
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            Explore Menu
          </Link>
        </div>
      )}

      {/* Orders List */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map(order => (
            <div 
              key={order._id} 
              className="glass p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:shadow-md transition-shadow border border-white/40"
            >
              {/* Order Metadata and Items */}
              <div className="space-y-3 flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                    #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <span className={`w-fit text-xs font-bold px-2.5 py-0.5 border rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                {/* Customer name */}
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Customer: <span className="text-slate-700 font-bold normal-case">{order.customerName}</span>
                </p>

                {/* Items Summary list - Responsive row style */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-600">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-100 rounded px-2 py-0.5 text-xs">
                      {item.quantity}x {item.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price and Action Button */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100 gap-4">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Total Amount</p>
                  <p className="text-xl font-extrabold text-slate-800">₹{order.totalAmount}</p>
                </div>
                <Link 
                  to={`/track/${order._id}`}
                  className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 font-bold text-sm bg-orange-50 sm:bg-transparent px-3 py-2 sm:p-0 rounded-lg hover:underline transition-all"
                >
                  Track Order
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
