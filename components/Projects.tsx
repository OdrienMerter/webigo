import React, { useRef, useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';

const projects = [
  {
    id: 1,
    title: "Salon de Coiffure 'Éclat'",
    description: "Un site vitrine élégant présentant les services, l'équipe et une galerie de réalisations, avec prise de rendez-vous en ligne.",
    imageUrl: `https://picsum.photos/seed/salon/500/350`,
    tags: ['Design UI/UX', 'Prise de RDV', 'Responsive'],
    url: '#',
  },
  {
    id: 2,
    title: "Clinique Dentaire 'Sourire'",
    description: "Une plateforme claire et rassurante pour informer les patients sur les soins, les tarifs et l'équipe médicale.",
    imageUrl: `https://picsum.photos/seed/dentist/500/350`,
    tags: ['React', 'Design sobre', 'Accessibilité'],
    url: '#',
  },
  {
    id: 3,
    title: "Vendeur Automobile 'Prestige'",
    description: "Un catalogue en ligne dynamique pour présenter les véhicules d'occasion avec fiches détaillées et filtres de recherche.",
    imageUrl: `https://picsum.photos/seed/car/500/350`,
    tags: ['Catalogue', 'Recherche', 'Node.js'],
    url: '#',
  },
   {
    id: 4,
    title: "Restaurant 'La Fourchette'",
    description: "Un site gourmand avec menu interactif, réservation de table et mise en avant des produits locaux.",
    imageUrl: `https://picsum.photos/seed/resto/500/350`,
    tags: ['Design UI/UX', 'Réservation', 'Photographies'],
    url: '#',
  },
   {
    id: 5,
    title: "Cabinet d'Avocats 'Juris'",
    description: "Un site institutionnel et professionnel pour présenter les domaines de compétence et inspirer la confiance.",
    imageUrl: `https://picsum.photos/seed/law/500/350`,
    tags: ['Identité de marque', 'Sécurité', 'SEO'],
    url: '#',
  },
   {
    id: 6,
    title: "Boutique de Fleurs 'Flora'",
    description: "Une boutique en ligne colorée et intuitive pour commander des bouquets avec livraison.",
    imageUrl: `https://picsum.photos/seed/flowers/500/350`,
    tags: ['e-Commerce', 'Paiement en ligne', 'Design UI/UX'],
    url: '#',
  }
];


const ProjectCard: React.FC<{ project: typeof projects[0] }> = ({ project }) => {
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
            { threshold: 0.1 }
        );
        const currentRef = ref.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, []);


    return (
        <div
            ref={ref}
            className={`group relative overflow-hidden rounded-lg bg-gray-800 border border-gray-700 transition-all duration-500 ease-out hover:border-indigo-500/70 hover:shadow-2xl hover:shadow-indigo-500/20 transform hover:-translate-y-2 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <img src={project.imageUrl} alt={project.title} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="p-6">
                <h3 className="text-xl font-bold text-indigo-400 mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4 text-sm h-16">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-700 text-indigo-300 text-xs rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-lg font-bold border-2 border-white rounded-full px-6 py-2">Voir le projet</span>
            </a>
        </div>
    );
};

interface ProjectsProps {
    isPage?: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ isPage = false }) => {
  return (
    <section id="projets" className={`py-20 md:py-28 ${isPage ? '' : 'bg-black/20'}`}>
      <div className="container mx-auto px-6">
        <SectionTitle>Nos Projets</SectionTitle>
        {isPage && (
            <p className="text-center text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-16">
                Chaque projet est une histoire, celle d'une collaboration entre une vision et notre savoir-faire. Voici un aperçu de la qualité et de la diversité de notre travail. Imaginez ce que nous pourrions créer ensemble.
            </p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        {isPage && (
            <div className="mt-16 text-center">
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
    </section>
  );
};

export default Projects;