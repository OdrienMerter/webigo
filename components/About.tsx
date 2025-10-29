import React, { useRef, useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';

const About: React.FC = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return (
    <section id="a-propos" className="py-20 md:py-28 bg-gray-900/50">
      <div className="container mx-auto px-6">
        <SectionTitle>À Propos de Webigo</SectionTitle>
        <div ref={ref} className="flex flex-col lg:flex-row items-center gap-12">
          <div className={`lg:w-1/2 transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Notre Mission</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Chez Webigo, nous sommes passionnés par la création d'expériences numériques qui transcendent l'ordinaire. Nous croyons que chaque ligne de code et chaque pixel doit servir un objectif : propulser votre entreprise vers l'avenir. Notre mission est de transformer vos idées en réalités digitales percutantes et mémorables.
            </p>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Notre Vision</h3>
            <p className="text-gray-300 leading-relaxed">
              Nous aspirons à être à la pointe de l'innovation web, en intégrant les dernières technologies pour construire des sites non seulement beaux et fonctionnels, mais aussi intelligents et évolutifs. Nous visons un web où le design sobre et l'efficacité technique se rencontrent pour créer une synergie parfaite.
            </p>
          </div>
          <div className={`lg:w-1/2 flex justify-center items-center transition-all duration-700 ease-out delay-200 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
             <div className="w-64 h-64 md:w-80 md:h-80 relative">
                <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-full animate-spin" style={{animationDuration: '10s'}}></div>
                <div className="absolute inset-4 border-2 border-pink-500/50 rounded-full animate-spin" style={{animationDuration: '8s', animationDirection: 'reverse'}}></div>
                <div className="absolute inset-8 border-2 border-purple-500/50 rounded-full animate-spin" style={{animationDuration: '12s'}}></div>
                <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                  W
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
