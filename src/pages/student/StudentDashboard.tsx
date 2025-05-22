import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowUpRight, FileText, Clock, MapPin, Building } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useJobs } from '../../contexts/JobsContext';
import JobCard from '../../components/student/JobCard';

const StudentDashboard: React.FC = () => {
  const { user } = useUser();
  const { jobs, getJobMatches } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [jobMatches, setJobMatches] = useState<any[]>([]);
  
  useEffect(() => {
    // Get job matches for the current user
    if (user) {
      const matches = getJobMatches(user.id);
      setJobMatches(matches);
    }
  }, [user, getJobMatches]);
  
  // Filter jobs based on search and filters
  const filteredJobs = jobMatches.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = filterType === '' || job.type === filterType;
    const matchesLocation = filterLocation === '' || job.location.includes(filterLocation);
    
    return matchesSearch && matchesType && matchesLocation;
  });
  
  // Group jobs by match level
  const highMatchJobs = filteredJobs.filter(job => job.matchScore >= 80);
  const mediumMatchJobs = filteredJobs.filter(job => job.matchScore >= 40 && job.matchScore < 80);
  const lowMatchJobs = filteredJobs.filter(job => job.matchScore < 40);
  
  // Get unique job types and locations for filters
  const jobTypes = [...new Set(jobs.map(job => job.type))];
  const jobLocations = [...new Set(jobs.map(job => job.location.split(',')[0].trim()))];
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Find your perfect internship match</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Link 
              to="/student/resume" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Update Resume
            </Link>
            <Link 
              to="/student/assignments" 
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center"
            >
              <Clock className="h-4 w-4 mr-2" />
              View Assignments
            </Link>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            {/* Search Bar */}
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex space-x-3">
              <div className="w-40">
                <select
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">Job Type</option>
                  {jobTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="w-40">
                <select
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                >
                  <option value="">Location</option>
                  {jobLocations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('');
                  setFilterLocation('');
                }}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        
        {/* Job Matches Sections */}
        <div className="space-y-8">
          {/* High Match Jobs */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              High Match Jobs (80%+)
            </h2>
            
            {highMatchJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {highMatchJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">No high match jobs found. Try updating your resume to improve matches.</p>
                <Link to="/student/resume" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                  Update Resume
                </Link>
              </div>
            )}
          </div>
          
          {/* Medium Match Jobs */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              Medium Match Jobs (40-79%)
            </h2>
            
            {mediumMatchJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediumMatchJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">No medium match jobs found. Try adjusting your search filters.</p>
              </div>
            )}
          </div>
          
          {/* Low Match Jobs */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Low Match Jobs (Below 40%)
            </h2>
            
            {lowMatchJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowMatchJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">No low match jobs found. You're doing great!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;