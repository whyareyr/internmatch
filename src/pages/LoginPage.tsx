import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, UserPlus, Building2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'student' | 'recruiter' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (activeTab === 'login') {
        // Special case for admin login
        if (email === 'admin@internmatch.com' && password === 'admin123') {
          login({
            id: 'admin1',
            name: 'Admin User',
            email: 'admin@internmatch.com',
            role: 'admin'
          });
          navigate('/admin/portal');
          return;
        }
        
        // Handle student/recruiter login
        const success = login({ email, password, role });
        
        if (success) {
          navigate(role === 'student' ? '/student/dashboard' : '/recruiter/dashboard');
        } else {
          setError('Invalid email or password');
        }
      } else {
        // Handle registration
        const success = register({ name, email, password, role });
        
        if (success) {
          navigate(role === 'student' ? '/student/dashboard' : '/recruiter/dashboard');
        } else {
          setError('Email already in use');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  // Quick login for demo purposes
  const handleQuickLogin = (userType: 'student' | 'recruiter' | 'admin') => {
    if (userType === 'student') {
      login({
        id: 'student1',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        role: 'student'
      });
      navigate('/student/dashboard');
    } else if (userType === 'recruiter') {
      login({
        id: 'recruiter1',
        name: 'Sarah Miller',
        email: 'sarah@techco.com',
        role: 'recruiter'
      });
      navigate('/recruiter/dashboard');
    } else {
      login({
        id: 'admin1',
        name: 'Admin User',
        email: 'admin@internmatch.com',
        role: 'admin'
      });
      navigate('/admin/portal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'register'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="flex justify-center mb-6">
              <Briefcase className="h-12 w-12 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">I am a:</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`flex items-center justify-center p-3 rounded-lg border ${
                      role === 'student'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setRole('student')}
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center p-3 rounded-lg border ${
                      role === 'recruiter'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setRole('recruiter')}
                  >
                    <Building2 className="h-5 w-5 mr-2" />
                    <span>Recruiter</span>
                  </button>
                </div>
              </div>
              
              {/* Name Field (Register only) */}
              {activeTab === 'register' && (
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
              
              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Password Field */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                {activeTab === 'login' ? 'Login' : 'Create Account'}
              </button>
            </form>
            
            {/* Quick Login Buttons (for demo purposes) */}
            <div className="mt-8">
              <p className="text-center text-sm text-gray-600 mb-4">Quick login for demo:</p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleQuickLogin('student')}
                  className="bg-green-100 text-green-800 hover:bg-green-200 py-2 px-3 rounded text-sm"
                >
                  Student
                </button>
                <button
                  onClick={() => handleQuickLogin('recruiter')}
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 py-2 px-3 rounded text-sm"
                >
                  Recruiter
                </button>
                <button
                  onClick={() => handleQuickLogin('admin')}
                  className="bg-purple-100 text-purple-800 hover:bg-purple-200 py-2 px-3 rounded text-sm"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;