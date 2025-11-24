
import React, { useRef, useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';

const offers = [
  {
    title: 'Site Vitrine',
    price: 'dès 800€',
    description: 'Idéal pour démarrer votre présence en ligne.',
    features: [
      'Design sur mesure',
      '5 pages incluses',
      'Mobile Friendly',
      'Formulaire contact',
      'SEO de base',
    ],
    cta: 'Choisir',
    highlight: false,
  },
  {
    title: 'Performance',
    price: 'dès 1500€',
    description: 'Pour booster votre croissance et visibilité.',
    features: [
      'Tout de l\'offre Vitrine',
      'Jusqu\'à 10 pages',
      'CMS (Gestion facile)',
      'Blog / Actualités',
      'SEO Avancé',
    ],
    cta: 'Recommandé',
    highlight: true,
  },
  {
    title: 'Sur Mesure',
    price: 'Sur devis',
    description: 'Pour les projets complexes et ambitieux.',
    features: [
      'Audit complet',
      'App Web / SaaS',
      'E-commerce',
      'Fonctions avancées',
      'Suivi dédié',
    ],
    cta: 'Contacter',
    highlight: false,
  },
];

interface OffersProps {
  onOfferSelect: (offerTitle: string) => void;
}

const PricingCard: React.FC<{ offer: typeof offers[0], index: number, onOfferSelect: (offerTitle: string) => void }> = ({ offer, index, onOfferSelect }) => {
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

    const handleSelect = () => {
        onOfferSelect(offer.title);
    };

    return (
        <div
            ref={ref}
            className={`
                min-w-full md:min-w-0 snap-center
                flex flex-col rounded-xl p-6 md:p-8 border transition-all duration-500 ease-out h-full transform
                ${offer.highlight
                    ? 'bg-gray-800/90 border-indigo-500 shadow-2xl shadow-indigo-500/20 lg:scale-105'
                    : 'bg-gray-900/60 border-gray-700'
                }
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="mb-4">
                <h3 className="text-xl md:text-2xl font-bold text-white">{offer.title}</h3>
                <p className="text-indigo-400 font-bold text-lg md:text-xl mt-1">{offer.price}</p>
            </div>
            
            <p className="text-gray-400 text-sm md:text-base flex-grow mb-6">{offer.description}</p>
            
            <ul className="space-y-3 mb-8">
                {offer.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm md:text-base">
                        <svg className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                    </li>
                ))}
            </ul>
            
            <button
                onClick={handleSelect}
                className={`
                mt-auto block w-full text-center px-6 py-3 font-bold rounded-lg transition-all duration-300
                ${offer.highlight
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/30'
                    : 'text-indigo-300 bg-gray-800 border border-indigo-500/30 hover:bg-indigo-500/10'
                }
            `}>
                {offer.cta}
            </button>
        </div>
    );
};


const Offers: React.FC<OffersProps> = ({ onOfferSelect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1); // Default to Performance (index 1)

  useEffect(() => {
    // Scroll to the "Performance" offer on mobile load
    if (scrollRef.current) {
        // Un petit délai pour s'assurer que le rendu est terminé
        setTimeout(() => {
            if(scrollRef.current) {
                const itemWidth = scrollRef.current.offsetWidth;
                scrollRef.current.scrollTo({
                    left: 1 * itemWidth, // Index 1 is Performance
                    behavior: 'auto' // Instantané au chargement
                });
            }
        }, 100);
    }
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
        const { scrollLeft, offsetWidth } = scrollRef.current;
        const newIndex = Math.round(scrollLeft / offsetWidth);
        setActiveIndex(Math.max(0, Math.min(newIndex, offers.length - 1)));
    }
  };

  const scrollToOffer = (index: number) => {
      if (scrollRef.current) {
          const itemWidth = scrollRef.current.offsetWidth;
          scrollRef.current.scrollTo({
              left: index * itemWidth,
              behavior: 'smooth'
          });
      }
  };

  return (
    <section id="offres" className="py-16 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle>Nos Offres</SectionTitle>
        <p className="text-center text-base md:text-xl font-medium text-gray-400 max-w-2xl mx-auto mb-10 md:mb-16">
          Des solutions claires, sans coûts cachés.
        </p>
        
        {/* Horizontal Scroll Container for Mobile - Full Width Items
            Retrait de touch-pan-y et snap-always pour un scroll natif fonctionnel
        */}
        <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-0 pb-8 md:grid md:grid-cols-3 md:gap-4 md:items-stretch md:overflow-visible hide-scrollbar"
        >
          {offers.map((offer, index) => (
            <div key={index} className="w-full flex-shrink-0 md:w-auto px-2 md:px-0 snap-center">
                 <PricingCard offer={offer} index={index} onOfferSelect={onOfferSelect} />
            </div>
          ))}
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex justify-center gap-2 -mt-4 mb-8 md:hidden">
            {offers.map((_, index) => (
                <button
                    key={index}
                    onClick={() => scrollToOffer(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                        index === activeIndex 
                        ? 'w-8 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' 
                        : 'w-2 bg-gray-700'
                    }`}
                    aria-label={`Voir l'offre ${offers[index].title}`}
                />
            ))}
        </div>

        <div className="md:mt-12 text-center hidden md:block">
          <a href="/#/" 
             onClick={(e) => {
                e.preventDefault();
                window.location.hash = '/';
             }}
             className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
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

export default Offers;
