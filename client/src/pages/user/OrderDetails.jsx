import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Loader from '../../components/common/Loader';
import { getOrderByIdApi } from '../../services/orderApi';
import { formatCurrency, formatDate } from '../../utils/currencyFormatter';
import { PackageCheck, MapPin, CreditCard, ShieldCheck } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await getOrderByIdApi(id);
        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        console.warn('[Order Details Fetch Error]:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) return <MainLayout><Loader fullScreen text="Loading order receipt..." /></MainLayout>;
  if (!order) return <MainLayout><div className="text-center py-20 font-bold">Order not found.</div></MainLayout>;

  return (
    <MainLayout>
      <div className="bg-slate-900 text-white py-10 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Link to="/my-orders" className="hover:underline">Orders</Link> &gt; <span>Receipt</span>
          </div>
          <h1 className="text-3xl font-black font-heading">Order Receipt #{order._id}</h1>
          <p className="text-xs text-slate-400 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        {/* Status Timeline */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Order Status</span>
            <span className="text-lg font-black text-slate-900 font-heading">{order.orderStatus}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Payment Status</span>
            <span className="text-lg font-black text-emerald-600 font-heading">{order.paymentStatus}</span>
          </div>
        </div>

        {/* Itemized Table & Delivery Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-heading border-b border-slate-100 pb-3">Purchased Items</h3>
            <div className="space-y-3">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-white" />
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-slate-400">Qty: {item.quantity} x {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin size={16} className="text-indigo-600" /> Delivery Address
              </h4>
              <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                <p className="font-bold text-slate-900">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.addressLine}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                <p className="text-slate-400 mt-1">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between"><span>Items Price</span><span>{formatCurrency(order.itemsPrice)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>- {formatCurrency(order.discountAmount)}</span></div>
              <div className="flex justify-between"><span>GST (5%)</span><span>{formatCurrency(order.taxPrice)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(order.shippingPrice)}</span></div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span><span className="text-indigo-600">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetails;
