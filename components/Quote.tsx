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
    projectType: selectedOffer || '',
    projectDescription: '',
    budget: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    projectType: '',
    projectDescription: '',
  });

  const [formStatus, setFormStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

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
    if (!formData.projectDescription.trim() || formData.projectDescription.trim().length < 10) {
      newErrors.projectDescription = 'Veuillez décrire votre projet (10 caractères min).';
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus({ type: 'idle', message: '' });

    if (!validateForm()) {
      return;
    }

    setFormStatus({ type: 'loading', message: '' });

    try {
      const response = await fetch('http://localhost:3001/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Une erreur serveur est survenue.');
      }
      
      const successMessage = responseData.emailSent
        ? 'Un email de confirmation vous a été adressé. Nous revenons vers vous au plus vite !'
        : 'Votre demande a bien été enregistrée. Cependant, l\'email de confirmation n\'a pas pu être envoyé.';

      setFormStatus({ type: 'success', message: successMessage });
      
    } catch (error) {
      let errorMessage = 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = "Impossible de joindre nos serveurs. Veuillez vérifier votre connexion internet et que le serveur backend est bien lancé.";
        } else {
          errorMessage = error.message;
        }
      }
      setFormStatus({ type: 'error', message: errorMessage });
    }
  };


  const inputStyles = (hasError: boolean) =>
    `w-full px-4 py-2 bg-gray-800 border rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300 ${hasError ? 'border-red-500' : 'border-gray-700'}`;
    
  const SubmitButtonContent: React.FC = () => {
    if (formStatus.type === 'loading') {
      return (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Envoi en cours...
        </>
      );
    }
    return <>Envoyer ma Demande</>;
  };
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    window.location.hash = hash;
  };

  return (
    <section id="devis" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <SectionTitle>Demande de Devis Gratuit</SectionTitle>
        {formStatus.type !== 'success' && (
          selectedOffer ? (
            <p className="text-center text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Vous êtes intéressé(e) par l'offre : <strong className="text-indigo-400">{selectedOffer}</strong>.
              <br />
              Pour affiner notre proposition, veuillez nous en dire plus sur votre projet.
            </p>
          ) : (
            <p className="text-center text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Décrivez-nous votre projet et nous vous fournirons une estimation personnalisée dans les plus brefs délais.
            </p>
          )
        )}

        <div className="max-w-2xl mx-auto">
          {formStatus.type === 'success' ? (
            <div className="text-center p-8 bg-gray-800/50 rounded-lg border border-indigo-700/50 transition-opacity duration-500 animate-fade-in">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-900/50 flex items-center justify-center border-2 border-green-500">
                    <svg className="w-10 h-10 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Demande envoyée !</h3>
                <p className="text-gray-300">{formStatus.message}</p>
                <a 
                  href="/#/offres" 
                  onClick={(e) => handleNavClick(e, '/offres')}
                  className="mt-8 inline-block px-8 py-3 bg-indigo-600 text-white font-bold rounded-full transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transform hover:scale-105"
                >
                  Retourner aux offres
                </a>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nom Complet <span className="text-red-500">*</span></label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputStyles(!!errors.name)} required />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email <span className="text-red-500">*</span></label>
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
                        <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">Type de projet <span className="text-red-500">*</span></label>
                        <select name="projectType" id="projectType" value={formData.projectType} onChange={handleChange} className={inputStyles(!!errors.projectType) + ' appearance-none'} required>
                            <option value="">Sélectionnez un type</option>
                            <option value="Site Vitrine Essentiel">Site Vitrine Essentiel</option>
                            <option value="Solution Performance">Solution Performance</option>
                            <option value="Projet Sur Mesure">Projet Sur Mesure</option>
                            <option value="Autre">Autre (précisez ci-dessous)</option>
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
                  <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-300 mb-2">Décrivez votre projet <span className="text-red-500">*</span></label>
                  <textarea name="projectDescription" id="projectDescription" rows={6} value={formData.projectDescription} onChange={handleChange} className={inputStyles(!!errors.projectDescription)} required></textarea>
                  {errors.projectDescription && <p className="text-red-500 text-sm mt-1">{errors.projectDescription}</p>}
                </div>
                <div className="text-center pt-4">
                  <button 
                    type="submit" 
                    className="inline-flex items-center justify-center px-10 py-4 bg-indigo-600 text-white font-bold rounded-full transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-indigo-600"
                    disabled={formStatus.type === 'loading'}
                  >
                    <SubmitButtonContent />
                  </button>
                </div>
              </form>
    
              {formStatus.type === 'error' && (
                <div className="text-center mt-6 text-red-300 bg-red-900/40 p-4 rounded-md border border-red-700/50">
                    {formStatus.message}
                </div>
              )}
            </>
          )}

          <div className="mt-12 text-center text-gray-400 border-t border-gray-700/50 pt-8">
            <p>
              Pour toute question, vous pouvez aussi nous contacter directement par email à <a href="mailto:contact@webigo.fr" className="text-indigo-400 hover:underline">contact@webigo.fr</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quote;