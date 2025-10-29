
import React from 'react';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
    <span className="relative inline-block">
      {children}
      <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-2/3 h-1 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
    </span>
  </h2>
);

export default SectionTitle;
