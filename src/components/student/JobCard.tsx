import React, { useState } from 'react';
import { MapPin, Clock, Building, Briefcase, AlertCircle, Check, X } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useJobs } from '../../contexts/JobsContext';
import { useAssignments } from '../../contexts/AssignmentsContext';

interface JobCardProps {
  job: any;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { user } = useUser();
  const { applyToJob, hasApplied } = useJobs();
  const { studentAssignments } = useAssignments();
  const [showDetails, setShowDetails] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(hasApplied(user?.id, job.id));
  
  // Check if user has completed all required assignments
  const hasCompletedAssignments = () => {
    if (!user || !job.requiredAssignments?.length) return true;
    
    // Find assignments completed by student
    const completedAssignments = studentAssignments
      .filter(sa => sa.studentId === user.id && sa.status === 'completed')
      .map(sa => sa.assignment?.category);
    
    // Check if all required assignments are completed
    return job.requiredAssignments.every((req: string) => 
      completedAssignments.includes(req)
    );
  };
  
  const missingAssignments = () => {
    if (!user || !job.requiredAssignments?.length) return [];
    
    // Find assignments completed by student
    const completedAssignments = studentAssignments
      .filter(sa => sa.studentId === user.id && sa.status === 'completed')
      .map(sa => sa.assignment?.category);
    
    // Return list of missing assignments
    return job.requiredAssignments.filter((req: string) => 
      !completedAssignments.includes(req)
    );
  };
  
  const handleApply = () => {
    if (!user) return;
    
    setApplying(true);
    
    // Simulate API call delay
    setTimeout(() => {
      applyToJob(user.id, job.id);
      setApplied(true);
      setApplying(false);
    }, 800);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition">
      <div className="p-5">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <img 
              src={job.logoUrl} 
              alt={`${job.company} logo`} 
              className="w-12 h-12 rounded-md object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
            
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </span>
              <span className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {job.type}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(job.datePosted).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.matchScore >= 80 
              ? 'bg-green-100 text-green-800' 
              : job.matchScore >= 40 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
          }`}>
            {job.matchScore}% Match
          </div>
          
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
        </div>
        
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
              <p className="text-sm text-gray-700">{job.description}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
              <p className="text-sm text-gray-700">{job.requirements}</p>
            </div>
            
            {job.requiredAssignments?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Required Assignments</h4>
                <div className="flex flex-wrap gap-2">
                  {job.requiredAssignments.map((req: string, index: number) => (
                    <span 
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        hasCompletedAssignments() && !missingAssignments().includes(req)
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {hasCompletedAssignments() && !missingAssignments().includes(req) ? (
                        <Check className="h-3 w-3 inline mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                      )}
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={handleApply}
              disabled={applied || applying || !hasCompletedAssignments()}
              className={`w-full mt-2 py-2 rounded-lg font-medium flex items-center justify-center ${
                applied
                  ? 'bg-green-600 text-white cursor-default'
                  : !hasCompletedAssignments()
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {applying ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Applying...
                </>
              ) : applied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Applied
                </>
              ) : !hasCompletedAssignments() ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Complete Required Assignments
                </>
              ) : (
                <>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Apply Now
                </>
              )}
            </button>
            
            {!hasCompletedAssignments() && (
              <div className="mt-2 text-sm text-red-600">
                <p>You need to complete the following assignments:</p>
                <ul className="list-disc list-inside mt-1">
                  {missingAssignments().map((assignment, index) => (
                    <li key={index}>{assignment}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;