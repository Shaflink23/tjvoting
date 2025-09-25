import React from 'react';
import logo from '../images/tek_juicel_group_logo.png';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isAdminOrVote = location.pathname === '/admin' || location.pathname === '/admin-dashboard' || location.pathname === '/vote';
    const [menuOpen, setMenuOpen] = React.useState(false);
    return (
      <nav
        className={`container mx-auto px-4 sm:px-6 py-4 h-16 w-full ${isAdminOrVote ? 'bg-[#F6F6F7]' : 'bg-gradient-to-r from-yellow-100 via-yellow-100 to-white'}`}
        style={isAdminOrVote ? { backgroundColor: '#F6F6F7' } : {}}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Tek Juice Logo" className="h-10 w-30 mr-2 object-cover rounded" style={{ width: '120px', height: '40px' }} />
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="text-gray-700 hover:text-[#f6931b] font-medium transition">Home</Link>
            <Link to="/vote" className="text-gray-700 hover:text-[#f6931b] font-medium transition">Vote</Link>
            <Link to="/admin" className="text-gray-700 hover:text-[#f6931b] font-medium transition">Admin</Link>
          </div>
          {/* Mobile Menu Button */}
          <button className="md:hidden flex items-center px-2 py-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open Menu">
            <svg className="h-7 w-7 text-[#f6931b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-2 mt-2 bg-white rounded-lg shadow-lg p-4 absolute left-0 right-0 z-50">
            <Link to="/" className="text-gray-700 hover:text-[#f6931b] font-medium transition" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/vote" className="text-gray-700 hover:text-[#f6931b] font-medium transition" onClick={() => setMenuOpen(false)}>Vote</Link>
            <Link to="/admin" className="text-gray-700 hover:text-[#f6931b] font-medium transition" onClick={() => setMenuOpen(false)}>Admin</Link>
          </div>
        )}
      </nav>
    );
};

export default Header;