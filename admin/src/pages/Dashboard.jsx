import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import StatCard from '../components/admin/StatCard';
import Loader from '../components/common/Loader';
import { getDashboardStatsApi } from '../services/adminApi';
import { formatCurrency, formatDate } from '../utils/currencyFormatter';
import {
  Users,
  Package,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStatsApi();
        if (res.success) {
          setData(res);
        }
      } catch (error) {
        console.warn('[Admin Dashboard Stats Error]:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><Loader fullScreen text="Loading analytics metrics..." /></AdminLayout>;

  const stats = data?.stats || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    lowStockProducts: 0,
  };

  const monthlySales = data?.charts?.monthlySales || [];
  const categoryDistribution = data?.charts?.categoryDistribution || [];

  return (
    <AdminLayout title="Executive Overview">
      <div className="space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={IndianRupee}
            color="indigo"
            subtext="Verified Completed Sales"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingBag}
            color="emerald"
            subtext={`${stats.pendingOrders} Orders Pending`}
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            color="amber"
            subtext={`${stats.lowStockProducts} Low Stock Items`}
          />
          <StatCard
            title="Registered Users"
            value={stats.totalUsers}
            icon={Users}
            color="pink"
            subtext="Active Customers"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue & Sales Trend Chart */}
          <div className="lg:col-span-2 bg-white p-6 border border-slate-200 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">Revenue Growth Overview</h3>
                <p className="text-xs text-slate-400">Monthly store revenue progression</p>
              </div>
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <TrendingUp size={20} />
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySales}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution Chart */}
          <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Category Distribution</h3>
              <p className="text-xs text-slate-400">Inventory share across categories</p>
            </div>

            <div className="h-56 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} Products`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              {categoryDistribution.slice(0, 4).map((c, i) => (
                <span key={i} className="flex items-center gap-1 font-semibold text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Low Stock Alert Table */}
          <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={18} /> Low Stock Warnings (&lt;= 5 left)
              </h3>
              <Link to="/products" className="text-xs font-bold text-indigo-600 hover:underline">
                View Products
              </Link>
            </div>

            <div className="space-y-2">
              {data?.lowStockList?.length === 0 ? (
                <p className="text-xs text-slate-500">All products have healthy inventory levels.</p>
              ) : (
                data?.lowStockList?.map((prod) => (
                  <div key={prod._id} className="flex items-center justify-between p-3 bg-amber-50/50 border border-amber-100 rounded-2xl text-xs">
                    <div className="flex items-center gap-3">
                      <img src={prod.images?.[0]?.url} alt={prod.name} className="w-10 h-10 object-cover rounded-xl bg-white" />
                      <div>
                        <p className="font-bold text-slate-900 truncate max-w-[180px]">{prod.name}</p>
                        <p className="text-slate-400 text-[10px]">{prod.sku}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black rounded-lg text-xs">
                      {prod.stock} Left
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-heading">Recent Store Orders</h3>
              <Link to="/orders" className="text-xs font-bold text-indigo-600 hover:underline">
                Manage Orders
              </Link>
            </div>

            <div className="space-y-2">
              {data?.recentOrders?.map((ord) => (
                <div key={ord._id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs">
                  <div>
                    <span className="font-bold text-slate-900">#{ord._id.slice(-6)}</span>
                    <span className="block text-[11px] text-slate-400">{ord.user?.name || 'Customer'}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{formatCurrency(ord.totalAmount)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ord.orderStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
