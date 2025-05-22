import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, FileText, BarChart, PlusCircle,
  Edit, Trash2, CheckCircle, X, Filter
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useJobs } from '../../contexts/JobsContext';
import { useAssignments } from '../../contexts/AssignmentsContext';

const AdminPortal: React.FC = () => {
  const { user } = useUser();
  const { jobs, applications } = useJobs();
  const { assignments, studentAssignments } = useAssignments();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'assignments' | 'users'>('overview');
  const [users, setUsers] = useState<any[]>([]);
  
  useEffect(() => {
    // Load users from localStorage
    try {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (e) {
      console.error('Error loading users:', e);
    }
  }, []);
  
  // Stats for overview
  const totalUsers = users.length;
  const totalJobs = jobs.length;
  const totalAssignments = assignments.length;
  const totalApplications = applications.length;
  
  const studentCount = users.filter(u => u.role === 'student').length;
  const recruiterCount = users.filter(u => u.role === 'recruiter').length;
  
  const completedAssignments = studentAssignments.filter(sa => sa.status === 'completed').length;
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Admin Portal</h1>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === 'overview' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Dashboard Overview
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === 'jobs' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Manage Jobs
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === 'assignments' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Manage Assignments
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === 'users' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Platform Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-medium">Total Users</h3>
                  </div>
                  <p className="text-3xl font-bold">{totalUsers}</p>
                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">{studentCount} Students, {recruiterCount} Recruiters</span>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center mb-2">
                    <Briefcase className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-medium">Active Jobs</h3>
                  </div>
                  <p className="text-3xl font-bold">{totalJobs}</p>
                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">{jobs.filter(j => j.status === 'open').length} Open Positions</span>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="text-lg font-medium">Assignments</h3>
                  </div>
                  <p className="text-3xl font-bold">{totalAssignments}</p>
                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">{completedAssignments} Completed</span>
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-6">
                  <div className="flex items-center mb-2">
                    <BarChart className="h-5 w-5 text-orange-600 mr-2" />
                    <h3 className="text-lg font-medium">Applications</h3>
                  </div>
                  <p className="text-3xl font-bold">{totalApplications}</p>
                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">
                      {applications.filter(a => a.status === 'accepted').length} Accepted
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Sample activity data - in a real app this would come from a database */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            New Job Posted
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          Sarah Miller
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Backend Developer Intern
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Application Submitted
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          Alex Johnson
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Frontend Developer Intern
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                            Assignment Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          Jamie Smith
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Marketing Campaign Analysis
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">System Status</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <h4 className="font-medium">Database Status</h4>
                    </div>
                    <p className="text-sm text-gray-600">All systems operational</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <h4 className="font-medium">API Status</h4>
                    </div>
                    <p className="text-sm text-gray-600">All endpoints responding</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <h4 className="font-medium">Storage Status</h4>
                    </div>
                    <p className="text-sm text-gray-600">60% capacity available</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Manage Jobs</h2>
                
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Job
                </button>
              </div>
              
              <div className="mb-4 flex items-center space-x-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Posted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applications
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map((job, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={job.logoUrl} 
                              alt={`${job.company} logo`} 
                              className="h-8 w-8 rounded-full mr-3 object-cover"
                            />
                            <div className="text-sm font-medium text-gray-900">
                              {job.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(job.datePosted).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            job.status === 'open'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {job.status === 'open' ? 'Open' : 'Closed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.applications?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Manage Assignments</h2>
                
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Assignment
                </button>
              </div>
              
              <div className="mb-4 flex items-center space-x-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search assignments..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option value="all">All Categories</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Product">Product</option>
                  <option value="Analytics">Analytics</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assignments.map((assignment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-lg">{assignment.title}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {assignment.category}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {assignment.description.length > 100 
                        ? `${assignment.description.substring(0, 100)}...` 
                        : assignment.description}
                    </p>
                    
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {assignment.questions.length} Questions
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {assignment.estimatedTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Manage Users</h2>
                
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add User
                </button>
              </div>
              
              <div className="mb-4 flex items-center space-x-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="recruiter">Recruiters</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              {user.company && (
                                <div className="text-sm text-gray-500">
                                  {user.company}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'student'
                              ? 'bg-green-100 text-green-800'
                              : user.role === 'recruiter'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;