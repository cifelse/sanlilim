// components/Navbar.tsx
import React, { useState } from 'react';
import Image from 'next/image';

interface NavLinkProps {
  href: string;
  isActive: boolean;
  isEarthquakeSection: boolean;
  mobile?: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, isActive, isEarthquakeSection, mobile, onClick, children }) => {
  const baseClasses = "font-primary transition-colors duration-300";
  const mobileClasses = mobile ? "block py-2" : "";
  const activeClasses = isActive ? "font-bold" : "";
  const colorClasses = isEarthquakeSection
    ? "text-[#F05454] hover:text-[#F05454]/80"
    : "text-white hover:text-white/80";

  return (
    <a
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${mobileClasses} ${activeClasses} ${colorClasses}`}
    >
      {children}
    </a>
  );
};

interface NavbarProps {
  isEarthquakeSection: boolean;
  activeSection: string;
  smoothScroll: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isEarthquakeSection, activeSection, smoothScroll }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { href: "#shelter-finder", text: "Shelter Finder" },
    { href: "#earthquake-monitor", text: "QuakeMonitor" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 p-4 transition-colors duration-300 ${isEarthquakeSection ? 'bg-[#F6F4E6]' : 'bg-[#F05454]'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/images/Sanlilim.svg" alt="Sanlilim Logo" width={32} height={32} className="mr-2" />
          <span className={`font-primary font-bold text-xl ${isEarthquakeSection ? 'text-[#F05454]' : 'text-white'}`}>SANLILIM</span>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className={`${isEarthquakeSection ? 'text-[#F05454]' : 'text-white'}`}>
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              isActive={activeSection === link.href.slice(1)}
              isEarthquakeSection={isEarthquakeSection}
              onClick={(e) => {
                e.preventDefault();
                smoothScroll(link.href.slice(1));
              }}
            >
              {link.text}
            </NavLink>
          ))}
          <button className={`font-primary border-2 px-4 py-2 rounded transition-colors duration-300 tracking-tighter ${isEarthquakeSection ? 'text-[#F05454] border-[#F05454] hover:bg-[#F05454] hover:text-[#F6F4E6]' : 'text-white border-white hover:bg-white hover:text-[#F05454]'}`}>
            LIST A PLACE AS SHELTER
          </button>
        </div>
      </div>

      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            isActive={activeSection === link.href.slice(1)}
            isEarthquakeSection={isEarthquakeSection}
            mobile
            onClick={(e) => {
              e.preventDefault();
              smoothScroll(link.href.slice(1));
              toggleMenu();
            }}
          >
            {link.text}
          </NavLink>
        ))}
        <button className={`w-full text-center font-primary border-2 px-4 py-2 mt-2 rounded transition-colors duration-300 tracking-tighter ${isEarthquakeSection ? 'text-[#F05454] border-[#F05454] hover:bg-[#F05454] hover:text-[#F6F4E6]' : 'text-white border-white hover:bg-white hover:text-[#F05454]'}`}>
          LIST A PLACE AS SHELTER
        </button>
      </div>
    </nav>
  );
};

export default Navbar;