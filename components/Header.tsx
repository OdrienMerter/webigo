import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';

interface HeaderProps {
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  const navLinks = [
    { page: 'projets', label: 'Nos Projets' },
    { page: 'services', label: 'Nos Services' },
    { page: 'a-propos', label: 'À Propos' },
    { page: 'contact', label: 'Nous Contacter' },
  ];
  
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const sections = ['hero', 'projets', 'services', 'a-propos', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' } // Trigger when section is in the middle of the viewport
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    window.location.hash = hash;
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/80 backdrop-blur-md shadow-lg shadow-cyan-500/10' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <a href="/#/" onClick={(e) => handleNavClick(e, '/')} className="flex items-center gap-3 text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
          <Logo className="h-10 w-10" />
          Webigo
        </a>
        
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-4">
          {navLinks.map((link) => {
            const isActive = activeSection === link.page;
            return (
              <a 
                key={link.page} 
                href={`/#/${link.page}`} 
                onClick={(e) => handleNavClick(e, `/${link.page}`)}
                className={`px-4 py-2 rounded-md text-lg transition-all duration-300 drop-shadow-[0_0_3px_rgba(34,211,238,0.5)] ${
                  isActive 
                    ? 'text-white bg-cyan-500/20 font-semibold' 
                    : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-700/50'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="hidden md:block w-32"></div>
      </nav>
    </header>
  );
};

export default Header;