
import React from 'react';

const Logo: React.FC<{ light?: boolean }> = ({ light }) => {
  return (
    <div className="flex items-center gap-2 select-none cursor-pointer">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-2xl ${light ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
        Y
      </div>
      <span className={`text-2xl font-black tracking-tighter ${light ? 'text-white' : 'text-slate-900'}`}>
        YAXTRA
      </span>
    </div>
  );
};

export default Logo;
