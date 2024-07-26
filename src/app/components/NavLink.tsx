import React from 'react';
import Link from 'next/link';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    isActive: boolean;
    isEarthquakeSection: boolean;
    mobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, isActive, isEarthquakeSection, mobile = false }) => {
    const baseClasses = `relative group tracking-tighter ${isEarthquakeSection ? 'text-[#F05454]' : 'text-white'}`;
    const mobileClasses = 'block py-2';
    const desktopClasses = '';

    return (
    <Link href={href} className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}>
        {children}
        <span className={`absolute bottom-0 left-0 w-full h-0.5 transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} ${isEarthquakeSection ? 'bg-[#F05454]' : 'bg-white'}`}></span>
    </Link>
    );
};

export default NavLink;