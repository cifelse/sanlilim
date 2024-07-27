"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import NavLink from './components/NavLink';
import SkeletonBox from './components/SkeletonBox';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { fetchImages } from '../utils/google';

/**
 * Google Map Settings
 */
const MapSettings = {
  style: {
    height: '100%',
    width: '100%',
  },
  center: {
    lat: 14.5652, // De La Salle University Manila
    lng: 120.9930,
  },
  zoom: 15,
};

export default function Home() {
  const [activeSection, setActiveSection] = useState('shelter-finder');
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function loadImages() {
      // Set loading to true when starting to fetch
      setIsLoading(true);

      try {
        const fetchedImages = await fetchImages('De La Salle University Manila', 5);
        setImages(fetchedImages);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        // Set loading to false when done, regardless of success or failure
        setIsLoading(false); 
      }
    }
  
    loadImages();
  }, []);

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
        <section id="shelter-finder" className="bg-[#F6F4E6] min-h-screen flex flex-col md:flex-row p-4 md:p-8 uppercase">
          {/* Left Side - Map */}
          <div className="w-full md:w-1/2 p-4">
            {isLoading ? (
              <SkeletonBox className="w-full h-96" />
            ) : (
              <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GCP_API_KEY as string}>
                <GoogleMap
                  mapContainerStyle={MapSettings.style}
                  center={MapSettings.center}
                  zoom={MapSettings.zoom}
                >
                  <Marker position={MapSettings.center} />
                </GoogleMap>
              </LoadScript>
            )}
          </div>

          {/* Right Side - Shelter Details */}
          <div className="w-full md:w-1/2 p-4 flex flex-col">
            {/* Image and Name Placeholder */}
            {isLoading ? (
              <SkeletonBox className="h-1/3 mb-4" />
            ) : (
              <div className="h-1/3 bg-white rounded-lg shadow-md mb-4 relative overflow-hidden">
                {images.length > 0 && (
                  <Image 
                    src={images[2]}
                    alt="De La Salle University Manila"
                    layout="fill"
                    objectFit="cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2C2C2C] to-transparent text-white p-4">
                  <p className="font-primary text-2xl md:text-3xl font-bold">DE LA SALLE UNIVERSITY MANILA</p>
                </div>
              </div>
            )}

            {/* Info Boxes */}
            <div className="flex justify-between mb-4">
              {[
                { label: 'CAPACITY', value: '20,000' },
                { label: 'CITY', value: 'MANILA' },
                { label: 'FOUNDED', value: '1911' }
              ].map((item) => (
                <div key={item.label} className="w-[30%]">
                  {isLoading ? (
                    <SkeletonBox className="h-24" />
                  ) : (
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <h3 className="font-sans text-sm mb-2 text-center">{item.label}</h3>
                      <p className="font-primary text-xl text-center text-gray-600">{item.value}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Additional Details */}
            {isLoading ? (
              <SkeletonBox className="flex-grow" />
            ) : (
              <div className="flex-grow bg-white rounded-lg shadow-md p-4">
                <h3 className="font-bold mb-2">ADDITIONAL DETAILS</h3>
                <p className="text-gray-600">De La Salle University is a private, Catholic research university located in Taft Avenue, Malate, Manila, Philippines. It was founded in 1911 by the Brothers of the Christian Schools and is the first De La Salle school in the Philippines.</p>
              </div>
            )}
          </div>
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