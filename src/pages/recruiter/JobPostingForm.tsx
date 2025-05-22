import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Upload } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useJobs } from '../../contexts/JobsContext';
import { useAssignments } from '../../contexts/AssignmentsContext';

const JobPostingForm: React.FC = () => {
  const { user } = useUser();
  const { createJob } = useJobs();
  const { assignments } = useAssignments();
  const navigate = useNavigate();
  
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState(user?.company || '');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
  
  // Group assignments by category
  const assignmentsByCategory: { [key: string]: any[] } = {};
  assignments.forEach(assignment => {
    if (!assignmentsByCategory[assignment.category]) {
      assignmentsByCategory[assignment.category] = [];
    }
    assignmentsByCategory[assignment.category].push(assignment);
  });
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const toggleAssignmentCategory = (category: string) => {
    if (selectedAssignments.includes(category)) {
      setSelectedAssignments(selectedAssignments.filter(a => a !== category));
    } else {
      setSelectedAssignments([...selectedAssignments, category]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({
        type: 'error',
        text: 'You must be logged in to post a job'
      });
      return;
    }
    
    try {
      // Create job object
      const newJob = {
        title: jobTitle,
        company,
        location,
        type: jobType,
        description,
        requirements,
        recruiterId: user.id,
        logoUrl: logoPreview || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        requiredAssignments: selectedAssignments,
        datePosted: new Date().toISOString(),
        status: 'open'
      };
      
      createJob(newJob);
      
      setMessage({
        type: 'success',
        text: 'Job posted successfully!'
      });
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/recruiter/dashboard');
      }, 1500);
      
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred while posting the job'
      });
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/recruiter/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Post a New Job</h1>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title*
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name*
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City, State or Remote"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type*
                  </label>
                  <select
                    id="jobType"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 border rounded-lg flex items-center justify-center overflow-hidden"
                    >
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Company logo preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <label className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
                      Choose file
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: Square image, at least 200x200px
                  </p>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description*
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the role, responsibilities, and ideal candidate..."
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements*
                  </label>
                  <textarea
                    id="requirements"
                    rows={4}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="List qualifications, skills, education, etc..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Assignments
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Select which standardized assignments applicants should complete:
                  </p>
                  
                  <div className="space-y-3">
                    {Object.keys(assignmentsByCategory).map((category, index) => (
                      <label key={index} className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={selectedAssignments.includes(category)}
                          onChange={() => toggleAssignmentCategory(category)}
                          className="mt-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <div>
                          <div className="font-medium">{category}</div>
                          <div className="text-sm text-gray-600">
                            {assignmentsByCategory[category].length} available assignment{assignmentsByCategory[category].length !== 1 && 's'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/recruiter/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPostingForm;