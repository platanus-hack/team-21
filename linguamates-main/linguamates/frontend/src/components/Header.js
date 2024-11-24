import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { useUser } from './UserContext';

const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 100" className="h-8">
    <g>
      <rect x="0" y="10" width="80" height="80" fill="#fff5d6" rx="15"/>
      <path d="M25 25 L40 25 L40 65 L60 65 L60 75 L25 75 Z" fill="black"/>
      <text x="100" y="70" fill="#fff5d6" font-family="Arial, sans-serif" font-size="48" font-weight="500">inguaMates</text>
    </g>
  </svg>
);

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('sessionId');
    setUser(null);
    navigate('/login');
    setIsOpen(false);
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 }
  };

  const AnimatedLink = ({ to, children, onClick }) => (
    <motion.div
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      <Link 
        to={to} 
        className="mx-2 px-3 py-2 rounded-md bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#fff5d6] transition-colors" 
        onClick={onClick}
      >
        {children}
      </Link>
    </motion.div>
  );

  const AnimatedButton = ({ onClick, children }) => (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="mx-2 px-3 py-2 rounded-md bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#fff5d6] transition-colors"
      onClick={onClick}
    >
      {children}
    </motion.button>
  );

  const ProfileIcon = () => (
    <motion.div
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      <Link to="/profile" className="mx-2 p-2 rounded-full text-[#fff5d6]">
        <User size={24} />
      </Link>
    </motion.div>
  );

  const renderNavLinks = (isMobile = false) => (
    <>
      <AnimatedLink to="/practice" onClick={isMobile ? () => setIsOpen(false) : undefined}>Practice</AnimatedLink>
      {(user?.role === 'student' || user?.role === 'both') && (
      <AnimatedLink to="/progress" onClick={isMobile ? () => setIsOpen(false) : undefined}>Progress</AnimatedLink>
      )}
      {(user?.role === 'student' || user?.role === 'both') && (
        <AnimatedLink to="/find-tutor" onClick={isMobile ? () => setIsOpen(false) : undefined}>Find Tutor</AnimatedLink>
      )}
      <AnimatedLink to="/dashboard" onClick={isMobile ? () => setIsOpen(false) : undefined}>Dashboard</AnimatedLink>
      {isMobile && <AnimatedLink to="/settings" onClick={() => setIsOpen(false)}>Settings</AnimatedLink>}
      <AnimatedButton onClick={handleLogout}>Logout</AnimatedButton>
    </>
  );

  return (
    <motion.header 
      className="bg-black text-[#fff5d6] p-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-48"
        >
          <Link to="/">
            <Logo />
          </Link>
        </motion.div>
        <nav className="hidden md:flex items-center">
          {user ? (
            <>
              {renderNavLinks()}
              <ProfileIcon />
            </>
          ) : (
            <>
              <AnimatedLink to="/login">Login</AnimatedLink>
              <AnimatedLink to="/signup">Sign Up</AnimatedLink>
            </>
          )}
        </nav>
        <motion.button
          className="md:hidden text-[#fff5d6]"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.nav 
            className="md:hidden mt-4"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col space-y-2">
              {user ? renderNavLinks(true) : (
                <>
                  <AnimatedLink to="/login" onClick={() => setIsOpen(false)}>Login</AnimatedLink>
                  <AnimatedLink to="/signup" onClick={() => setIsOpen(false)}>Sign Up</AnimatedLink>
                </>
              )}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;