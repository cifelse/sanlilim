"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import SkeletonBox from './components/SkeletonBox';
import Map, { Shelter } from './components/Map';
import { getImage } from '../utils/google';
import sheltersDataJson from '../../public/data/shelters.json';
import Navbar from './components/Navbar';

export default function Home() {
  const [activeSection, setActiveSection] = useState('shelter-finder');
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [image, setImage] = useState<string>("");
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [magnitude, setMagnitude] = useState(5.5);

  const isEarthquakeSection = activeSection === 'earthquake-monitor';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMarkerClick = async (shelter: Shelter) => {
    setSelectedShelter(shelter);

    try {
      let image = await getImage(`${shelter.name ?? shelter.city}`);
      console.log('Image:', image);
      setImage(image);
    } catch (error) {
      console.error('Error fetching image for shelter:', error);
    }
  };

  // Convert the JSON data to Shelter type
  const sheltersData = sheltersDataJson.map((shelter: any) => ({
    ...shelter,
    callback: () => handleMarkerClick(shelter)
  }));

  useEffect(() => {
    async function loadImages() {
      // Set loading to true when starting to fetch
      setIsLoading(true);

      try {
        setImage(await getImage('Bahay Tuluyan Manila'));
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setIsLoading(false); 
      }
    }
  
    loadImages();
  }, []);

  // Scrolling Handler
  const smoothScroll = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
        window.scrollTo({
            top: target.offsetTop - 64,
            behavior: 'smooth'
        });
    }
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shelterSection = document.getElementById('shelter-finder');
          const earthquakeSection = document.getElementById('earthquake-monitor');
          
          if (shelterSection && earthquakeSection) {
            const shelterRect = shelterSection.getBoundingClientRect();
            const earthquakeRect = earthquakeSection.getBoundingClientRect();
            
            const windowHeight = window.innerHeight;
            const threshold = windowHeight / 2;
  
            if (earthquakeRect.top <= threshold) {
              setActiveSection('earthquake-monitor');
            } else if (shelterRect.top <= threshold) {
              setActiveSection('shelter-finder');
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Navbar */}
      <Navbar
        isEarthquakeSection={isEarthquakeSection}
        activeSection={activeSection}
        smoothScroll={smoothScroll}
      />

      {/* Main Content */}
      <main className="flex-grow pt-16">
        
        {/* Shelter Finder Section */}
        <section id="shelter-finder" className="bg-[#F6F4E6] min-h-screen flex flex-col md:flex-row p-4 md:p-8 uppercase">

          {/* Left Side - Map (desktop only) */}
          <div className="hidden md:block w-full md:w-1/2 p-4">
            {isLoading ? (
              <SkeletonBox className="w-full h-96" />
            ) : (
              <Map markers={sheltersData} />
            )}
          </div>

          {/* Right Side - Shelter Details */}
          <div className="w-full md:w-1/2 p-4 flex flex-col">
            {/* Image and Name Placeholder */}
            {isLoading ? (
              <SkeletonBox className="h-40 md:h-1/3 mb-4" />
            ) : (
              <div className="h-40 md:h-1/3 bg-white rounded-lg shadow-md mb-4 relative overflow-hidden">
                
                <Image 
                  src={image}
                  alt={selectedShelter?.name ?? "Shelter"}
                  layout="fill"
                  objectFit="cover"
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2C2C2C] to-transparent text-white p-4">
                  <p className="font-primary text-xl md:text-2xl lg:text-3xl font-bold">
                    {selectedShelter?.name?.toUpperCase() || "SELECT A SHELTER"}
                  </p>
                </div>
              </div>
            )}

            {/* Info Boxes */}
            <div className="flex justify-between mb-4">
              {[
                { label: 'CAPACITY', value: selectedShelter?.capacity ?? "N/A" },
                { label: 'CITY', value: selectedShelter?.city?.toUpperCase() ?? "N/A" },
                { label: 'TYPE', value: selectedShelter?.type?.toUpperCase() ?? "N/A" }
              ].map((item) => (
                <div key={item.label} className="w-[30%]">
                  {isLoading ? (
                    <SkeletonBox className="h-24" />
                  ) : (
                    <div className="bg-white rounded-lg shadow-md p-2 md:p-4">
                      <h3 className="font-sans text-xs md:text-sm mb-1 md:mb-2 text-center">{item.label}</h3>
                      <p className="font-primary text-sm md:text-xl text-center text-gray-600">{item.value}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Map (mobile only) */}
            <div className="md:hidden w-full h-64 mb-4">
              {isLoading ? (
                <SkeletonBox className="w-full h-full" />
              ) : (
                <Map markers={sheltersData} />
              )}
            </div>

            {/* Additional Details */}
            {isLoading ? (
              <SkeletonBox className="flex-grow" />
            ) : (
              <div className="flex-grow bg-white rounded-lg shadow-md p-4">
                <h3 className="font-bold mb-2">HOW TO GO THERE</h3>
                <p className="text-gray-600 text-sm md:text-base">De La Salle University is a private, Catholic research university located in Taft Avenue, Malate, Manila, Philippines. It was founded in 1911 by the Brothers of the Christian Schools and is the first De La Salle school in the Philippines.</p>
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