import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, ShieldAlert, CheckCircle, Package, Truck } from 'lucide-react';
import api from '../api';
import LoadingSpinner from './LoadingSpinner';

function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState(id || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (orderId) => {
    if (!orderId || !orderId.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await api.get(`/orders/${orderId.trim()}`);
      setOrder(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Order not found');
      } else {
        setError('Something went wrong, please try again');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setSearchId(id);
      fetchOrder(id);
    }
  }, [id]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/track/${searchId.trim()}`);
    }
  };

  const statusColors = {
    'Pending': 'bg-orange-100 text-orange-800 border-orange-200',
    'Preparing': 'bg-blue-100 text-blue-800 border-blue-200',
    'Out for Delivery': 'bg-purple-100 text-purple-800 border-purple-200',
    'Delivered': 'bg-green-100 text-green-800 border-green-200'
  };

  const statusSteps = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = order ? statusSteps.indexOf(order.status) : -1;

  const getStepIcon = (step, idx) => {
    const isCompleted = idx <= currentStatusIndex;
    const isCurrent = idx === currentStatusIndex;
    
    const iconClass = `w-6 h-6 ${isCompleted ? 'text-white' : 'text-slate-400'}`;
    const containerClass = `w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all ${
      isCurrent ? 'bg-orange-500 ring-4 ring-orange-100 animate-pulse' :
      isCompleted ? 'bg-orange-500' : 'bg-slate-100'
    }`;

    switch (step) {
      case 'Pending':
        return <div className={containerClass}><Clock className={iconClass} /></div>;
      case 'Preparing':
        return <div className={containerClass}><Package className={iconClass} /></div>;
      case 'Out for Delivery':
        return <div className={containerClass}><Truck className={iconClass} /></div>;
      case 'Delivered':
        return <div className={containerClass}><CheckCircle className={iconClass} /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Search Input Box */}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Search className="w-6 h-6 text-orange-500" />
          Track Your Order
        </h2>
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter your Order ID (e.g. 65f1234567890abcdef01234)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            required
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-orange-500/20"
          >
            Track
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass p-8 rounded-2xl flex flex-col items-center justify-center">
          <LoadingSpinner size="lg" />
          <p className="text-slate-500 mt-2">Fetching your order details...</p>
        </div>
      )}

      {/* Error States */}
      {error && (
        <div className="glass p-8 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="bg-red-50 p-4 rounded-full mb-4">
            <ShieldAlert className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{error}</h3>
          {error === 'Order not found' ? (
            <p className="text-slate-500 max-w-md">
              We couldn't find an order with ID <span className="font-semibold text-slate-700">{searchId}</span>. Please verify the ID and try again.
            </p>
          ) : (
            <p className="text-slate-500 max-w-md">
              Please check your network connection or try reloading the page.
            </p>
          )}
        </div>
      )}

      {/* Order Details Panel */}
      {order && !loading && (
        <div className="glass p-6 sm:p-8 rounded-2xl space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Order Reference</p>
              <h3 className="text-lg font-bold text-slate-800 font-mono break-all">{order._id}</h3>
              <p className="text-slate-500 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <span className={`text-sm font-bold px-4 py-1.5 border rounded-full ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>

          {/* Stepper Status Bar */}
          <div className="relative py-4">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 rounded z-0 hidden sm:block"></div>
            
            {/* Active Line Progress */}
            {currentStatusIndex >= 0 && (
              <div 
                className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 rounded z-0 transition-all duration-500 hidden sm:block"
                style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
              ></div>
            )}

            {/* Steps */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 relative z-10">
              {statusSteps.map((step, idx) => {
                const isActive = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;
                return (
                  <div key={step} className="flex sm:flex-col items-center gap-4 sm:gap-2 flex-1 text-left sm:text-center">
                    {getStepIcon(step, idx)}
                    <div>
                      <p className={`font-semibold text-sm ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                        {step}
                      </p>
                      {step === 'Pending' && <p className="text-xs text-slate-400">Order received</p>}
                      {step === 'Preparing' && <p className="text-xs text-slate-400">Kitchen processing</p>}
                      {step === 'Out for Delivery' && <p className="text-xs text-slate-400">On the way</p>}
                      {step === 'Delivered' && <p className="text-xs text-slate-400">Bon appétit!</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer & Items Details - Responsive Flexbox */}
          <div className="flex flex-col md:flex-row gap-6 pt-6 border-t border-slate-100">
            {/* Left Box: Customer Detail */}
            <div className="flex-1 bg-slate-50/50 p-5 rounded-xl border border-slate-100 space-y-4">
              <h4 className="font-bold text-slate-800 text-base">Delivery Details</h4>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Customer Name</p>
                <p className="text-slate-700 font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Address
                </p>
                <p className="text-slate-600 text-sm">Standard Contactless Handout / Table Delivery</p>
              </div>
            </div>

            {/* Right Box: Order Summary */}
            <div className="flex-1 bg-slate-50/50 p-5 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-base mb-3">Order Summary</h4>
                <div className="space-y-2 mb-4 max-h-[150px] overflow-y-auto pr-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-600">{item.quantity}x {item.name}</span>
                      <span className="font-medium text-slate-800">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-200/60 pt-3 flex justify-between items-center">
                <span className="font-bold text-slate-700 text-sm">Total Paid</span>
                <span className="text-xl font-extrabold text-orange-500">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackOrder;
