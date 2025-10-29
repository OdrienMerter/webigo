import React from 'react';
import Hero from './Hero';
import Projects from './Projects';
import Services from './Services';
import About from './About';
import Contact from './Contact';

interface HomePageProps {
  isMenuOpen: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isMenuOpen }) => {
  return (
    <>
      <Hero isMenuOpen={isMenuOpen} />
      <Projects />
      <Services />
      <About />
      <Contact />
    </>
  );
};

export default HomePage;
