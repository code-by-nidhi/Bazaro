import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import RatingStars from '../components/common/RatingStars';
import { Star, Trash2 } from 'lucide-react';

const ReviewList = () => {
  const [reviews, setReviews] = useState([
    {
      _id: 'rev_1',
      user: { name: 'Alex Johnson' },
      product: { name: 'Organic Himalayan Olive Oil' },
      rating: 5,
      comment: 'Exceptional quality! Fragrant and fresh.',
      createdAt: new Date(),
    },
    {
      _id: 'rev_2',
      user: { name: 'Alex Johnson' },
      product: { name: 'Tailored Oxford Cotton Shirt' },
      rating: 5,
      comment: 'Perfect oxford cotton shirt. Tailored nicely.',
      createdAt: new Date(),
    },
  ]);

  const handleDelete = (id) => {
    setReviews(reviews.filter((r) => r._id !== id));
  };

  return (
    <AdminLayout title="Review Moderation">
      <div className="space-y-6">
        <p className="text-xs text-slate-500">Moderate customer ratings and review comments.</p>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-x-auto shadow-xs">
          <table className="w-full min-w-[760px] text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Review Comment</th>
                <th className="py-3.5 px-4 text-right">Moderate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {reviews.map((rev) => (
                <tr key={rev._id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{rev.user?.name}</td>
                  <td className="py-3 px-4 text-slate-700">{rev.product?.name}</td>
                  <td className="py-3 px-4">
                    <RatingStars rating={rev.rating} showNumber={false} size={14} />
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs">{rev.comment}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleDelete(rev._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReviewList;
