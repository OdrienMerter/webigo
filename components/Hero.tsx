import React, { useState, useEffect } from 'react';
import Carousel3D from './Carousel3D';

const projectsData = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Projet Alpha ${i + 1}`,
  imageUrl: `https://picsum.photos/seed/${i + 1}/600/400`,
  url: '#',
}));

interface HeroProps {
  isMenuOpen: boolean;
}

const Hero: React.FC<HeroProps> = ({ isMenuOpen }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative text-center overflow-hidden px-4 pt-20">
      
      <h1 className={`text-5xl md:text-7xl font-extrabold text-indigo-300 transition-all duration-700 ease-out ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]`}>
        Webigo
      </h1>
      <p className={`mt-4 text-xl md:text-2xl font-semibold text-gray-200 transition-all duration-700 ease-out delay-200 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        Créons ensemble votre présence en ligne.
      </p>

      <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center my-8">
        <Carousel3D items={projectsData} isMenuOpen={isMenuOpen} />
      </div>
      
      <p className={`text-xl md:text-2xl font-semibold text-gray-200 max-w-3xl mx-auto mb-8 md:mt-12 transition-all duration-700 ease-out delay-500 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        Des sites vitrines modernes et performants pour les coiffeurs, cliniques, vendeurs automobiles et autres commerces.
      </p>

    </section>
  );
};

export default Hero;