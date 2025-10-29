import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Offers from './components/Offers';

const App: React.FC = () => {
  const getPageFromHash = () => window.location.hash.replace(/^#\//, '') || 'home';

  const [page, setPage] = useState(getPageFromHash());
  const [isMenuOpen, setIsMenuОpen] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    const handleHashChange = () => {
      const newPage = getPageFromHash();
      // If navigating to a section on the main page, scroll to it.
      // The component will re-render to show HomePage if needed.
      const element = document.getElementById(newPage);
      if(element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (newPage === '' || newPage === 'home') {
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
      setPage(newPage);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // On initial load, if the hash points to a section, scroll to it.
    const initialPage = getPageFromHash();
    if (initialPage && initialPage !== 'offres') {
        // Use a timeout to ensure the component has rendered before scrolling
        setTimeout(() => {
            const element = document.getElementById(initialPage);
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

  const isHomePageSection = (p: string) => !['offres'].includes(p);

  return (
    <div className="bg-transparent min-h-screen">
      <Header currentPage={page} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuОpen} />
      <main>
        {isHomePageSection(page) ? <HomePage isMenuOpen={isMenuOpen} /> : <Offers />}
      </main>
      <Footer />
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-indigo-500/20 py-6 text-center text-gray-400">
      <p>&copy; {new Date().getFullYear()} Webigo. Tous droits réservés.</p>
    </footer>
  );
}

export default App;