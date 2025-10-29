import React, { useRef, useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';

const projects = [
  {
    id: 1,
    title: "Salon de Coiffure 'Éclat'",
    description: "Un site vitrine élégant présentant les services, l'équipe et une galerie de réalisations, avec prise de rendez-vous en ligne.",
    imageUrl: `https://picsum.photos/seed/salon/500/350`,
    tags: ['Design UI/UX', 'Prise de RDV', 'Responsive'],
  },
  {
    id: 2,
    title: "Clinique Dentaire 'Sourire'",
    description: "Une plateforme claire et rassurante pour informer les patients sur les soins, les tarifs et l'équipe médicale.",
    imageUrl: `https://picsum.photos/seed/dentist/500/350`,
    tags: ['React', 'Design sobre', 'Accessibilité'],
  },
  {
    id: 3,
    title: "Vendeur Automobile 'Prestige'",
    description: "Un catalogue en ligne dynamique pour présenter les véhicules d'occasion avec fiches détaillées et filtres de recherche.",
    imageUrl: `https://picsum.photos/seed/car/500/350`,
    tags: ['Catalogue', 'Recherche', 'Node.js'],
  },
   {
    id: 4,
    title: "Restaurant 'La Fourchette'",
    description: "Un site gourmand avec menu interactif, réservation de table et mise en avant des produits locaux.",
    imageUrl: `https://picsum.photos/seed/resto/500/350`,
    tags: ['Design', 'Réservation', 'Photographies'],
  },
   {
    id: 5,
    title: "Cabinet d'Avocats 'Juris'",
    description: "Un site institutionnel et professionnel pour présenter les domaines de compétence et inspirer la confiance.",
    imageUrl: `https://picsum.photos/seed/law/500/350`,
    tags: ['Identité de marque', 'Sécurité', 'SEO'],
  },
   {
    id: 6,
    title: "Boutique de Fleurs 'Flora'",
    description: "Une boutique en ligne colorée et intuitive pour commander des bouquets avec livraison.",
    imageUrl: `https://picsum.photos/seed/flowers/500/350`,
    tags: ['e-Commerce', 'Paiement en ligne', 'Design'],
  }
];


const ProjectCard: React.FC<{ project: typeof projects[0], index: number }> = ({ project, index }) => {
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
            { threshold: 0.2 }
        );
        const currentRef = ref.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, []);

    return (
        <div
            ref={ref}
            className={`group relative overflow-hidden rounded-lg bg-gray-800 border border-gray-700 transition-all duration-500 ease-out hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/20 transform hover:-translate-y-2 hover:scale-105 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <img src={project.imageUrl} alt={project.title} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="p-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4 text-sm">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-700 text-cyan-300 text-xs rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Projects: React.FC = () => {
  return (
    <section id="projets" className="py-20 md:py-28 bg-gray-900/50">
      <div className="container mx-auto px-6">
        <SectionTitle>Nos Projets Récents</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;