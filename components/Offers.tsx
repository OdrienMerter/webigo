import React, { useRef, useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';

const offers = [
  {
    title: 'Site Vitrine Essentiel',
    price: 'À partir de 800€',
    description: 'La solution parfaite pour marquer votre présence en ligne avec un site professionnel et moderne.',
    features: [
      'Design sur mesure (1 maquette)',
      'Jusqu\'à 5 pages (Accueil, Services, etc.)',
      'Adaptatif (Mobiles & Tablettes)',
      'Formulaire de contact',
      'Optimisation SEO de base',
      'Mise en ligne et configuration',
    ],
    cta: 'Choisir cette offre',
    highlight: false,
  },
  {
    title: 'Solution Performance',
    price: 'À partir de 1500€',
    description: 'Pour les entreprises qui visent la croissance avec des fonctionnalités avancées et une visibilité accrue.',
    features: [
      'Tout de l\'offre Essentiel',
      'Jusqu\'à 10 pages',
      'Système de gestion de contenu (CMS)',
      'Blog ou section actualités',
      'Optimisation SEO avancée',
      'Intégration de services tiers (RDV, Avis)',
    ],
    cta: 'Opter pour la performance',
    highlight: true,
  },
  {
    title: 'Projet Sur Mesure',
    price: 'Devis personnalisé',
    description: 'Une application web ou un site e-commerce complexe ? Nous donnons vie à vos idées les plus ambitieuses.',
    features: [
      'Analyse approfondie de vos besoins',
      'Développement d\'application web',
      'Plateforme e-commerce complète',
      'Espace membre et fonctionnalités complexes',
      'API sur mesure',
      'Accompagnement et stratégie digitale',
    ],
    cta: 'Demander un devis',
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
                flex flex-col rounded-lg p-8 border transition-all duration-500 ease-out h-full transform
                ${offer.highlight
                    ? 'bg-gray-800/80 border-indigo-500 shadow-2xl shadow-indigo-500/20 lg:scale-105 hover:shadow-indigo-500/30 hover:-translate-y-1'
                    : 'bg-gray-900/60 border-gray-700 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 hover:scale-[1.02]'
                }
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <h3 className="text-2xl font-bold text-white">{offer.title}</h3>
            <p className="mt-2 text-indigo-400 font-semibold text-xl">{offer.price}</p>
            <p className="mt-4 text-gray-400 flex-grow">{offer.description}</p>
            <ul className="mt-6 space-y-3">
                {offer.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                    </li>
                ))}
            </ul>
            <button
                onClick={handleSelect}
                className={`
                mt-8 block w-full text-center px-6 py-3 font-bold rounded-full transition-all duration-300 transform hover:scale-105
                ${offer.highlight
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]'
                    : 'text-indigo-300 bg-transparent border-2 border-indigo-500 hover:bg-indigo-500/20'
                }
            `}>
                {offer.cta}
            </button>
        </div>
    );
};


const Offers: React.FC<OffersProps> = ({ onOfferSelect }) => {
  return (
    <section id="offres" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <SectionTitle>Nos Offres & Tarifs</SectionTitle>
        <p className="text-center text-xl md:text-2xl font-semibold text-gray-300 max-w-3xl mx-auto mb-16">
          Des solutions transparentes et adaptées à chaque étape de votre projet. Choisissez la formule qui vous correspond ou contactez-nous pour un devis sur mesure.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4 items-stretch">
          {offers.map((offer, index) => (
            <PricingCard key={index} offer={offer} index={index} onOfferSelect={onOfferSelect} />
          ))}
        </div>
        <div className="mt-16 text-center">
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
    </section>
  );
};

export default Offers;