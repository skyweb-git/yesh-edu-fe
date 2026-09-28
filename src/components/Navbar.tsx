import { useState, useEffect } from 'react';
import { NavLink as RouterNavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideTabs } from './SlideTabs';
import { OriginButton } from './OriginButton';
import logoImg from '../images/Untitled design.png';

const NavLink = ({ to, label, children }: { to: string; label: string; children?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <RouterNavLink 
        to={to} 
        className={`flex items-center gap-1 py-2 text-sm font-semibold transition-colors ${
          isActive ? 'text-[var(--color-primary)]' : 'text-gray-600 hover:text-[var(--color-primary)]'
        } whitespace-nowrap`}
      >
        {label}
        {children && <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
      </RouterNavLink>
      
      {/* Active Indicator */}
      {isActive && (
        <motion.div 
          layoutId="navbar-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--color-primary)] rounded-full"
        />
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && children && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 flex flex-col"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (location.pathname === '/login') return null;
  
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');
  const isLoggedIn = !!(userRole || userEmail);
  const isStudent = userRole === 'student';
  const dashboardLink = isLoggedIn ? `/dashboard/${userRole || 'student'}` : '/login';

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className={`bg-[#FFFDF5] border-b border-[#F3EAD8] transition-transform duration-300 ease-in-out ${
        isVisible || isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="w-full px-4 sm:px-10 lg:px-16">
          <div className="flex justify-between items-center h-16 sm:h-20 md:h-24">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 sm:gap-3 py-1 group">
                <img src={logoImg} alt="YashEdu Logo" className="h-10 sm:h-16 md:h-18 w-auto object-contain transition-all group-hover:scale-105" />
                <div className="flex flex-col font-garet">
                  <span className="text-base sm:text-2xl font-normal tracking-tight leading-none whitespace-nowrap">
                    <span className="text-[#D3010A]">Yash</span>
                    <span className="text-[#01274C]">Edu</span> <span className="text-[#01274C]">Academy</span>
                  </span>
                  <span className="text-[8px] sm:text-xs font-normal text-gray-500 uppercase tracking-widest mt-0.5 whitespace-nowrap">
                    Educational Institute
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {!isStudent && (
              <nav className="hidden md:flex items-center justify-center flex-1 px-4">
                <SlideTabs />
              </nav>
            )}

            {/* Action Buttons */}
            <div className="hidden md:flex items-center justify-end gap-4">
              <div className="flex items-center gap-4">
                {isLoggedIn ? (
                  <Link to={dashboardLink}>
                    <OriginButton 
                      className="bg-white !text-black border-2 border-black rounded-full h-11 px-7 font-bold shadow-sm"
                      fillClassName="bg-[#D3010A]"
                    >
                      Dashboard
                    </OriginButton>
                  </Link>
                ) : (
                  <Link to="/login">
                    <OriginButton 
                      className="bg-white !text-black border-2 border-black rounded-full h-11 px-7 font-bold shadow-sm"
                      fillClassName="bg-[#D3010A]"
                    >
                      Login
                    </OriginButton>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Right-Side Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Right Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] sm:w-[320px] max-w-[320px] bg-[#FFFDF5] z-50 shadow-2xl flex flex-col md:hidden border-l border-[#F3EAD8] rounded-l-2xl overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F3EAD8] bg-[#FAF6EE]">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                  <img src={logoImg} alt="YashEdu Logo" className="h-8 w-auto object-contain" />
                  <div className="flex flex-col font-garet">
                    <span className="text-base font-normal tracking-tight leading-none">
                      <span className="text-[#D3010A]">Yash</span>
                      <span className="text-[#01274C]">Edu</span> <span className="text-[#01274C]">Academy</span>
                    </span>
                    <span className="text-[8px] font-normal text-gray-500 uppercase tracking-widest mt-0.5">
                      Educational Institute
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-200/60 transition-colors focus:outline-none"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 px-4 py-4 flex flex-col overflow-y-auto">
                <div className="flex flex-col gap-1">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 font-semibold text-base py-3 px-2 border-b border-[#F3EAD8]/80 hover:text-[var(--color-primary)] transition-colors flex items-center justify-between"
                  >
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/courses"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 font-semibold text-base py-3 px-2 border-b border-[#F3EAD8]/80 hover:text-[var(--color-primary)] transition-colors flex items-center justify-between"
                  >
                    <span>Courses</span>
                  </Link>
                  <Link
                    to="/blog"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 font-semibold text-base py-3 px-2 border-b border-[#F3EAD8]/80 hover:text-[var(--color-primary)] transition-colors flex items-center justify-between"
                  >
                    <span>Blogs</span>
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 font-semibold text-base py-3 px-2 border-b border-[#F3EAD8]/80 hover:text-[var(--color-primary)] transition-colors flex items-center justify-between"
                  >
                    <span>About Us</span>
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 font-semibold text-base py-3 px-2 border-b border-[#F3EAD8]/80 hover:text-[var(--color-primary)] transition-colors flex items-center justify-between"
                  >
                    <span>Contact</span>
                  </Link>
                </div>

                <div className="mt-auto pt-4 border-t border-[#F3EAD8]">
                  {isLoggedIn ? (
                    <Link
                      to={dashboardLink}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full block"
                    >
                      <OriginButton 
                        className="w-full bg-white !text-black border-2 border-black rounded-xl h-11 font-bold text-sm shadow-sm"
                        fillClassName="bg-[#D3010A]"
                      >
                        Dashboard
                      </OriginButton>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full block"
                    >
                      <OriginButton 
                        className="w-full bg-white !text-black border-2 border-black rounded-xl h-11 font-bold text-sm shadow-sm"
                        fillClassName="bg-[#D3010A]"
                      >
                        Login
                      </OriginButton>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
