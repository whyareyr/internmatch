import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, ChevronDown, Briefcase, User, PenTool } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

const Header: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isHomePage = location.pathname === '/';

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || !isHomePage 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">InternMatch</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                {user.role === 'student' && (
                  <>
                    <Link to="/student/dashboard" className="text-gray-700 hover:text-blue-600 transition">Dashboard</Link>
                    <Link to="/student/resume" className="text-gray-700 hover:text-blue-600 transition">My Resume</Link>
                    <Link to="/student/assignments" className="text-gray-700 hover:text-blue-600 transition">Assignments</Link>
                  </>
                )}
                
                {user.role === 'recruiter' && (
                  <>
                    <Link to="/recruiter/dashboard" className="text-gray-700 hover:text-blue-600 transition">Dashboard</Link>
                    <Link to="/recruiter/post-job" className="text-gray-700 hover:text-blue-600 transition">Post Job</Link>
                    <Link to="/recruiter/candidates" className="text-gray-700 hover:text-blue-600 transition">Review Candidates</Link>
                  </>
                )}
                
                {user.role === 'admin' && (
                  <Link to="/admin/portal" className="text-gray-700 hover:text-blue-600 transition">Admin Portal</Link>
                )}
                
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
                  >
                    <span>{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 mt-2">
          <div className="container mx-auto px-4 py-3 space-y-3">
            {user ? (
              <>
                <div className="py-2 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Logged in as {user.role}</p>
                </div>
                
                {user.role === 'student' && (
                  <>
                    <Link 
                      to="/student/dashboard" 
                      className="block py-2 text-gray-700 hover:text-blue-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/student/resume" 
                      className="block py-2 text-gray-700 hover:text-blue-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Resume
                    </Link>
                    <Link 
                      to="/student/assignments" 
                      className="block py-2 text-gray-700 hover:text-blue-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Assignments
                    </Link>
                  </>
                )}
                
                {user.role === 'recruiter' && (
                  <>
                    <Link 
                      to="/recruiter/dashboard" 
                      className="block py-2 text-gray-700 hover:text-blue-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/recruiter/post-job" 
                      className="block py-2 text-gray-700 hover:text-blue-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Post Job
                    </Link>
                    <Link 
                      to="/recruiter/candidates" 
                      className="block py-2 text-gray-700 hover:text-blue-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Review Candidates
                    </Link>
                  </>
                )}
                
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/portal" 
                    className="block py-2 text-gray-700 hover:text-blue-600 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Portal
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full py-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;