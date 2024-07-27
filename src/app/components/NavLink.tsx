import React from 'react';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    isActive: boolean;
    isEarthquakeSection: boolean;
    mobile?: boolean;
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, isActive, isEarthquakeSection, mobile = false, onClick }) => {
    const baseClasses = `relative group tracking-tighter ${isEarthquakeSection ? 'text-[#F05454]' : 'text-white'}`;
    const mobileClasses = 'block py-2';
    const desktopClasses = '';

    return (
        <a 
            href={href} 
            className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
            onClick={onClick}
        >
            {children}
            <span className={`absolute bottom-0 left-0 w-full h-0.5 transform transition-transform duration-300 
                ${isActive ? 'scale-x-100' : 'scale-x-0'} 
                group-hover:scale-x-100
                ${isEarthquakeSection ? 'bg-[#F05454]' : 'bg-white'}`}
            />
        </a>
    );
};

export default NavLink;