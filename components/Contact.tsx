import React, { useState, useRef, useEffect } from 'react';
import SectionTitle from './SectionTitle';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');
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

  const validateForm = () => {
    const newErrors = { name: '', email: '', message: '' };
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

    if (!formData.message.trim()) {
      newErrors.message = 'Le message ne peut pas être vide.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error on change
    if (errors[name as keyof typeof errors]) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setStatus('Merci ! Votre message a été envoyé.');
      setFormData({ name: '', email: '', message: '' }); // Reset form
      setTimeout(() => setStatus(''), 5000);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <div ref={ref} className="container mx-auto px-6">
        <SectionTitle>Contactez-Nous</SectionTitle>
        <p className={`text-center text-gray-400 max-w-2xl mx-auto mb-10 transition-opacity duration-700 ease-out ${inView ? 'opacity-100' : 'opacity-0'}`}>
          Une idée ? Un projet ? Nous serions ravis d'en discuter avec vous. Remplissez le formulaire ci-dessous pour démarrer la conversation.
        </p>
        <div className={`max-w-xl mx-auto transition-all duration-700 ease-out delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border rounded-md text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300 ${errors.name ? 'border-red-500' : 'border-gray-700'}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border rounded-md text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-gray-700'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                name="message"
                id="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border rounded-md text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300 ${errors.message ? 'border-red-500' : 'border-gray-700'}`}
              ></textarea>
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>
            <div className="text-center">
              <button type="submit" className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-full transition-all duration-300 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.8)] transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                Envoyer le Message
              </button>
            </div>
          </form>
          {status && (
            <p className="text-center mt-6 text-green-400">{status}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;