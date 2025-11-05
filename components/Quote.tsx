import React, { useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';

interface QuoteProps {
  selectedOffer: string | null;
}

const Quote: React.FC<QuoteProps> = ({ selectedOffer }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    projectDescription: '',
    budget: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    projectType: '',
    projectDescription: '',
  });

  const [status, setStatus] = useState('');

  const validateForm = () => {
    const newErrors = { name: '', email: '', projectType: '', projectDescription: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis.';
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'adresse email est invalide.";
      isValid = false;
    }
    if (!formData.projectType) {
        newErrors.projectType = "Veuillez sélectionner un type de projet.";
        isValid = false;
    }
    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Veuillez décrire votre projet.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    if (errors[name as keyof typeof errors]) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setStatus('Merci ! Votre demande de devis a bien été envoyée. Nous reviendrons vers vous rapidement.');
      setFormData({ name: '', email: '', phone: '', company: '', projectType: '', projectDescription: '', budget: '' });
      setTimeout(() => setStatus(''), 7000);
    }
  };

  const inputStyles = (hasError: boolean) =>
    `w-full px-4 py-2 bg-gray-800 border rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300 ${hasError ? 'border-red-500' : 'border-gray-700'}`;

  return (
    <section id="devis" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <SectionTitle>Demande de Devis Gratuit</SectionTitle>
        {selectedOffer ? (
          <p className="text-center text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Vous êtes intéressé(e) par l'offre : <strong className="text-indigo-400">{selectedOffer}</strong>.
            <br />
            Pour affiner notre proposition, veuillez nous en dire plus sur votre projet.
          </p>
        ) : (
          <p className="text-center text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Décrivez-nous votre projet et nous vous fournirons une estimation personnalisée dans les plus brefs délais.
          </p>
        )}

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nom Complet</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputStyles(!!errors.name)} required />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputStyles(!!errors.email)} required />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Téléphone (Optionnel)</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputStyles(false)} />
                </div>
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">Entreprise (Optionnel)</label>
                    <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className={inputStyles(false)} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">Type de projet</label>
                    <select name="projectType" id="projectType" value={formData.projectType} onChange={handleChange} className={inputStyles(!!errors.projectType) + ' appearance-none'} required>
                        <option value="">Sélectionnez un type</option>
                        <option value="Création de site vitrine">Création de site vitrine</option>
                        <option value="Refonte de site vitrine">Refonte de site vitrine</option>
                        <option value="Création de site e-commerce">Création de site e-commerce</option>
                        <option value="Application web sur mesure">Application web sur mesure</option>
                        <option value="Autre">Autre (à préciser ci-dessous)</option>
                    </select>
                    {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>}
                </div>
                 <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">Budget approximatif</label>
                    <select name="budget" id="budget" value={formData.budget} onChange={handleChange} className={inputStyles(false) + ' appearance-none'}>
                        <option value="">Sélectionnez une fourchette</option>
                        <option value="<1500€">&lt; 1500€</option>
                        <option value="1500-3000€">1500€ - 3000€</option>
                        <option value="3000-5000€">3000€ - 5000€</option>
                        <option value=">5000€">&gt; 5000€</option>
                    </select>
                </div>
            </div>
            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-300 mb-2">Décrivez votre projet</label>
              <textarea name="projectDescription" id="projectDescription" rows={6} value={formData.projectDescription} onChange={handleChange} className={inputStyles(!!errors.projectDescription)} required></textarea>
              {errors.projectDescription && <p className="text-red-500 text-sm mt-1">{errors.projectDescription}</p>}
            </div>
            <div className="text-center pt-4">
              <button type="submit" className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-full transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transform hover:scale-105">
                Envoyer ma Demande
              </button>
            </div>
          </form>
          {status && (
            <p className="text-center mt-6 text-green-400 bg-green-900/30 p-4 rounded-md">{status}</p>
          )}

          <div className="mt-12 text-center text-gray-400 border-t border-gray-700/50 pt-8">
            <p>
              Pour toute question, vous pouvez aussi nous contacter directement par email à <a href="mailto:contact@webigo.fr" className="text-indigo-400 hover:underline">contact@webigo.fr</a>
              <br/>
              ou par téléphone au <a href="tel:+33123456789" className="text-indigo-400 hover:underline">+33 1 23 45 67 89</a>.
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <a href="/#/offres" 
             onClick={(e) => {
                e.preventDefault();
                window.location.hash = '/offres';
             }}
             className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux offres
          </a>
        </div>
      </div>
    </section>
  );
};

export default Quote;