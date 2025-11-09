import React, { useRef, useState, useEffect } from 'react';
import { CodeIcon, DesignIcon, SeoIcon, MaintenanceIcon } from './ServiceIcons';
import SectionTitle from './SectionTitle';

const services = [
  {
    icon: <CodeIcon />,
    title: 'Développement sur Mesure',
    description: 'Du site vitrine élégant à l\'application web complexe, nous codons des solutions robustes qui fonctionnent parfaitement sur tous les appareils.',
  },
  {
    icon: <DesignIcon />,
    title: 'Design UI/UX Centré Client',
    description: 'Nous concevons des parcours utilisateurs si intuitifs que vos clients se sentiront immédiatement chez eux, les incitant à passer à l\'action.',
  },
  {
    icon: <SeoIcon />,
    title: 'Référencement SEO Efficace',
    description: 'Nous construisons votre site pour qu\'il soit aimé par Google. Attirez plus de visiteurs qualifiés sans dépenser une fortune en publicité.',
  },
  {
    icon: <MaintenanceIcon />,
    title: 'Maintenance & Tranquillité',
    description: 'Concentrez-vous sur votre métier, nous veillons sur votre site. Mises à jour, sécurité, sauvegardes... votre plateforme reste performante.',
  },
];

const AnimatedServiceCard: React.FC<{ service: typeof services[0], index: number }> = ({ service, index }) => {
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
            { threshold: 0.5 }
        );
        const currentRef = ref.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, []);

    return (
        <div
            ref={ref}
            className={`flex items-start p-6 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-all duration-500 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className={`mr-6 text-indigo-400 ${inView ? 'animate-icon-pulse' : ''}`}>
                {service.icon}
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
            </div>
        </div>
    );
};


const Services: React.FC = () => {
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
      { threshold: 0.1 }
    );
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return (
    <section id="services" className="py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-6">
        <SectionTitle>Nos Services</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <AnimatedServiceCard key={index} service={service} index={index} />
          ))}
        </div>
        <div className={`mt-16 text-center transition-all duration-700 ease-out delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <a 
                  href="/#/offres" 
                  onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = '/offres';
                  }}
                  className="inline-block px-10 py-4 bg-indigo-600 text-white font-bold rounded-full transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transform hover:scale-105 text-lg"
              >
                  Découvrez nos offres
              </a>
          </div>
      </div>
    </section>
  );
};

export default Services;