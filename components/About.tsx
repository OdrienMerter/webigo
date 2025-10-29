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
    <section id="a-propos" className="py-20 md:py-28 bg-black/20">
      <div className="container mx-auto px-6">
        <SectionTitle>À Propos de Webigo</SectionTitle>
        <div ref={ref}>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className={`lg:w-1/2 transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h3 className="text-2xl font-bold text-indigo-400 mb-4">Notre Mission</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Chez Webigo, nous sommes passionnés par la création d'expériences numériques qui transcendent l'ordinaire. Nous croyons que chaque ligne de code et chaque pixel doit servir un objectif : propulser votre entreprise vers l'avenir. Notre mission est de transformer vos idées en réalités digitales percutantes et mémorables.
              </p>
              <h3 className="text-2xl font-bold text-indigo-400 mb-4">Notre Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                Nous aspirons à être à la pointe de l'innovation web, en intégrant les dernières technologies pour construire des sites non seulement beaux et fonctionnels, mais aussi intelligents et évolutifs. Nous visons un web où le design sobre et l'efficacité technique se rencontrent pour créer une synergie parfaite.
              </p>
            </div>
            <div className={`lg:w-1/2 flex justify-center items-center transition-all duration-700 ease-out delay-200 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
               <svg viewBox="0 0 200 200" className="w-64 h-64 md:w-80 md:h-80">
                  <defs>
                      <filter id="w-glow" x="-50%" y="-50%" width="200%" height="200%">
                          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="rgba(167, 139, 250, 0.7)" />
                      </filter>
                  </defs>

                  {/* Outer Circle - Violet */}
                  <circle
                      className="spinning-circle"
                      cx="100" cy="100" r="90"
                      stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" fill="none"
                      strokeDasharray="565.48" strokeDashoffset="565.48"
                      style={{
                          animation: inView ? 'draw-circle 2.5s ease-out forwards, spin-clockwise 10s linear infinite' : 'none',
                          animationDelay: '0.2s, 0.2s'
                      }}
                  />
                  {/* Middle Circle - Indigo */}
                  <circle
                      className="spinning-circle"
                      cx="100" cy="100" r="75"
                      stroke="rgba(99, 102, 241, 0.5)" strokeWidth="2" fill="none"
                      strokeDasharray="471.24" strokeDashoffset="471.24"
                      style={{
                          animation: inView ? 'draw-circle 2s ease-out forwards, spin-counter-clockwise 8s linear infinite' : 'none'
                      }}
                  />
                  {/* Inner Circle - Lighter Violet */}
                  <circle
                      className="spinning-circle"
                      cx="100" cy="100" r="60"
                      stroke="rgba(167, 139, 250, 0.5)" strokeWidth="2" fill="none"
                      strokeDasharray="376.99" strokeDashoffset="376.99"
                       style={{
                          animation: inView ? 'draw-circle 2.2s ease-out forwards, spin-clockwise 12s linear infinite' : 'none',
                          animationDelay: '0.4s, 0.4s'
                       }}
                  />

                  {/* Text 'W' */}
                  <text
                      x="50%" y="54%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      className={`fill-white font-bold transition-opacity duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}
                      style={{ fontSize: '80px', filter: 'url(#w-glow)', transitionDelay: '1s' }}
                  >
                      W
                  </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;