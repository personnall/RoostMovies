import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineMenuAlt3 } from 'react-icons/hi';
import { RiMovie2Fill } from 'react-icons/ri';
import SearchOverlay from './SearchOverlay';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Anime', path: '/anime' },
    { name: 'Trending', path: '/trending' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'py-3 bg-background/80 backdrop-blur-xl border-b border-white/5' : 'py-6 bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neon-pink group-hover:scale-110 transition-transform">
            <RiMovie2Fill className="text-2xl text-white" />
          </div>
          <span className="text-2xl font-poppins font-extrabold tracking-tighter">
            CINE<span className="text-primary italic">VERSE</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === link.path ? 'text-primary' : 'text-white/70'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <HiOutlineSearch className="text-2xl" />
          </button>

          <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

          <Link to="/profile" className="hidden md:block">
            <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 hover:border-primary transition-colors">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Profile"
                className="w-full h-full rounded-full bg-surface"
              />
            </div>
          </Link>

          <button className="md:hidden w-10 h-10 flex items-center justify-center">
            <HiOutlineMenuAlt3 className="text-3xl" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
