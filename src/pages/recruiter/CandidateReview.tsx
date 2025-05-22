import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Filter, CheckCircle, 
  AlertCircle, Clock, ChevronDown, FileText, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useJobs } from '../../contexts/JobsContext';
import { useAssignments } from '../../contexts/AssignmentsContext';

const CandidateReview: React.FC = () => {
  const { user } = useUser();
  const { jobs, getRecruiterJobs, getJobApplications, updateApplication } = useJobs();
  const { studentAssignments, assignments, updateSubmissionReview } = useAssignments();
  const navigate = useNavigate();
  
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [selectedScore, setSelectedScore] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'applications' | 'assignments'>('applications');
  const [recruiterJobs, setRecruiterJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<any[]>([]);
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  
  useEffect(() => {
    if (user) {
      const userJobs = getRecruiterJobs(user.id);
      setRecruiterJobs(userJobs);
      
      // Get all applications for recruiter jobs
      const allApplications: any[] = [];
      userJobs.forEach(job => {
        const jobApps = getJobApplications(job.id);
        allApplications.push(...jobApps);
      });
      
      // Sort by date (newest first)
      const sortedApps = allApplications.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setApplications(sortedApps);
      
      // Get pending assignment submissions
      const pending = studentAssignments
        .filter(sa => 
          sa.status === 'completed' && 
          sa.submissions.some(sub => 
            userJobs.some(job => job.id === sub.jobId)
          )
        );
      
      setPendingAssignments(pending);
    }
  }, [user, jobs, studentAssignments, getRecruiterJobs, getJobApplications]);
  
  // Filter applications based on selected filters
  const filteredApplications = applications.filter(app => {
    const matchesJob = selectedJob === 'all' || app.jobId === selectedJob;
    const matchesScore = selectedScore === 'all' || 
      (selectedScore === 'high' && app.matchScore >= 80) ||
      (selectedScore === 'medium' && app.matchScore >= 40 && app.matchScore < 80) ||
      (selectedScore === 'low' && app.matchScore < 40);
    const matchesSearch = searchTerm === '' || 
      app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesJob && matchesScore && matchesSearch;
  });
  
  // Filter assignment submissions based on selected job
  const filteredAssignments = pendingAssignments.filter(sa => {
    return sa.submissions.some(sub => 
      selectedJob === 'all' || sub.jobId === selectedJob
    );
  });
  
  const handleReviewApplication = (applicationId: string, status: 'accepted' | 'rejected') => {
    updateApplication(applicationId, { status });
    
    // Refresh applications list
    if (user) {
      const userJobs = getRecruiterJobs(user.id);
      const allApplications: any[] = [];
      userJobs.forEach(job => {
        const jobApps = getJobApplications(job.id);
        allApplications.push(...jobApps);
      });
      
      const sortedApps = allApplications.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setApplications(sortedApps);
    }
  };
  
  const handleReviewAssignment = (studentId: string, assignmentId: string, jobId: string) => {
    updateSubmissionReview(studentId, assignmentId, jobId, {
      reviewed: true,
      feedback: feedback || 'Thank you for your submission!',
      reviewDate: new Date().toISOString()
    });
    
    setFeedback('');
    setExpandedAssignment(null);
    
    // Refresh assignment list
    if (user) {
      const userJobs = getRecruiterJobs(user.id);
      const pending = studentAssignments
        .filter(sa => 
          sa.status === 'completed' && 
          sa.submissions.some(sub => 
            userJobs.some(job => job.id === sub.jobId)
          )
        );
      
      setPendingAssignments(pending);
    }
  };
  
  const getAssignmentById = (id: string) => {
    return assignments.find(a => a.id === id);
  };
  
  const getJobById = (id: string) => {
    return jobs.find(j => j.id === id);
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
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Candidate Review</h1>
          
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('applications')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  viewMode === 'applications'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => setViewMode('assignments')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  viewMode === 'assignments'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Assignments
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            {/* Search Bar */}
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={viewMode === 'applications' ? "Search candidates..." : "Search assignments..."}
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
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                >
                  <option value="all">All Jobs</option>
                  {recruiterJobs.map((job, index) => (
                    <option key={index} value={job.id}>{job.title}</option>
                  ))}
                </select>
              </div>
              
              {viewMode === 'applications' && (
                <div className="w-40">
                  <select
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedScore}
                    onChange={(e) => setSelectedScore(e.target.value)}
                  >
                    <option value="all">All Scores</option>
                    <option value="high">High Match (80%+)</option>
                    <option value="medium">Medium Match (40-79%)</option>
                    <option value="low">Low Match (0-39%)</option>
                  </select>
                </div>
              )}
              
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedJob('all');
                  setSelectedScore('all');
                }}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        
        {/* Applications List */}
        {viewMode === 'applications' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {filteredApplications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredApplications.map((application, index) => {
                  const job = getJobById(application.jobId);
                  const isExpanded = expandedCandidate === application.id;
                  
                  return (
                    <div key={index} className={`${isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <div 
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedCandidate(isExpanded ? null : application.id)}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-medium flex-shrink-0">
                              {application.candidateName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{application.candidateName}</h3>
                              <p className="text-sm text-gray-600">{application.candidateEmail}</p>
                              <div className="text-xs text-gray-500 mt-1">
                                Applied {new Date(application.date).toLocaleDateString()} • {job?.title}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-3 md:mt-0">
                            <div className={`mr-4 px-3 py-1 rounded-full text-xs font-medium ${
                              application.matchScore >= 80 
                                ? 'bg-green-100 text-green-800' 
                                : application.matchScore >= 40 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {application.matchScore}% Match
                            </div>
                            
                            <ChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1">
                          <div className="border-t border-gray-200 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3">Resume</h4>
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                  <div className="mb-3">
                                    <h5 className="text-sm font-medium text-gray-700">Skills</h5>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {application.skills?.map((skill: string, i: number) => (
                                        <span key={i} className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="mb-3">
                                    <h5 className="text-sm font-medium text-gray-700">Education</h5>
                                    <p className="text-sm text-gray-600 mt-1">{application.education || 'Not provided'}</p>
                                  </div>
                                  
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-700">Experience</h5>
                                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                                      {application.experience || 'Not provided'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3">Application Status</h4>
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                  <div className="flex items-center mb-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      application.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : application.status === 'accepted'
                                          ? 'bg-green-100 text-green-800'
                                          : application.status === 'rejected'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {application.status === 'pending' ? 'Pending Review' : 
                                       application.status === 'accepted' ? 'Accepted' :
                                       application.status === 'rejected' ? 'Rejected' : 'New'}
                                    </span>
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleReviewApplication(application.id, 'accepted')}
                                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
                                      disabled={application.status === 'accepted'}
                                    >
                                      <ThumbsUp className="h-4 w-4 mr-1" />
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => handleReviewApplication(application.id, 'rejected')}
                                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
                                      disabled={application.status === 'rejected'}
                                    >
                                      <ThumbsDown className="h-4 w-4 mr-1" />
                                      Reject
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="mt-4">
                                  <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                                  <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Add private notes about this candidate..."
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600">
                  There are no applications matching your filters.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Assignments List */}
        {viewMode === 'assignments' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {filteredAssignments.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredAssignments.map((studentAssignment, index) => {
                  // Find assignment details
                  const assignment = getAssignmentById(studentAssignment.assignmentId);
                  if (!assignment) return null;
                  
                  // Find submissions for selected job
                  const submissions = studentAssignment.submissions.filter(sub => 
                    selectedJob === 'all' || sub.jobId === selectedJob
                  );
                  
                  if (submissions.length === 0) return null;
                  
                  const isExpanded = expandedAssignment === studentAssignment.id;
                  
                  return (
                    <div key={index} className={`${isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <div 
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedAssignment(isExpanded ? null : studentAssignment.id)}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-medium flex-shrink-0">
                              {studentAssignment.studentName?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{studentAssignment.studentName || 'Student'}</h3>
                              <p className="text-sm text-gray-600">{assignment.title}</p>
                              <div className="text-xs text-gray-500 mt-1">
                                Category: {assignment.category}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-3 md:mt-0">
                            <div className="mr-4 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {submissions.length} Submission{submissions.length !== 1 && 's'}
                            </div>
                            
                            <ChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1">
                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-medium text-gray-900 mb-3">Assignment Responses</h4>
                            
                            <div className="space-y-4">
                              {assignment.questions.map((question: any, qIndex: number) => (
                                <div key={qIndex} className="bg-white border border-gray-200 rounded-lg p-4">
                                  <h5 className="font-medium text-gray-800 mb-2">
                                    {qIndex + 1}. {question.text}
                                  </h5>
                                  <div className="bg-gray-50 p-3 rounded">
                                    <p className="text-gray-800">
                                      {studentAssignment.answers?.[question.id] || 'No response'}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-6">
                              <h4 className="font-medium text-gray-900 mb-3">Provide Feedback</h4>
                              
                              <div className="space-y-4">
                                <textarea
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  rows={3}
                                  placeholder="Enter feedback for the student..."
                                  value={feedback}
                                  onChange={(e) => setFeedback(e.target.value)}
                                />
                                
                                <div className="flex flex-wrap gap-2">
                                  {submissions.map((submission, sIndex) => {
                                    const job = getJobById(submission.jobId);
                                    
                                    return (
                                      <button
                                        key={sIndex}
                                        onClick={() => handleReviewAssignment(
                                          studentAssignment.studentId,
                                          studentAssignment.assignmentId,
                                          submission.jobId
                                        )}
                                        disabled={submission.reviewed}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                          submission.reviewed
                                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                      >
                                        {submission.reviewed 
                                          ? `Reviewed for ${job?.title}`
                                          : `Submit Feedback for ${job?.title}`}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-600">
                  There are no assignment submissions matching your filters.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateReview;