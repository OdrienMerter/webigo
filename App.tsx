import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';

const App: React.FC = () => {
  const getPageFromHash = () => window.location.hash.replace(/^#\//, '') || 'home';

  const [page, setPage] = useState(getPageFromHash());

  useEffect(() => {
    // Prevent the browser from automatically scrolling to the hash on page load.
    // We always want to start at the top of the page.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const handleHashChange = () => {
      const newPage = getPageFromHash();
      const element = document.getElementById(newPage);
      if(element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (newPage === 'home') {
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
      setPage(newPage);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // The initial `page` state is set by `useState` using the hash.
    // This ensures the correct link is highlighted in the header on load.
    // The `handleHashChange` listener will handle all subsequent clicks.

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);


  return (
    <div className="bg-transparent min-h-screen">
      <Header currentPage={page} />
      <main>
          <Hero />
          <Projects />
          <Services />
          <About />
          <Contact />
      </main>
      <Footer />
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-cyan-500/20 py-6 text-center text-gray-400">
      <p>&copy; {new Date().getFullYear()} Webigo. Tous droits réservés.</p>
    </footer>
  );
}

export default App;