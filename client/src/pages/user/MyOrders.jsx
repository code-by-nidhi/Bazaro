import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Loader from '../../components/common/Loader';
import { getMyOrdersApi } from '../../services/orderApi';
import { formatCurrency, formatDate } from '../../utils/currencyFormatter';
import { Package, ExternalLink, ShieldCheck, Clock } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrdersApi();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.warn('[MyOrders Fetch Warning]:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <MainLayout><Loader fullScreen text="Fetching order history..." /></MainLayout>;

  return (
    <MainLayout>
      <div className="bg-slate-900 text-white py-10 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-black font-heading">My Orders</h1>
          <p className="text-xs text-slate-400 mt-1">Track and manage your past order purchases.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Package size={40} className="mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500">Your order history will appear here after your first checkout.</p>
            <Link to="/shop" className="inline-block px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md">
              Explore Products
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2 text-xs">
                <div>
                  <span className="font-extrabold text-slate-900">Order #{order._id}</span>
                  <span className="block text-[11px] text-slate-400">Placed on {formatDate(order.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    order.orderStatus === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.orderStatus === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.orderStatus}
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-indigo-600 rounded-xl font-bold flex items-center gap-1 text-[11px]"
                  >
                    View Details <ExternalLink size={14} />
                  </Link>
                </div>
              </div>

              {/* Items Thumbnails */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-white" />
                      <div className="text-[11px]">
                        <p className="font-bold text-slate-800 truncate max-w-[120px]">{item.name}</p>
                        <p className="text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Total Amount</span>
                  <span className="text-base font-black text-slate-900 font-heading">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default MyOrders;
