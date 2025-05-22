import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, PenTool, Briefcase, Search } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Apply smarter,<br/> not harder
              </h1>
              <p className="text-lg md:text-xl text-blue-100">
                InternMatch connects students with their dream internships through smart profile matching and standardized assignments.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Link 
                  to="/login" 
                  className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium flex items-center justify-center transition duration-300 shadow-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/login" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 px-6 py-3 rounded-lg font-medium flex items-center justify-center transition duration-300"
                >
                  For Recruiters
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Students collaborating" 
                className="rounded-lg shadow-2xl transform -rotate-2 hover:rotate-0 transition duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How InternMatch Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform streamlines the internship application process for both students and recruiters.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Students */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-4">
                <PenTool className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Once, Apply Everywhere</h3>
              <p className="text-gray-600 mb-4">
                Upload your resume and complete standardized assignments that can be reused across multiple applications.
              </p>
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                Create Profile <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {/* Matching */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Profile Matching</h3>
              <p className="text-gray-600 mb-4">
                Our algorithm matches your skills and experience with job requirements to show you internships where you'll excel.
              </p>
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                Find Matches <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {/* For Recruiters */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Candidates</h3>
              <p className="text-gray-600 mb-4">
                Recruiters receive pre-screened candidates with match scores and standardized assignments for easy comparison.
              </p>
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                Post Internship <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Internships */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Internships</h2>
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Job Cards */}
            {[
              {
                title: "UX Design Intern",
                company: "DesignFusion",
                location: "San Francisco, CA",
                type: "Remote",
                logo: "https://images.pexels.com/photos/2103127/pexels-photo-2103127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                title: "Software Engineering Intern",
                company: "TechGrowth",
                location: "New York, NY",
                type: "Hybrid",
                logo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                title: "Marketing Analytics Intern",
                company: "BrandWave",
                location: "Chicago, IL",
                type: "On-site",
                logo: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              }
            ].map((job, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-5">
                  <div className="flex items-start mb-4">
                    <img 
                      src={job.logo} 
                      alt={`${job.company} logo`} 
                      className="w-12 h-12 rounded-md object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                    <span>{job.location}</span>
                    <span className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-1 ${
                        job.type === 'Remote' ? 'bg-green-500' : 
                        job.type === 'Hybrid' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></span>
                      {job.type}
                    </span>
                  </div>
                  <Link 
                    to="/login" 
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Internship?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students and recruiters already using InternMatch to connect talent with opportunity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/login" 
              className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition duration-300 shadow-lg"
            >
              Sign Up as Student
            </Link>
            <Link 
              to="/login" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3 rounded-lg font-medium transition duration-300"
            >
              Sign Up as Recruiter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;