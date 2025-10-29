
import React, { useState } from 'react';

interface CarouselItem {
  id: number;
  imageUrl: string;
  title: string;
  url: string;
}

interface Carousel3DProps {
  items: CarouselItem[];
}

const Carousel3D: React.FC<Carousel3DProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const numItems = items.length;

  const handleNav = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setActiveIndex((prevIndex) => (prevIndex + 1) % numItems);
    } else {
      setActiveIndex((prevIndex) => (prevIndex - 1 + numItems) % numItems);
    }
  };

  const getStyle = (index: number): React.CSSProperties => {
    let offset = index - activeIndex;
    
    if (offset > numItems / 2) offset -= numItems;
    if (offset < -numItems / 2) offset += numItems;

    const absOffset = Math.abs(offset);
    
    const isVisible = absOffset <= 2; 

    const carouselRadius = 600; 
    const angleIncrement = 40; 
    const scaleReduction = 0.15; 

    const angleRad = (offset * angleIncrement * Math.PI) / 180;
    const translateX = carouselRadius * Math.sin(angleRad);
    const translateZ = carouselRadius * (1 - Math.cos(angleRad));

    const transform = `
      translateX(${translateX}px) 
      translateZ(-${translateZ}px) 
      scale(${1 - absOffset * scaleReduction})
    `;

    return {
      transform,
      opacity: isVisible ? 1 : 0,
      zIndex: numItems - absOffset,
      transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
    };
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="relative w-[300px] h-[200px] md:w-[480px] md:h-[320px]"
        style={{ perspective: '1800px', transformStyle: 'preserve-3d' }}
      >
        {items.map((item, index) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Voir le projet ${item.title}`}
            className="block absolute w-full h-full left-0 top-0 border-2 border-cyan-500/50 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            style={getStyle(index)}
          >
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          </a>
        ))}
      </div>
      <button
        onClick={() => handleNav('prev')}
        className="absolute left-0 md:left-[10%] lg:left-[20%] top-1/2 -translate-y-1/2 text-cyan-400 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/80 transition-all text-2xl md:text-4xl z-50"
        aria-label="Previous project"
      >
        &#x276E;
      </button>
      <button
        onClick={() => handleNav('next')}
        className="absolute right-0 md:right-[10%] lg:right-[20%] top-1/2 -translate-y-1/2 text-cyan-400 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/80 transition-all text-2xl md:text-4xl z-50"
        aria-label="Next project"
      >
        &#x276F;
      </button>
    </div>
  );
};

export default Carousel3D;
