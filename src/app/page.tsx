"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import NavLink from './components/NavLink';

export default function Home() {
  const [activeSection, setActiveSection] = useState('shelter-finder');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shelterSection = document.getElementById('shelter-finder');
      const earthquakeSection = document.getElementById('earthquake-monitor');
      
      if (shelterSection && earthquakeSection) {
        const shelterRect = shelterSection.getBoundingClientRect();
        const earthquakeRect = earthquakeSection.getBoundingClientRect();
        
        if (earthquakeRect.top <= 0 && earthquakeRect.bottom > 0) {
          setActiveSection('earthquake-monitor');
        } else if (shelterRect.top <= 0 && shelterRect.bottom > 0) {
          setActiveSection('shelter-finder');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isEarthquakeSection = activeSection === 'earthquake-monitor';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 p-4 transition-colors duration-300 ${isEarthquakeSection ? 'bg-[#F6F4E6]' : 'bg-[#F05454]'}`}>
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Name */}
          <div className="flex items-center">
            <Image src="/images/Sanlilim.svg" alt="Sanlilim Logo" width={32} height={32} className="mr-2" />
            <span className={`font-primary font-bold text-xl ${isEarthquakeSection ? 'text-[#F05454]' : 'text-white'}`}>SANLILIM</span>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className={`${isEarthquakeSection ? 'text-[#F05454]' : 'text-white'}`}>
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="#shelter-finder" isActive={activeSection === 'shelter-finder'} isEarthquakeSection={isEarthquakeSection}>
              SHELTER FINDER
            </NavLink>
            <NavLink href="#earthquake-monitor" isActive={activeSection === 'earthquake-monitor'} isEarthquakeSection={isEarthquakeSection}>
              EARTHQUAKE MONITOR
            </NavLink>
            <button className={`font-primary border-2 px-4 py-2 rounded transition-colors duration-300 tracking-tighter ${isEarthquakeSection ? 'text-[#F05454] border-[#F05454] hover:bg-[#F05454] hover:text-[#F6F4E6]' : 'text-white border-white hover:bg-white hover:text-[#F05454]'}`}>
              LIST A PLACE AS SHELTER
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
          <NavLink href="#shelter-finder" isActive={activeSection === 'shelter-finder'} isEarthquakeSection={isEarthquakeSection} mobile>
            SHELTER FINDER
          </NavLink>
          <NavLink href="#earthquake-monitor" isActive={activeSection === 'earthquake-monitor'} isEarthquakeSection={isEarthquakeSection} mobile>
            EARTHQUAKE MONITOR
          </NavLink>
          <button className={`w-full text-center font-primary border-2 px-4 py-2 mt-2 rounded transition-colors duration-300 tracking-tighter ${isEarthquakeSection ? 'text-[#F05454] border-[#F05454] hover:bg-[#F05454] hover:text-[#F6F4E6]' : 'text-white border-white hover:bg-white hover:text-[#F05454]'}`}>
            LIST A PLACE AS SHELTER
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {/* Shelter Finder Section */}
        <section id="shelter-finder" className="bg-[#F6F4E6] h-screen flex items-center justify-center">
          <h2 className="font-primary text-4xl font-bold">Shelter Finder</h2>
        </section>

        {/* Earthquake Monitor Section */}
        <section id="earthquake-monitor" className="bg-[#F05454] h-screen flex items-center justify-center">
          <h2 className="font-primary text-4xl font-bold text-white">Earthquake Monitor</h2>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#2C2C2C] text-white p-4">
        <div className="container mx-auto text-center">
          <p className="uppercase text-sm">&copy; 2024 SANLILIM. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}