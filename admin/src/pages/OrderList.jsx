import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Loader from '../components/common/Loader';
import Pagination from '../components/common/Pagination';
import { getAllOrdersAdminApi, updateOrderStatusAdminApi } from '../services/adminApi';
import { formatCurrency, formatDate } from '../utils/currencyFormatter';
import { CheckCircle, Truck, PackageCheck, XCircle } from 'lucide-react';
import { showSuccess, showError, confirmAction, getErrorMessage } from '../utils/alerts';

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const STATUS_STYLES = {
  Pending: 'bg-slate-100 text-slate-700',
  Confirmed: 'bg-blue-100 text-blue-800',
  Processing: 'bg-indigo-100 text-indigo-800',
  Shipped: 'bg-purple-100 text-purple-800',
  'Out for Delivery': 'bg-amber-100 text-amber-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrdersAdminApi({ status: statusFilter, page });
      if (data.success) {
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 1);
        setTotalOrders(data.totalOrders || 0);
      }
    } catch (error) {
      showError('Could not load orders', getErrorMessage(error, 'Failed to load orders.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, page]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatusAdminApi(orderId, { orderStatus: newStatus });
      if (res.success) {
        showSuccess('Order updated', `Order #${orderId.slice(-8)} moved to '${newStatus}'.`);
        await fetchOrders();
      }
    } catch (error) {
      showError('Status update failed', getErrorMessage(error, 'Status update failed.'));
    } finally {
      setUpdatingId(null);
    }
  };

  // The one-tap action that makes sense for where the order currently sits.
  const nextActionFor = (status) => {
    switch (status) {
      case 'Pending':
        return { label: 'Accept', next: 'Confirmed', Icon: CheckCircle, style: 'bg-blue-600 hover:bg-blue-700' };
      case 'Confirmed':
        return { label: 'Process', next: 'Processing', Icon: PackageCheck, style: 'bg-indigo-600 hover:bg-indigo-700' };
      case 'Processing':
        return { label: 'Ship', next: 'Shipped', Icon: Truck, style: 'bg-purple-600 hover:bg-purple-700' };
      case 'Shipped':
        return { label: 'Out for Delivery', next: 'Out for Delivery', Icon: Truck, style: 'bg-amber-600 hover:bg-amber-700' };
      case 'Out for Delivery':
        return { label: 'Mark Delivered', next: 'Delivered', Icon: PackageCheck, style: 'bg-emerald-600 hover:bg-emerald-700' };
      default:
        return null;
    }
  };

  const StatusBadge = ({ status }) => (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );

  const QuickActions = ({ ord, stacked = false }) => {
    const action = nextActionFor(ord.orderStatus);
    const canCancel = !['Delivered', 'Cancelled'].includes(ord.orderStatus);
    if (!action && !canCancel) return null;

    return (
      <div className={`flex items-center gap-1.5 ${stacked ? 'flex-wrap' : 'justify-end'}`}>
        {action && (
          <button
            onClick={() => handleStatusUpdate(ord._id, action.next)}
            disabled={updatingId === ord._id}
            className={`px-2.5 py-1.5 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 disabled:opacity-50 ${action.style}`}
          >
            <action.Icon size={13} /> {action.label}
          </button>
        )}
        {canCancel && (
          <button
            onClick={async () => {
              const confirmed = await confirmAction({
                title: 'Cancel this order?',
                text: `Order #${ord._id.slice(-8)} will be marked as cancelled.`,
                confirmButtonText: 'Yes, cancel order',
              });
              if (confirmed) handleStatusUpdate(ord._id, 'Cancelled');
            }}
            disabled={updatingId === ord._id}
            className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 border border-red-200 text-[11px] font-bold rounded-lg transition flex items-center gap-1 disabled:opacity-50"
          >
            <XCircle size={13} /> Cancel
          </button>
        )}
      </div>
    );
  };

  const StatusSelect = ({ ord }) => (
    <select
      value={ord.orderStatus}
      onChange={(e) => handleStatusUpdate(ord._id, e.target.value)}
      disabled={updatingId === ord._id}
      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );

  return (
    <AdminLayout title="Order Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700">Filter by Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Orders</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            <strong className="text-slate-900">{totalOrders}</strong> order{totalOrders === 1 ? '' : 's'} total
          </span>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs">
            <Loader text="Loading customer orders..." />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-10 text-center">
            <p className="text-sm font-bold text-slate-700">No orders found</p>
            <p className="text-xs text-slate-500 mt-1">
              {statusFilter ? `No orders are currently '${statusFilter}'.` : 'Customer orders will appear here.'}
            </p>
          </div>
        ) : (
          <>
            {/* Table view — tablet & desktop */}
            <div className="hidden md:block bg-white border border-slate-200 rounded-3xl overflow-x-auto shadow-xs">
              <table className="w-full min-w-[900px] text-xs text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Order & Date</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Set Status</th>
                    <th className="py-3.5 px-4 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <p className="font-extrabold text-slate-900">#{ord._id.slice(-8).toUpperCase()}</p>
                        <p className="text-[10px] text-slate-400">{formatDate(ord.createdAt)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{ord.user?.name || 'Customer'}</p>
                        <p className="text-[10px] text-slate-400">{ord.user?.email}</p>
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900 whitespace-nowrap">
                        {formatCurrency(ord.totalAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${
                            ord.paymentStatus === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={ord.orderStatus} />
                      </td>
                      <td className="py-3 px-4">
                        <StatusSelect ord={ord} />
                      </td>
                      <td className="py-3 px-4">
                        <QuickActions ord={ord} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card view — phones */}
            <div className="md:hidden space-y-4">
              {orders.map((ord) => (
                <div key={ord._id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-900 text-sm">#{ord._id.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(ord.createdAt)}</p>
                    </div>
                    <StatusBadge status={ord.orderStatus} />
                  </div>

                  <div className="text-xs">
                    <p className="font-bold text-slate-900 truncate">{ord.user?.name || 'Customer'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{ord.user?.email}</p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <span className="font-black text-slate-900 text-sm">{formatCurrency(ord.totalAmount)}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.paymentStatus === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.paymentMethod} ({ord.paymentStatus})
                    </span>
                  </div>

                  <QuickActions ord={ord} stacked />

                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                      Set Status
                    </label>
                    <div className="[&>select]:w-full">
                      <StatusSelect ord={ord} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
      </div>
    </AdminLayout>
  );
};

export default OrderList;
