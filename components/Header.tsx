import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';

interface HeaderProps {
  currentPage: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, isMenuOpen, setIsMenuOpen }) => {
  const navLinks = [
    { page: 'projets', label: 'Nos Projets' },
    { page: 'services', label: 'Nos Services' },
    { page: 'offres', label: 'Nos Offres', isSpecial: true },
    { page: 'a-propos', label: 'À Propos' },
    { page: 'contact', label: 'Nous Contacter' },
  ];
  
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const sections = ['hero', ...navLinks.map(link => link.page).filter(p => p !== 'offres')];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    // Only observe sections if we are on the home page
    if (!['offres'].includes(currentPage)) {
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
    }

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [currentPage]); // Re-run observer logic if the page changes

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }
    return () => {
        document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen]);


  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    window.location.hash = hash;
    setIsMenuOpen(false);
  };

  const getIsActive = (page: string) => {
    // When on the offers page, the user requested no link to be active.
    if (currentPage === 'offres') {
      return false;
    }
    // Otherwise, we are on the home page, so use the scroll position.
    return activeSection === page;
  };


  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/80 backdrop-blur-md shadow-lg shadow-indigo-500/10' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <a href="/#/" onClick={(e) => handleNavClick(e, '/')} className="flex items-center gap-3 text-3xl font-bold text-white drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]">
            <Logo className="h-10 w-10" />
            Webigo
          </a>
          
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-4">
            {navLinks.map((link) => {
              const isActive = getIsActive(link.page);
              if (link.isSpecial) {
                return (
                   <a 
                    key={link.page} 
                    href={`/#/${link.page}`} 
                    onClick={(e) => handleNavClick(e, `/${link.page}`)}
                    className={`px-6 py-2 rounded-full text-lg transition-all duration-300 font-semibold border-2 ${
                      isActive 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.7)]' 
                        : 'text-indigo-300 border-indigo-500 hover:bg-indigo-500/20 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                )
              }
              return (
                <a 
                  key={link.page} 
                  href={`/#/${link.page}`} 
                  onClick={(e) => handleNavClick(e, `/${link.page}`)}
                  className={`px-4 py-2 rounded-md text-lg transition-all duration-300 drop-shadow-[0_0_3px_rgba(139,92,246,0.4)] ${
                    isActive 
                      ? 'text-white bg-indigo-500/20 font-semibold' 
                      : 'text-gray-300 hover:text-indigo-300 hover:bg-gray-700/50'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
          
          <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-200 hover:text-indigo-400 focus:outline-none focus:text-indigo-400"
                aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
          </div>

          <div className="hidden lg:block w-32"></div>
        </nav>
      </header>

      <div 
        className={`
          lg:hidden fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-md
          transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navLinks.map((link) => {
            const isActive = getIsActive(link.page);
            return (
              <a 
                key={link.page} 
                href={`/#/${link.page}`} 
                onClick={(e) => handleNavClick(e, `/${link.page}`)}
                className={`block text-3xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  isActive 
                    ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.7)]' 
                    : 'text-gray-300 hover:text-indigo-400'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Header;