import React from 'react';
import Hero from './Hero';
import Services from './Services';
import About from './About';
import WhyChooseUs from './WhyChooseUs';
import Testimonials from './Testimonials';
import Contact from './Contact';

interface HomePageProps {
  isMenuOpen: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isMenuOpen }) => {
  return (
    <>
      <Hero isMenuOpen={isMenuOpen} />
      <About />
      <WhyChooseUs />
      <Testimonials />
      <Services />
      <Contact />
    </>
  );
};

export default HomePage;