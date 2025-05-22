import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">InternMatch</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Connecting students with their dream internships through smart matching and standardized assignments.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Students</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-gray-400 hover:text-blue-400 transition">Sign Up</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition">Browse Internships</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition">Upload Resume</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition">Assignments</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Recruiters</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-gray-400 hover:text-blue-400 transition">Sign Up</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition">Post a Job</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition">Find Candidates</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition">Assignment Templates</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Contact us at <a href="mailto:info@internmatch.com" className="text-blue-400 hover:underline">info@internmatch.com</a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} InternMatch. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/" className="text-gray-400 hover:text-blue-400 transition text-sm">Privacy Policy</Link>
            <Link to="/" className="text-gray-400 hover:text-blue-400 transition text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;