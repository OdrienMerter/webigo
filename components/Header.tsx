import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';

interface NavLink {
    label: string;
    page?: string;
    isSpecial?: boolean;
    isDropdown?: boolean;
    subLinks?: { page: string; label: string }[];
}

interface HeaderProps {
  currentPage: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, isMenuOpen, setIsMenuOpen }) => {
  const navLinks: NavLink[] = [
    { 
        label: 'Qui sommes-nous', 
        isDropdown: true,
        subLinks: [
          { page: 'a-propos', label: 'À Propos' },
          { page: 'services', label: 'Nos Services' }
        ] 
    },
    { page: 'projets', label: 'Nos Projets' },
    { page: 'offres', label: 'Nos Offres' },
    { page: 'devis', label: 'Devis Gratuit', isSpecial: true },
  ];
  
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState<string | null>(null);
  const dropdownTimer = useRef<number | null>(null);

  const handleTriggerEnter = (label: string) => {
    if (dropdownTimer.current) {
      clearTimeout(dropdownTimer.current);
    }
    setOpenDropdown(label);
  };

  const handleTriggerLeave = () => {
    dropdownTimer.current = window.setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  useEffect(() => {
    const standalonePages = ['offres', 'devis', 'projets'];
    const allSectionIds = navLinks.flatMap(link => 
        link.isDropdown ? link.subLinks!.map(sl => sl.page) : [link.page!]
    ).filter(Boolean);

    const sections = ['hero', ...allSectionIds];
    
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

    if (!standalonePages.includes(currentPage)) {
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
  }, [currentPage]);

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
    setOpenMobileSubMenu(null);
  };

  const getIsActive = (page: string) => {
    const standalonePages = ['offres', 'devis', 'projets'];
    if (standalonePages.includes(currentPage)) {
      return currentPage === page;
    }
    return activeSection === page;
  };

  const isParentActive = (link: NavLink) => {
    if (!link.isDropdown) return false;
    // The parent is active if a sub-link is active, or if the main "home" section (hero) is active.
    return getIsActive('hero') || link.subLinks!.some(subLink => getIsActive(subLink.page));
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/80 backdrop-blur-md shadow-lg shadow-indigo-500/10' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <a href="/#/" onClick={(e) => handleNavClick(e, '/')} className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-white drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]">
            <Logo className="h-10 w-10" />
            Webigo
          </a>
          
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                const isActive = isParentActive(link);
                return (
                  <div key={link.label} className="relative" onMouseEnter={() => handleTriggerEnter(link.label)} onMouseLeave={handleTriggerLeave}>
                     <a href="/#/" onClick={(e) => handleNavClick(e, '/')} className={`flex items-center px-2 lg:px-4 py-2 rounded-md text-base lg:text-lg transition-all duration-300 drop-shadow-[0_0_3px_rgba(139,92,246,0.4)] ${ isActive ? 'text-white bg-indigo-500/20 font-semibold' : 'text-gray-300 hover:text-indigo-300 hover:bg-gray-700/50'}`}>
                        {link.label}
                        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                     </a>
                     {openDropdown === link.label && (
                         <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 pb-2 w-48 bg-gray-800/90 backdrop-blur-md rounded-md shadow-lg border border-indigo-500/20">
                            {link.subLinks?.map(subLink => (
                                <a key={subLink.page} href={`/#/${subLink.page}`} onClick={(e) => handleNavClick(e, `/${subLink.page}`)} className={`block px-4 py-2 text-md transition-colors duration-200 ${getIsActive(subLink.page) ? 'text-indigo-300 font-semibold' : 'text-gray-300 hover:bg-indigo-500/20'}`}>
                                    {subLink.label}
                                </a>
                            ))}
                         </div>
                     )}
                  </div>
                );
              }
              const isActive = getIsActive(link.page!);
              if (link.isSpecial) {
                   return (
                     <a key={link.page} href={`/#/${link.page}`} onClick={(e) => handleNavClick(e, `/${link.page}`)} className={`px-3 lg:px-6 py-2 rounded-full text-base lg:text-lg transition-all duration-300 font-semibold border-2 ${ isActive ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.7)]' : 'text-indigo-300 border-indigo-500 hover:bg-indigo-500/20 hover:text-white'}`}>
                      {link.label}
                    </a>
                   );
                }
                return (
                <a key={link.page} href={`/#/${link.page}`} onClick={(e) => handleNavClick(e, `/${link.page}`)} className={`px-2 lg:px-4 py-2 rounded-md text-base lg:text-lg transition-all duration-300 drop-shadow-[0_0_3px_rgba(139,92,246,0.4)] ${ isActive ? 'text-white bg-indigo-500/20 font-semibold' : 'text-gray-300 hover:text-indigo-300 hover:bg-gray-700/50'}`}>
                  {link.label}
                </a>
              );
            })}
          </div>
          
          <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-200 hover:text-indigo-400 focus:outline-none focus:text-indigo-400" aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}>
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">{isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}</svg>
              </button>
          </div>

          <div className="hidden md:block w-20 lg:w-32"></div>
        </nav>
      </header>

      <div className={`md:hidden fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-md transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-modal="true" aria-hidden={!isMenuOpen}>
        <div className="flex flex-col items-center justify-center h-full">
          {navLinks.map((link, index) => (
            <React.Fragment key={link.label}>
              {link.isSpecial ? (
                <a href={`/#/${link.page}`} onClick={(e) => handleNavClick(e, `/${link.page}`)} className={`px-8 py-3 my-4 rounded-full text-2xl transition-all duration-300 font-semibold ${ getIsActive(link.page!) ? 'bg-indigo-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.7)]' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                  {link.label}
                </a>
              ) : link.isDropdown ? (
                <div className="text-center">
                    <button onClick={() => setOpenMobileSubMenu(openMobileSubMenu === link.label ? null : link.label)} className={`flex items-center text-3xl font-medium transition-all duration-300 transform hover:scale-105 py-4 ${ isParentActive(link) ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.7)]' : 'text-gray-300 hover:text-indigo-400'}`}>
                        {link.label}
                        <svg className={`w-6 h-6 ml-2 transition-transform duration-200 ${openMobileSubMenu === link.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openMobileSubMenu === link.label && (
                        <div className="flex flex-col items-center space-y-3 my-2">
                           {link.subLinks?.map(subLink => (
                                <a key={subLink.page} href={`/#/${subLink.page}`} onClick={(e) => handleNavClick(e, `/${subLink.page}`)} className={`text-2xl ${getIsActive(subLink.page) ? 'text-indigo-300' : 'text-gray-400'}`}>
                                    {subLink.label}
                                </a>
                           ))}
                        </div>
                    )}
                </div>
              ) : (
                <a href={`/#/${link.page}`} onClick={(e) => handleNavClick(e, `/${link.page}`)} className={`block text-3xl font-medium transition-all duration-300 transform hover:scale-105 py-4 ${ getIsActive(link.page!) ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.7)]' : 'text-gray-300 hover:text-indigo-400'}`}>
                  {link.label}
                </a>
              )}
              {index < navLinks.length - 1 && <div className="w-40 h-px bg-gray-700/80" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;