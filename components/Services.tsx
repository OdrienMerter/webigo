
import React, { useRef, useState, useEffect } from 'react';
import { CodeIcon, DesignIcon, SeoIcon, MaintenanceIcon } from './ServiceIcons';
import SectionTitle from './SectionTitle';

const services = [
  {
    icon: <CodeIcon />,
    title: 'Développement',
    description: 'Sites vitrines élégants et applications web robustes, optimisés pour tous les appareils.',
  },
  {
    icon: <DesignIcon />,
    title: 'Design UI/UX',
    description: 'Des interfaces intuitives et modernes qui convertissent vos visiteurs en clients fidèles.',
  },
  {
    icon: <SeoIcon />,
    title: 'Référencement',
    description: 'Propulsez votre site en haut des résultats Google et attirez un trafic qualifié.',
  },
  {
    icon: <MaintenanceIcon />,
    title: 'Maintenance',
    description: 'Sécurité, mises à jour et sauvegardes. Dormez tranquille, on gère tout.',
  },
];

const AnimatedServiceCard: React.FC<{ service: typeof services[0] }> = ({ service }) => {
    return (
        <div
            className={`
                w-full md:w-auto min-h-[200px] snap-center
                flex flex-col md:flex-row items-start p-6 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 ease-out
                opacity-100 translate-y-0
            `}
        >
            <div className={`mb-4 md:mb-0 md:mr-6 text-indigo-400`}>
                {service.icon}
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm md:text-base">{service.description}</p>
            </div>
        </div>
    );
};


const Services: React.FC = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const handleScroll = () => {
    if (scrollRef.current) {
        const { scrollLeft, offsetWidth } = scrollRef.current;
        const newIndex = Math.round(scrollLeft / offsetWidth);
        const clampedIndex = Math.max(0, Math.min(newIndex, services.length - 1));
        setActiveIndex(clampedIndex);
    }
  };

  const scrollToService = (index: number) => {
      if (scrollRef.current) {
          const itemWidth = scrollRef.current.offsetWidth;
          scrollRef.current.scrollTo({
              left: index * itemWidth,
              behavior: 'smooth'
          });
      }
  };

  return (
    <section id="services" className="py-16 md:py-28" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle>Nos Services</SectionTitle>
        
        {/* Container with horizontal scroll on mobile - Full Width Logic */}
        <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-0 pb-6 md:grid md:grid-cols-2 md:gap-8 md:pb-0 md:overflow-visible hide-scrollbar"
        >
          {services.map((service, index) => (
             <div key={index} className="w-full flex-shrink-0 md:w-auto px-2 md:px-0 snap-center">
                <AnimatedServiceCard service={service} />
             </div>
          ))}
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex justify-center gap-2 mt-2 md:hidden">
            {services.map((_, index) => (
                <button
                    key={index}
                    onClick={() => scrollToService(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                        index === activeIndex 
                        ? 'w-8 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' 
                        : 'w-2 bg-gray-700'
                    }`}
                    aria-label={`Voir le service ${index + 1}`}
                />
            ))}
        </div>
        
        <div className={`mt-8 md:mt-16 text-center transition-all duration-700 ease-out delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <a 
                  href="/#/offres" 
                  onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = '/offres';
                  }}
                  className="inline-block px-8 py-3 md:px-10 md:py-4 bg-indigo-600 text-white font-bold rounded-full transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transform hover:scale-105 text-base md:text-lg"
              >
                  Voir les Offres
              </a>
          </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Services;
