import React, { useRef, useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 drop-shadow-[0_0_5px_rgba(139,92,246,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.47-1.47L12.938 18l1.188-.648a2.25 2.25 0 011.47-1.47L16.25 15l.648 1.188a2.25 2.25 0 011.47 1.47L19.563 18l-1.188.648a2.25 2.25 0 01-1.47 1.47z" />
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 drop-shadow-[0_0_5px_rgba(139,92,246,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

const PartnershipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 drop-shadow-[0_0_5px_rgba(139,92,246,0.6)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.513-.96 1.487-1.594 2.572-1.788m-2.572.662c.58.834 1.689 1.254 2.824 1.254A4.5 4.5 0 0018 9.75a4.5 4.5 0 00-4.5-4.5A4.5 4.5 0 009 9.75a4.5 4.5 0 002.572 4.04m-1.758 2.906a4.5 4.5 0 01-1.758-2.906 4.5 4.5 0 014.5-4.5A4.5 4.5 0 0118 9.75a4.5 4.5 0 01-4.5 4.5A4.5 4.5 0 019 9.75a4.5 4.5 0 01-2.572-4.04m1.758 2.906a4.5 4.5 0 00-1.758 2.906M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const features = [
  {
    icon: <SparklesIcon />,
    title: 'Créativité Sur Mesure',
    description: "Votre commerce est unique, votre site doit l'être aussi. Nous créons des designs qui racontent votre histoire et captivent vos clients, pour que votre salon ne ressemble à aucun autre.",
  },
  {
    icon: <TagIcon />,
    title: 'Budget Maîtrisé',
    description: "La transparence est la base de la confiance. Nous proposons des devis clairs et des tarifs justes pour un investissement sans surprise, entièrement dédié à votre croissance.",
  },
  {
    icon: <PartnershipIcon />,
    title: 'Partenaire de Confiance',
    description: "Plus qu'un prestataire, nous sommes votre allié digital. De la première ébauche à la mise en ligne et au-delà, nous vous écoutons, vous guidons et célébrons vos succès avec vous.",
  },
];

const FeatureCard: React.FC<{ feature: typeof features[0], index: number }> = ({ feature, index }) => {
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
        <div
            ref={ref}
            className={`flex flex-col items-center text-center p-8 bg-gray-900/40 rounded-lg border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-500 ease-out transform hover:-translate-y-2 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            <div className={`mb-6 text-indigo-400 ${inView ? 'animate-icon-pulse' : ''}`}>
                {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
        </div>
    );
};

const WhyChooseUs: React.FC = () => {
  return (
    <section id="pourquoi-nous-choisir" className="py-20 md:py-28 bg-black/20">
      <div className="container mx-auto px-6">
        <SectionTitle>Pourquoi Nous Choisir ?</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;