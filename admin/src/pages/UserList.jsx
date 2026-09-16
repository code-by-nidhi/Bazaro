import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Loader from '../components/common/Loader';
import { getAllUsersAdminApi, toggleUserStatusAdminApi } from '../services/adminApi';
import { formatDate } from '../utils/currencyFormatter';
import { UserCheck, UserX, Shield } from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await getAllUsersAdminApi();
      if (data.success) setUsers(data.users || []);
    } catch (error) {
      console.warn('[User List Fetch Warning]:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id, userName) => {
    try {
      const res = await toggleUserStatusAdminApi(id);
      if (res.success) {
        setMsg(res.message);
        fetchUsers();
      }
    } catch (error) {
      setMsg(error.response?.data?.message || 'Status toggle failed.');
    }
  };

  return (
    <AdminLayout title="Customer & User Management">
      <div className="space-y-6">
        {msg && <p className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold rounded-xl">{msg}</p>}

        <div className="bg-white border border-slate-200 rounded-3xl overflow-x-auto shadow-xs">
          {loading ? (
            <Loader text="Loading user database..." />
          ) : (
            <table className="w-full min-w-[760px] text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((usr) => (
                  <tr key={usr._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={usr.avatar?.url} alt={usr.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                      <span className="font-bold text-slate-900">{usr.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{usr.email}</td>
                    <td className="py-3 px-4 text-slate-600">{usr.phone || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        usr.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {usr.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        usr.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {usr.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {usr.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleStatus(usr._id, usr.name)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            usr.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {usr.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserList;
