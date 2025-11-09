import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Offers from './components/Offers';
import Quote from './components/Quote';
import Projects from './components/Projects';

const App: React.FC = () => {
  const parseHash = () => {
    const hash = window.location.hash.replace(/^#\//, '');
    const [page, queryString] = hash.split('?');
    const query = new URLSearchParams(queryString);
    return { page: page || 'home', query };
  };

  const [location, setLocation] = useState(parseHash());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    const handleHashChange = () => {
      const newLocation = parseHash();
      setLocation(newLocation);

      if (['offres', 'devis', 'projets'].includes(newLocation.page)) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(newLocation.page);
        if(element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (newLocation.page === 'home' || newLocation.page === '') {
          window.scrollTo({top: 0, behavior: 'smooth'});
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // On initial load, if the hash points to a section, scroll to it.
    // Otherwise, ensure we're at the top.
    const initialLocation = parseHash();
    if (initialLocation.page && !['home', 'offres', 'devis', 'projets'].includes(initialLocation.page)) {
      setTimeout(() => {
        const element = document.getElementById(initialLocation.page);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }


    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleOfferSelection = (offerTitle: string) => {
    window.location.hash = `/devis?offre=${encodeURIComponent(offerTitle)}`;
  };
  
  const renderPage = () => {
    switch (location.page) {
      case 'offres':
        return <Offers onOfferSelect={handleOfferSelection} />;
      case 'projets':
        return <Projects isPage={true} />;
      case 'devis':
        return <Quote selectedOffer={location.query.get('offre')} />;
      case 'home':
      default:
        // For 'home' and all section links like 'services', etc.
        return <HomePage isMenuOpen={isMenuOpen} />;
    }
  };

  return (
    <div className="bg-transparent min-h-screen">
      <Header currentPage={location.page} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main>
        {renderPage()}
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3 rounded-full bg-indigo-600 text-white shadow-lg transition-all duration-300 hover:bg-indigo-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 z-50 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Retour en haut de la page"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};


const Footer: React.FC = () => {
  const navLinks = [
    { page: 'a-propos', label: 'À Propos' },
    { page: 'services', label: 'Services' },
    { page: 'projets', label: 'Projets' },
    { page: 'offres', label: 'Offres' },
    { page: 'devis', label: 'Devis Gratuit' },
  ];

  return (
    <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-indigo-500/20 py-12 text-gray-400">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Webigo</h3>
            <p>Créons ensemble votre présence en ligne.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.page}>
                  <a href={`/#/${link.page}`} onClick={(e) => { e.preventDefault(); window.location.hash = `/${link.page}`; }} className="hover:text-indigo-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
            <p>Email: <a href="mailto:contact@webigo.fr" className="hover:text-indigo-400 transition-colors">contact@webigo.fr</a></p>
            <p>Téléphone: <a href="tel:+33123456789" className="hover:text-indigo-400 transition-colors">+33 6 50 85 63 25</a></p>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-gray-700/50 text-center">
          <p>&copy; {new Date().getFullYear()} Webigo. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default App;