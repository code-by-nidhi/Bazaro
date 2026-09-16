import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Phone, MapPin, PackageCheck, Heart, Edit3, ShieldAlert } from 'lucide-react';

const Profile = () => {
  const { user, isAdmin } = useAuth();

  return (
    <MainLayout>
      <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black font-heading">My Profile</h1>
            <p className="text-xs text-slate-400 mt-1">Manage your account information and saved delivery preferences.</p>
          </div>
          <Link
            to="/profile/edit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
          >
            <Edit3 size={14} /> Edit Profile
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        {/* Profile Details Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user?.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80'}
            alt={user?.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-md"
          />
          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              {isAdmin && (
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-full">
                  Admin Privileges
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail size={14} className="text-slate-400" /> {user?.email}
            </p>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
              <Phone size={14} className="text-slate-400" /> {user?.phone || 'No phone number provided'}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/my-orders"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <PackageCheck size={16} /> My Orders
            </Link>
            <Link
              to="/wishlist"
              className="px-4 py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <Heart size={16} /> Saved Items
            </Link>
          </div>
        </div>

        {/* Saved Addresses Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <MapPin size={18} className="text-indigo-600" /> Saved Shipping Addresses
            </h3>
            <Link to="/addresses" className="text-xs font-bold text-indigo-600 hover:underline">
              Manage Addresses
            </Link>
          </div>

          {user?.addresses?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.map((addr, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{addr.fullName} ({addr.phone})</span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No saved addresses yet.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
