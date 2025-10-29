
import React from 'react';
import { CodeIcon, DesignIcon, SeoIcon, MaintenanceIcon } from './ServiceIcons';
import SectionTitle from './SectionTitle';

const services = [
  {
    icon: <CodeIcon />,
    title: 'Développement sur Mesure',
    description: 'Nous créons des sites web et applications performants, sécurisés et adaptés à vos besoins spécifiques.',
  },
  {
    icon: <DesignIcon />,
    title: 'Design UI/UX Futuriste',
    description: 'Des interfaces intuitives et esthétiques pour une expérience utilisateur inoubliable et engageante.',
  },
  {
    icon: <SeoIcon />,
    title: 'Référencement SEO',
    description: 'Optimisation de votre site pour les moteurs de recherche afin d\'améliorer votre visibilité et attirer plus de clients.',
  },
  {
    icon: <MaintenanceIcon />,
    title: 'Maintenance & Évolution',
    description: 'Nous assurons la maintenance, les mises à jour et l\'évolution de vos plateformes pour une tranquillité d\'esprit.',
  },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <SectionTitle>Nos Services</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="flex items-start p-6 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors duration-300">
              <div className="mr-6 text-cyan-400">
                {service.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
