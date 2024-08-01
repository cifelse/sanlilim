"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import SkeletonBox from './components/SkeletonBox';
import Map, { Shelter } from './components/Map';
import EarthquakeMap from './components/EarthquakeMap';
import { getImage } from '../utils/google';
import sheltersDataJson from '../../public/data/shelters.json';
import earthquakesDataJson from '../../public/data/earthquakes.json';
import Navbar from './components/Navbar';
import ListShelterModal, { ShelterData } from './components/ListShelterModal';
import TrendChart from './components/TrendChart';
import Papa from 'papaparse';

type Location = {
  Province: string;
  City: string;
  Latitude: number;
  Longitude: number;
};

export default function Home() {
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle modal open
  const handleOpenModal = () => setIsModalOpen(true);

  // Function to handle modal close
  const handleCloseModal = () => setIsModalOpen(false);

  // Function to handle shelter submission
  const handleShelterSubmit = (shelterData: ShelterData) => {
    console.log('New shelter data:', shelterData);
    // Here you would typically send this data to your backend
    //
  };

  // Shelter Finder
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<string>("");
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);

  // Earthquake Monitor
  const [magnitude, setMagnitude] = useState(5.5);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);

  // Misc
  const [activeSection, setActiveSection] = useState('shelter-finder');
  const isEarthquakeSection = activeSection === 'earthquake-monitor';

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

  useEffect(() => {
    fetch('/data/locations.csv')
      .then(response => response.text())
      .then(csv => {
        const parsed = Papa.parse<Location>(csv, { header: true, dynamicTyping: true });
        setLocations(parsed.data);
      });
  }, []);

  const provinces = Array.from(new Set(locations.map(loc => loc.Province)));

  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  const [population, setPopulation] = useState<any>(null);
  const [numEvacs, setNumEvacs] = useState<any>(0);

  useEffect(() => {
    if (selectedProvince && selectedCity) {
      const selectedLocation = locations.find(
        loc => loc.Province === selectedProvince && loc.City === selectedCity
      );
      if (selectedLocation) {
        setMapCenter([selectedLocation.Latitude, selectedLocation.Longitude]);
      }
    }
    const fetchData = async () => {
      try {
        if (!selectedCity) {
          setPopulation(null);
          return;
        }

        const cityStatsResponse = await fetch('https://psgc-api.wareneutron.com/api/city');
        const cityStatsData = await cityStatsResponse.json();

        const muniStatsResponse = await fetch('https://psgc-api.wareneutron.com/api/municipality');
        const muniStatsData = await muniStatsResponse.json();

        let population: any;

        for (const city of cityStatsData[0].city) {
          if (city.name.toLowerCase().includes(selectedCity.toLowerCase())) {
            population = city.population;
            break;
          }
        }

        if (!population) {
          for (const muni of muniStatsData[0].municipality) {
            if (muni.name.toLowerCase().includes(selectedCity.toLowerCase())) {
              population = muni.population;
              break;
            }
          }
        }

        setPopulation(population);

        const countShelters = sheltersData.filter(shelter => shelter.city.toLowerCase().includes(selectedCity.toLowerCase())).length;
        
        setNumEvacs(countShelters);
      } catch (error) {
        console.error('Error fetching population data:', error);
      }
    };

    fetchData();
  }, [selectedCity]);

  // Shelter Finder Dropdowns
  const [shelterSelectedProvince, setShelterSelectedProvince] = useState('');
  const [shelterSelectedCity, setShelterSelectedCity] = useState('');

  const [shelterMapCenter, setShelterMapCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (shelterSelectedProvince && shelterSelectedCity) {
      const selectedLocation = locations.find(
        loc => loc.Province === shelterSelectedProvince && loc.City === shelterSelectedCity
      );
      if (selectedLocation) {
        setShelterMapCenter([selectedLocation.Latitude, selectedLocation.Longitude]);
      }
    }
  }, [shelterSelectedProvince, shelterSelectedCity, locations]);

  const [filteredEarthquakes, setFilteredEarthquakes] = useState([]);

  // Update filtered earthquakes when city or earthquakes data changes
  const MAX_EARTHQUAKES: any = 30; // You can adjust this number as needed
  const UPPER_MAGNITUDE: any = 3.5;

  useEffect(() => {
    if (selectedCity && earthquakesDataJson) {
      const cityEarthquakes: any = earthquakesDataJson
        .filter(eq => {
          return (eq.location.toLowerCase().includes(selectedCity.toLowerCase())) &&
                (eq.magnitude >= UPPER_MAGNITUDE);
        })
        .sort((a, b) => b.datetime - a.datetime) // Sort by date, most recent first
        .slice(0, MAX_EARTHQUAKES); // Take only the most recent MAX_EARTHQUAKES

      setFilteredEarthquakes(cityEarthquakes);
    }
  }, [selectedCity, earthquakesDataJson]);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Navbar */}
      <Navbar
        isEarthquakeSection={isEarthquakeSection}
        activeSection={activeSection}
        smoothScroll={smoothScroll}
        onOpenModal={handleOpenModal}  // Pass the function to open the modal
      />

      {/* Main Content */}
      <main className="flex-grow pt-16">
        
        {/* Shelter Finder Section */}
        <section id="shelter-finder" className="bg-[#F6F4E6] min-h-screen flex flex-col p-1 md:p-8">
        <div className="text-center mb-4 mt-5">
          <h1 className="font-primary text-3xl md:text-4xl lg:text-5xl font-bold mb-2">Shelter Finder</h1>
          <p className="text-base md:text-base text-gray-600 max-w-2xl mx-auto italic leading-snug">
            Locate nearby evacuation centers and shelters in your area. Select your province and city to find safe havens during emergencies.
          </p>
        </div>

          <div className="flex flex-col md:flex-row flex-grow uppercase">
            {/* Left Side - Map (desktop only) */}
            <div className="hidden md:block w-full md:w-1/2 p-4">
              <Map markers={sheltersData} center={shelterMapCenter} />
            </div>

            {/* Right Side - Shelter Details */}
            <div className="w-full md:w-1/2 p-4 flex flex-col">

              {/* Dropdowns */}
              <div className="flex flex-col md:flex-row md:justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
                <select 
                  className="w-full md:w-[48%] p-2 rounded"
                  value={shelterSelectedProvince}
                  onChange={(e) => {
                    setShelterSelectedProvince(e.target.value);
                    setShelterSelectedCity('');
                  }}
                >
                  <option value="">SELECT PROVINCE</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province ? province.toUpperCase() : null}</option>
                  ))}
                </select>
                <select 
                  className="w-full md:w-[48%] p-2 rounded"
                  value={shelterSelectedCity}
                  onChange={(e) => setShelterSelectedCity(e.target.value)}
                >
                  <option value="">SELECT CITY/MUNICIPALITY</option>
                  {locations
                    .filter(loc => loc.Province === shelterSelectedProvince)
                    .map(loc => (
                      <option key={loc.City} value={loc.City}>{loc.City.toUpperCase()}</option>
                    ))
                  }
                </select>
              </div>

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
                <Map markers={sheltersData} center={shelterMapCenter} />
              </div>

              {/* Additional Details */}
              {isLoading ? (
                <SkeletonBox className="flex-grow" />
              ) : (
                <div className="flex-grow bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold mb-2">SAFETY TIPS</h3>
                  {/* <ul className="list-disc list-inside text-gray-600 text-sm md:text-base">
                    <li>Stay calm and stay indoors during an earthquake.</li>
                    <li>Take cover under a sturdy piece of furniture or against an interior wall.</li>
                    <li>Avoid windows, glass, and other objects that may shatter.</li>
                    <li>If you are outdoors, move to an open area away from buildings, trees, and power lines.</li>
                    <li>After the shaking stops, check for injuries and damage, and be prepared for aftershocks.</li>
                  </ul>   */}

                  <p className='text-gray-600'>
                  During an earthquake, stay calm and indoors, taking cover under sturdy furniture or against an interior wall while avoiding windows and glass. If outside, move to an open area away from buildings, trees, and power lines. After the shaking stops, check for injuries and damage, and be prepared for aftershocks.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Earthquake Monitor Section */}
        <section id="earthquake-monitor" className="bg-[#F05454] min-h-screen flex flex-col p-4 md:p-8">
          <div className="text-center mb-8 mt-3">
            <h1 className="font-primary text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-white">QuakeMonitor</h1>
            <p className="text-base md:text-base text-white opacity-90 max-w-2xl mx-auto italic">
              View Earthquakes that happened in the Past.
            </p>
          </div>
          
          {/* Mobile View */}
          <div className="md:hidden w-full flex flex-col space-y-4">

            {/* Province Dropdown */}
            <select 
              className="w-full p-2 rounded"
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedCity(''); // Reset city when province changes
              }}
            >
              <option value="">Select Province</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>

            {/* City/Municipality Dropdown */}
            <select 
              className="w-full p-2 rounded"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Select City/Municipality</option>
              {locations
                .filter(loc => loc.Province === selectedProvince)
                .map(loc => (
                  <option key={loc.City} value={loc.City}>{loc.City}</option>
                ))
              }
            </select>

            {/* Map */}
            <div className="h-64 relative">
              <EarthquakeMap earthquakes={earthquakesDataJson} magnitude={magnitude} center={mapCenter} />
            </div>

            {/* Slider */}
            <div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={magnitude}
                onChange={(e) => setMagnitude(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-white text-center mt-2">Magnitude: {magnitude}</p>
              <p className="text-white text-center mt-2 text-sm"><i>{"(Filter the Magnitude by moving the slider)"}</i></p>
            </div>

            {/* Info Boxes */}
            <div className="flex justify-between">
              {[
                { label: 'Population', value: Math.round(population) == 0 ? "N/A" : Math.round(population) },
                { label: '# of Evacuation', value: Math.round(numEvacs) == 0 ? "N/A" : Math.round(numEvacs) },
                { label: 'Division (People/Shelter)', value: population && numEvacs ? Math.round(Math.round(population) / Math.round(numEvacs)) : "N/A" },
              ].map((item) => (
              <div key={item.label} className="w-[30%] bg-white rounded-lg shadow-md p-2">
                <h3 className="font-sans text-xs mb-1 text-center">{item.label}</h3>
                <p className="font-primary text-sm text-center text-gray-600">{item.value ?? "N/A"}</p>
              </div>
              ))}
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-gray-600 text-xs">
                Additional earthquake and location details will be displayed here.
              </p>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden md:flex w-full flex-grow">
            {/* Left Side - Earthquake Map */}
            <div className="w-1/2 p-4 flex flex-col">
              <div className="flex-grow relative">
                <EarthquakeMap earthquakes={earthquakesDataJson} magnitude={magnitude} center={mapCenter} />
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={magnitude}
                onChange={(e) => setMagnitude(parseFloat(e.target.value))}
                className="w-full mt-4"
              />
              <p className="text-white text-center mt-2">Magnitude: {magnitude}</p>
              <p className="text-white text-center mt-2 text-sm"><i>{"(Filter the Magnitude by moving the slider)"}</i></p>
            </div>

            {/* Right Side - Details */}
            <div className="w-1/2 p-4 flex flex-col">
              {/* 1st Row: Dropdowns */}
              <div className="flex justify-between mb-4">
                <select 
                  className="w-[48%] p-2 rounded"
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedCity(''); // Reset city when province changes
                  }}
                >
                  <option value="">SELECT PROVINCE</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province ? province.toUpperCase() : null}</option>
                  ))}
                </select>

                <select 
                  className="w-[48%] p-2 rounded"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">SELECT CITY/MUNICIPALITY</option>
                  {locations
                    .filter(loc => loc.Province === selectedProvince)
                    .map(loc => (
                      <option key={loc.City} value={loc.City}>{loc.City.toUpperCase()}</option>
                    ))
                  }
                </select>
              </div>

              {/* 2nd Row: Info Boxes */}
              <div className="flex justify-between mb-4">
                {[
                  { label: 'Population', value: Math.round(population) == 0 ? "N/A" : Math.round(population) },
                  { label: '# of Evacuation', value: Math.round(numEvacs) == 0 ? "N/A" : Math.round(numEvacs) },
                  { label: 'Division (People/Shelter)', value: population && numEvacs ? Math.round(Math.round(population) / Math.round(numEvacs)) : "N/A" },
                ].map((item) => (
                  <div key={item.label} className="w-[30%] bg-white rounded-lg shadow-md p-4">
                    <h3 className="font-sans text-sm mb-2 text-center">{item.label}</h3>
                    <p className="font-primary text-xl text-center text-gray-600">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex-grow bg-white rounded-lg shadow-md p-4 flex flex-col">
                {selectedCity ? (
                  <>
                    <div className="flex flex-col items-center">
                    <p className="text-gray-600 text-sm md:text-base mb-4 font-primary">
                      Earthquake history for {selectedCity}:
                    </p>
                    </div>
                    <div className="flex-grow flex justify-center items-center">
                      <TrendChart earthquakes={filteredEarthquakes} />
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600 text-sm md:text-base">
                    Please select a city to view earthquake details.
                  </p>
                )}
              </div>


              
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#2C2C2C] text-white p-4">
        <div className="container mx-auto text-center">
          <p className="uppercase text-sm">&copy; 2024 SANLILIM. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      {/* Add the modal component */}
      <ListShelterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleShelterSubmit}
        provinces={provinces}
        cities={locations.filter(loc => loc.Province === shelterSelectedProvince).map(loc => loc.City)}
      />
    </div>
  );
}