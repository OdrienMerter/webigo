import React, { useRef, useState, useEffect } from 'react';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return (
    <h2
      ref={ref}
      className={`text-3xl md:text-4xl font-bold text-center mb-12 text-white transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
    >
      <span className="relative inline-block">
        {children}
        <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-2/3 h-1 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
      </span>
    </h2>
  );
};

export default SectionTitle;
