
import React, { useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';

// This list should ideally be shared, but for simplicity, we'll redefine it here.
const offerOptions = [
  'Site Vitrine Essentiel',
  'Solution Performance',
  'Projet Sur Mesure',
];

interface QuoteProps {
  selectedOffer: string | null;
}

const Quote: React.FC<QuoteProps> = ({ selectedOffer }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    offer: selectedOffer || '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (selectedOffer && offerOptions.includes(selectedOffer)) {
      setFormData(fd => ({ ...fd, offer: selectedOffer }));
    }
  }, [selectedOffer]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis.';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'adresse email n\'est pas valide.';
    }
    if (!formData.offer) newErrors.offer = 'Veuillez sélectionner une offre.';
    if (!formData.message.trim()) newErrors.message = 'Veuillez décrire votre projet.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    
    setSubmissionStatus('submitting');
    try {
      const response = await fetch('/api/devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      setSubmissionStatus('success');
      setFormData({ name: '', email: '', company: '', phone: '', offer: selectedOffer || '', message: '' });

    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('error');
    }
  };
  
  // Input field styling
  const inputBaseClasses = "w-full px-4 py-3 rounded-md bg-gray-800 border text-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2";
  const inputNormalClasses = "border-gray-700 focus:border-indigo-500 focus:ring-indigo-500";
  const inputErrorClasses = "border-red-500 focus:border-red-500 focus:ring-red-500";

  return (
    <section id="devis" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <SectionTitle>Demander un Devis Gratuit</SectionTitle>
        <p className="text-center text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          Racontez-nous votre projet. Nous sommes impatients de découvrir comment nous pouvons vous aider à atteindre vos objectifs.
        </p>
        <div className="max-w-2xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg p-8 shadow-lg">
          {submissionStatus === 'success' ? (
            <div className="text-center py-10">
              <h3 className="text-2xl font-bold text-green-400 mb-4">Message envoyé avec succès !</h3>
              <p className="text-gray-300">Merci de nous avoir contactés. Nous reviendrons vers vous dans les plus brefs délais.</p>
              <a href="/#/" onClick={(e) => { e.preventDefault(); window.location.hash = '/'; }} className="mt-6 inline-block text-indigo-400 hover:text-indigo-300">
                Retour à l'accueil
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-2 font-medium">Nom complet <span className="text-indigo-400">*</span></label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={`${inputBaseClasses} ${errors.name ? inputErrorClasses : inputNormalClasses}`} />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">Email <span className="text-indigo-400">*</span></label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={`${inputBaseClasses} ${errors.email ? inputErrorClasses : inputNormalClasses}`} />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-gray-300 mb-2 font-medium">Entreprise (Optionnel)</label>
                  <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className={`${inputBaseClasses} ${inputNormalClasses}`} />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-300 mb-2 font-medium">Téléphone (Optionnel)</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={`${inputBaseClasses} ${inputNormalClasses}`} />
                </div>
              </div>
              <div>
                <label htmlFor="offer" className="block text-gray-300 mb-2 font-medium">Offre qui vous intéresse <span className="text-indigo-400">*</span></label>
                <select id="offer" name="offer" value={formData.offer} onChange={handleChange} required className={`${inputBaseClasses} ${errors.offer ? inputErrorClasses : inputNormalClasses}`}>
                  <option value="" disabled>Sélectionnez une offre...</option>
                  {offerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                {errors.offer && <p className="text-red-400 text-sm mt-1">{errors.offer}</p>}
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2 font-medium">Décrivez votre projet <span className="text-indigo-400">*</span></label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={6} required className={`${inputBaseClasses} ${errors.message ? inputErrorClasses : inputNormalClasses}`}></textarea>
                {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
              </div>
              
              {submissionStatus === 'error' && (
                <p className="text-red-400 text-center">Une erreur est survenue. Veuillez réessayer plus tard.</p>
              )}

              <div>
                <button type="submit" disabled={submissionStatus === 'submitting'} className="w-full px-8 py-4 bg-indigo-600 text-white font-bold rounded-full transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] disabled:bg-indigo-800 disabled:cursor-not-allowed flex items-center justify-center">
                  {submissionStatus === 'submitting' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : 'Envoyer ma demande'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Quote;
