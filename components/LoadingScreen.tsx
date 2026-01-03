
import React, { useEffect, useState } from 'react';

const messages = [
  "Mapping the soul of India...",
  "Consulting regional experts...",
  "Uncovering hidden gems...",
  "Preparing your itinerary...",
  "Exploring the local flavors...",
  "Finding ancient stories..."
];

const LoadingScreen: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-8"></div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">YAXTRA Intelligence Engine</h2>
      <p className="text-slate-500 font-medium transition-all duration-500">
        {messages[msgIndex]}
      </p>
      
      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <div className="flex gap-2">
          {messages.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${i === msgIndex ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
