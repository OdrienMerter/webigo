import React, { useRef, useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';

const testimonials = [
  {
    quote: "Leur approche personnalisée a complètement transformé notre présence en ligne. Une équipe à l'écoute et incroyablement talentueuse !",
    name: "Sophie Dubois",
    company: "Gérante, Salon L'Éclat",
  },
  {
    quote: "Enfin une agence qui comprend les enjeux techniques d'une startup. Notre nouveau site est rapide, scalable et magnifique. Un vrai partenaire.",
    name: "Alex Martin",
    company: "CEO, TechNova",
  }
];

const TestimonialCard: React.FC<{ testimonial: typeof testimonials[0], index: number }> = ({ testimonial, index }) => {
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
            className={`p-8 bg-gray-900/40 rounded-lg border border-gray-700/50 transition-all duration-500 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            <svg className="w-10 h-10 text-indigo-500 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L25.864 4z" />
            </svg>
            <blockquote className="text-gray-300 text-lg italic leading-relaxed">
                "{testimonial.quote}"
            </blockquote>
            <cite className="block mt-4 text-right not-italic">
                <span className="font-bold text-indigo-400">{testimonial.name}</span>
                <span className="text-gray-400">, {testimonial.company}</span>
            </cite>
        </div>
    );
};

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <SectionTitle>Ce que nos clients disent de nous</SectionTitle>
        <p className="text-center text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            La confiance et la satisfaction de nos clients sont notre plus grande fierté.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;