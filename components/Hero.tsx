import React, { useState, useEffect } from 'react';
import Carousel3D from './Carousel3D';

const projectsData = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Projet Alpha ${i + 1}`,
  imageUrl: `https://picsum.photos/seed/${i + 1}/600/400`,
  url: '#',
}));

const Hero: React.FC = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative text-center overflow-hidden px-4 pt-20">
      
      <h1 className={`text-5xl md:text-7xl font-extrabold text-cyan-400 transition-all duration-700 ease-out ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]`}>
        Webigo
      </h1>
      <p className={`mt-4 text-xl md:text-2xl font-light text-gray-200 transition-all duration-700 ease-out delay-200 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        Créons ensemble votre présence en ligne.
      </p>
      <p className={`text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mt-8 mb-8 transition-all duration-700 ease-out delay-500 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        Des sites vitrines modernes et performants pour les coiffeurs, cliniques, vendeurs automobiles et autres commerces.
      </p>

      <div className="w-full h-[400px] md:h-[600px] flex items-center justify-center">
        <Carousel3D items={projectsData} />
      </div>
      
      <a href="/#/projets" className="mt-12 mb-12 px-8 py-3 bg-cyan-500 text-white font-bold rounded-full transition-all duration-300 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.8)] transform hover:scale-105">
        Voir nos réalisations
      </a>
    </section>
  );
};

export default Hero;