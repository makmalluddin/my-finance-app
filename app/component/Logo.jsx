import React from 'react';

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg rotate-6 opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-emerald-300 rounded-lg -rotate-6 flex items-center justify-center">
          <span className="text-gray-900 font-bold text-xl">U</span>
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight">
          udin<span className="text-emerald-400">Xplore</span>
        </span>
      </div>
    </div>
  );
};

export default Logo;
