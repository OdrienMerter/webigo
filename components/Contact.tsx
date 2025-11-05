import React, { useRef, useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';

const Contact: React.FC = () => {
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
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    window.location.hash = hash;
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <div ref={ref} className="container mx-auto px-6 text-center">
        <SectionTitle>Un Projet en Tête ?</SectionTitle>
        <p className={`text-xl md:text-2xl font-semibold text-gray-300 max-w-3xl mx-auto mb-12 transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          Nous sommes prêts à transformer votre idée en une réalité digitale percutante. Cliquez ci-dessous pour nous décrire votre projet et obtenir une estimation gratuite.
        </p>
        <div className={`transition-all duration-700 ease-out delay-200 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <a 
              href="/#/devis"
              onClick={(e) => handleNavClick(e, '/devis')}
              className="inline-block px-10 py-4 bg-indigo-600 text-white font-bold rounded-full transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transform hover:scale-105 text-lg"
            >
              Demander un Devis Gratuit
            </a>
        </div>
        
         <div className={`mt-16 text-center text-gray-400 border-t border-gray-700/50 pt-8 max-w-xl mx-auto transition-opacity duration-700 delay-300 ${inView ? 'opacity-100' : 'opacity-0'}`}>
            <p>
              Pour toute question rapide, vous pouvez aussi nous contacter directement :
              <br className="sm:hidden"/>
              <a href="mailto:contact@webigo.fr" className="text-indigo-400 hover:underline ml-2">contact@webigo.fr</a>
              <span className="mx-2 hidden sm:inline">·</span>
              <a href="tel:+33123456789" className="text-indigo-400 hover:underline">+33 1 23 45 67 89</a>.
            </p>
          </div>
      </div>
    </section>
  );
};

export default Contact;
