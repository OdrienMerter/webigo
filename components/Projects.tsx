
import React, { useRef, useState } from 'react';
import SectionTitle from './SectionTitle';

const projects = [
  {
    id: 1,
    title: "Salon 'Éclat'",
    description: "Site vitrine avec prise de RDV.",
    imageUrl: `https://picsum.photos/seed/salon/500/350`,
    tags: ['UI/UX', 'RDV'],
    url: '#',
  },
  {
    id: 2,
    title: "Clinique 'Sourire'",
    description: "Plateforme médicale rassurante.",
    imageUrl: `https://picsum.photos/seed/dentist/500/350`,
    tags: ['React', 'Accessibilité'],
    url: '#',
  },
  {
    id: 3,
    title: "Auto 'Prestige'",
    description: "Catalogue véhicules premium.",
    imageUrl: `https://picsum.photos/seed/car/500/350`,
    tags: ['Catalogue', 'Node.js'],
    url: '#',
  },
   {
    id: 4,
    title: "'La Fourchette'",
    description: "Menu interactif et réservations.",
    imageUrl: `https://picsum.photos/seed/resto/500/350`,
    tags: ['UI/UX', 'Photo'],
    url: '#',
  },
   {
    id: 5,
    title: "Cabinet 'Juris'",
    description: "Site institutionnel avocat.",
    imageUrl: `https://picsum.photos/seed/law/500/350`,
    tags: ['Marque', 'SEO'],
    url: '#',
  },
   {
    id: 6,
    title: "Fleurs 'Flora'",
    description: "E-shop bouquets colorés.",
    imageUrl: `https://picsum.photos/seed/flowers/500/350`,
    tags: ['E-Commerce'],
    url: '#',
  }
];


const ProjectCard: React.FC<{ project: typeof projects[0] }> = ({ project }) => {
    return (
        <div
            className={`
                w-full md:w-auto snap-center
                group relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700 transition-all duration-300 ease-out hover:border-indigo-500/70 hover:shadow-2xl hover:shadow-indigo-500/20 transform md:hover:-translate-y-2 
                opacity-100 translate-y-0
            `}
        >
            <div className="relative h-48 md:h-56 overflow-hidden">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
            </div>
            
            <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-indigo-400 mb-1">{project.title}</h3>
                <p className="text-gray-400 mb-3 text-sm md:h-12 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-700/50 border border-gray-600 text-indigo-300 text-[10px] md:text-xs rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10">
                 <span className="sr-only">Voir le projet {project.title}</span>
            </a>
        </div>
    );
};

interface ProjectsProps {
    isPage?: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ isPage = false }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, offsetWidth } = scrollRef.current;
            const newIndex = Math.round(scrollLeft / offsetWidth);
            setActiveIndex(Math.max(0, Math.min(newIndex, projects.length - 1)));
        }
    };

    const scrollToProject = (index: number) => {
        if (scrollRef.current) {
            const itemWidth = scrollRef.current.offsetWidth; 
            scrollRef.current.scrollTo({
                left: index * itemWidth,
                behavior: 'smooth'
            });
        }
    };

  return (
    <section id="projets" className={`py-16 md:py-28 ${isPage ? '' : 'bg-black/20'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle>Réalisations</SectionTitle>
        {isPage && (
            <p className="text-center text-base md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 md:mb-16">
                Découvrez comment nous avons aidé d'autres entreprises à se démarquer.
            </p>
        )}
        
        {/* Horizontal Scroll on Mobile - Full Width Logic */}
        <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex flex-row overflow-x-auto snap-x snap-mandatory touch-pan-y gap-0 pb-8 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible hide-scrollbar"
        >
          {projects.map((project, index) => (
            <div key={index} className="w-full flex-shrink-0 md:w-auto px-2 md:px-0 snap-center snap-always">
                 <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex justify-center gap-2 -mt-4 mb-8 md:hidden">
            {projects.map((_, index) => (
                <button
                    key={index}
                    onClick={() => scrollToProject(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                        index === activeIndex 
                        ? 'w-8 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' 
                        : 'w-2 bg-gray-700'
                    }`}
                    aria-label={`Voir le projet ${index + 1}`}
                />
            ))}
        </div>
        
        {isPage && (
            <div className="mt-8 text-center hidden md:block">
              <a href="/#/" 
                 onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '/';
                 }}
                 className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-300 group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à l'accueil
              </a>
            </div>
        )}
      </div>
       <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Projects;
