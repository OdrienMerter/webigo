
import React, { useState, useEffect } from 'react';

interface CarouselItem {
  id: number;
  imageUrl: string;
  title: string;
  url: string;
}

interface Carousel3DProps {
  items: CarouselItem[];
  isMenuOpen: boolean;
}

const Carousel3D: React.FC<Carousel3DProps> = ({ items, isMenuOpen }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedItems, setLoadedItems] = useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  
  // États pour le swipe tactile (X et Y pour détecter l'angle)
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [touchEnd, setTouchEnd] = useState<{x: number, y: number} | null>(null);

  const numItems = items.length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNav = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setActiveIndex((prevIndex) => (prevIndex + 1) % numItems);
    } else {
      setActiveIndex((prevIndex) => (prevIndex - 1 + numItems) % numItems);
    }
  };

  // Gestion du Swipe
  const minSwipeDistance = 40; // Seuil réduit pour plus de réactivité

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    
    // Si le mouvement est principalement vertical, on ne fait rien (on laisse scroller la page)
    if (Math.abs(distanceY) > Math.abs(distanceX)) return;

    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNav('next');
    } else if (isRightSwipe) {
      handleNav('prev');
    }
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  }

  const handleImageLoad = (id: number) => {
    setLoadedItems(prev => new Set(prev).add(id));
  };

  const getStyle = (index: number): React.CSSProperties => {
    let offset = index - activeIndex;
    
    // Gérer le bouclage circulaire (wrap-around)
    if (offset > numItems / 2) offset -= numItems;
    if (offset < -numItems / 2) offset += numItems;

    const absOffset = Math.abs(offset);
    
    // On n'affiche que les éléments proches
    const isVisible = absOffset <= 2; 

    // --- LOGIQUE "INTÉRIEUR" (PANORAMIQUE) ---
    // Paramètres adaptatifs Mobile vs Desktop
    const spacingX = isMobile ? 320 : 520; // Plus serré sur mobile
    const zOffset = isMobile ? 100 : 150;  // Profondeur moins agressive sur mobile
    const rotateAngle = isMobile ? 35 : 45; // Rotation plus douce sur mobile
    
    // Rotation : On tourne les éléments vers l'intérieur pour qu'ils regardent l'utilisateur.
    const rotateY = offset * -rotateAngle; 
    
    // Profondeur : Les éléments latéraux s'avancent vers l'utilisateur (Z positif)
    const translateZ = absOffset * zOffset;

    const transform = `
      translateX(${offset * spacingX}px) 
      translateZ(${translateZ}px) 
      rotateY(${rotateY}deg)
    `;

    return {
      transform,
      opacity: isVisible ? 1 : 0,
      zIndex: numItems - absOffset, 
      transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease',
    };
  };

  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-center overflow-visible touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="relative w-[280px] h-[180px] md:w-[480px] md:h-[320px]"
        // Sur mobile, on "recule" un peu la perspective (800px) pour que ça ne paraisse pas trop déformé
        style={{ perspective: isMobile ? '800px' : '1000px', transformStyle: 'preserve-3d' }}
      >
        {items.map((item, index) => {
          const isLoaded = loadedItems.has(item.id);
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Voir le projet ${item.title}`}
              className="block absolute w-full h-full left-0 top-0 border-2 border-indigo-500/30 rounded-lg overflow-hidden shadow-[0_0_25px_rgba(99,102,241,0.2)] bg-gray-900"
              style={getStyle(index)}
              // Empêcher le drag par défaut de l'image qui interfère avec le swipe
              onDragStart={(e) => e.preventDefault()}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => handleImageLoad(item.id)}
              />
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none" 
                   style={{ opacity: index === activeIndex ? 0 : 0.4 }}></div>
            </a>
          );
        })}
      </div>
      
      {/* Contrôles de navigation (Desktop) - Cachés sur mobile pour favoriser le swipe, sauf si besoin */}
      <button
        onClick={() => handleNav('prev')}
        className={`hidden md:block absolute left-0 md:left-[5%] top-1/2 -translate-y-1/2 text-indigo-400 p-2 md:p-3 rounded-full bg-gray-900/50 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-all duration-300 text-xl md:text-2xl z-50 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label="Previous project"
        disabled={isMenuOpen}
      >
        &#x276E;
      </button>
      <button
        onClick={() => handleNav('next')}
        className={`hidden md:block absolute right-0 md:right-[5%] top-1/2 -translate-y-1/2 text-indigo-400 p-2 md:p-3 rounded-full bg-gray-900/50 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-all duration-300 text-xl md:text-2xl z-50 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label="Next project"
        disabled={isMenuOpen}
      >
        &#x276F;
      </button>

      {/* Pagination Dots */}
      <div className={`absolute bottom-2 md:bottom-6 flex gap-2 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex 
                ? 'w-8 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' 
                : 'w-2 bg-gray-700 hover:bg-gray-600'
            }`}
            aria-label={`Aller au projet ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel3D;
