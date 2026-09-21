import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtext }) => {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-200',
    pink: 'bg-pink-500/10 text-pink-600 border-pink-200',
    red: 'bg-red-500/10 text-red-600 border-red-200',
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3 hover:shadow-md transition">
      <div className="min-w-0">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-heading truncate">{value}</h3>
        {subtext && <p className="text-[11px] text-slate-400 mt-1">{subtext}</p>}
      </div>

      <div className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-2xl border flex items-center justify-center ${colorMap[color] || colorMap.indigo}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatCard;
