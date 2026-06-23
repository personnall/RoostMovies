import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineFilm, HiOutlineCollection, HiOutlineUser } from 'react-icons/hi';

const MobileBottomNav = () => {
  const links = [
    { name: 'Home', path: '/', icon: HiOutlineHome },
    { name: 'Movies', path: '/movies', icon: HiOutlineFilm },
    { name: 'TV', path: '/tv', icon: HiOutlineCollection },
    { name: 'People', path: '/people', icon: HiOutlineUser },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-background/80 backdrop-blur-xl border-t border-white/5 px-6 py-3">
      <div className="flex items-center justify-between">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-white/40'
              }`
            }
          >
            <link.icon className="text-2xl" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{link.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
