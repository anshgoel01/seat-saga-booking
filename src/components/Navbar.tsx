
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, Film, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be replaced with actual auth state

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogin = () => {
    navigate('/login');
    closeMenu();
  };

  const handleLogout = () => {
    // Handle logout logic here
    setIsLoggedIn(false);
    closeMenu();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center" onClick={closeMenu}>
              <span className="text-xl font-bold tracking-tight text-primary">CineTix</span>
            </NavLink>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink 
              to="/"
              className={({ isActive }) => cn(
                "px-2 py-1 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "text-primary-foreground bg-primary" 
                  : "text-foreground hover:text-primary hover:bg-secondary"
              )}
            >
              Home
            </NavLink>
            <NavLink 
              to="/movies"
              className={({ isActive }) => cn(
                "px-2 py-1 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "text-primary-foreground bg-primary" 
                  : "text-foreground hover:text-primary hover:bg-secondary"
              )}
            >
              Movies
            </NavLink>
            
            {isLoggedIn ? (
              <>
                <NavLink 
                  to="/account"
                  className={({ isActive }) => cn(
                    "px-2 py-1 text-sm font-medium rounded-md transition-colors",
                    isActive 
                      ? "text-primary-foreground bg-primary" 
                      : "text-foreground hover:text-primary hover:bg-secondary"
                  )}
                >
                  My Account
                </NavLink>
                <Button variant="outline" onClick={handleLogout} className="ml-2">
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={handleLogin} className="ml-2">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              className={({ isActive }) => cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive
                  ? "text-primary-foreground bg-primary"
                  : "text-foreground hover:text-primary hover:bg-secondary"
              )}
              onClick={closeMenu}
            >
              <Home className="h-4 w-4 inline mr-2" />
              Home
            </NavLink>
            <NavLink
              to="/movies"
              className={({ isActive }) => cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive
                  ? "text-primary-foreground bg-primary"
                  : "text-foreground hover:text-primary hover:bg-secondary"
              )}
              onClick={closeMenu}
            >
              <Film className="h-4 w-4 inline mr-2" />
              Movies
            </NavLink>
            
            {isLoggedIn ? (
              <>
                <NavLink
                  to="/account"
                  className={({ isActive }) => cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    isActive
                      ? "text-primary-foreground bg-primary"
                      : "text-foreground hover:text-primary hover:bg-secondary"
                  )}
                  onClick={closeMenu}
                >
                  <User className="h-4 w-4 inline mr-2" />
                  My Account
                </NavLink>
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  className="mt-3 w-full"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleLogin} 
                className="mt-3 w-full"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
