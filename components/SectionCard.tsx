
import React from 'react';

interface SectionCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white rounded-[1.5rem] p-7 shadow-sm border border-slate-100 card-hover transition-all duration-300 flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl shadow-inner border border-slate-100/50">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">{title}</h3>
      </div>
      <div className="flex-1 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
