import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, PlusCircle, Users, BriefcaseIcon, Search,
  CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useJobs } from '../../contexts/JobsContext';
import { useAssignments } from '../../contexts/AssignmentsContext';

const RecruiterDashboard: React.FC = () => {
  const { user } = useUser();
  const { jobs, getRecruiterJobs, getJobApplications } = useJobs();
  const { studentAssignments } = useAssignments();
  const [recruiterJobs, setRecruiterJobs] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<any[]>([]);
  
  useEffect(() => {
    if (user) {
      const userJobs = getRecruiterJobs(user.id);
      setRecruiterJobs(userJobs);
      
      // Get applications for all recruiter jobs
      const applications: any[] = [];
      userJobs.forEach(job => {
        const jobApps = getJobApplications(job.id);
        applications.push(...jobApps);
      });
      
      // Sort by date (newest first) and take the first 5
      const sortedApps = applications.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 5);
      
      setRecentApplications(sortedApps);
      
      // Get pending assignment submissions
      const pending = studentAssignments
        .filter(sa => 
          sa.status === 'completed' && 
          sa.submissions.some(sub => 
            userJobs.some(job => job.id === sub.jobId && !sub.reviewed)
          )
        )
        .slice(0, 5);
      
      setPendingAssignments(pending);
    }
  }, [user, jobs, studentAssignments, getRecruiterJobs, getJobApplications]);
  
  // Calculate dashboard stats
  const totalApplications = recruiterJobs.reduce(
    (sum, job) => sum + (job.applications?.length || 0), 
    0
  );
  
  const averageMatchScore = recentApplications.length > 0
    ? Math.round(recentApplications.reduce((sum, app) => sum + app.matchScore, 0) / recentApplications.length)
    : 0;
  
  const totalOpenJobs = recruiterJobs.filter(job => job.status === 'open').length;
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Link 
              to="/recruiter/post-job" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
            <Link 
              to="/recruiter/candidates" 
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center"
            >
              <Users className="h-4 w-4 mr-2" />
              Review Candidates
            </Link>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <BriefcaseIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Open Positions</p>
                <h3 className="text-2xl font-bold">{totalOpenJobs}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Applications</p>
                <h3 className="text-2xl font-bold">{totalApplications}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Avg. Match Score</p>
                <h3 className="text-2xl font-bold">{averageMatchScore}%</h3>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Applications</h2>
            <Link to="/recruiter/candidates" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {recentApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Match Score
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Applied
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentApplications.map((application, index) => {
                    const job = jobs.find(j => j.id === application.jobId);
                    
                    return (
                      <tr key={index}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{application.candidateName}</div>
                          <div className="text-sm text-gray-500">{application.candidateEmail}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {job?.title}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            application.matchScore >= 80 
                              ? 'bg-green-100 text-green-800' 
                              : application.matchScore >= 40 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {application.matchScore}%
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(application.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            application.status === 'reviewed' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {application.status === 'reviewed' ? 'Reviewed' : 'New'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No applications yet</p>
            </div>
          )}
        </div>
        
        {/* Assignment Submissions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Assignment Submissions</h2>
            <Link to="/recruiter/candidates" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {pendingAssignments.length > 0 ? (
            <div className="space-y-4">
              {pendingAssignments.map((assignment, index) => {
                // Find the first unreviewed submission for a job posted by this recruiter
                const submission = assignment.submissions.find(sub => 
                  recruiterJobs.some(job => job.id === sub.jobId && !sub.reviewed)
                );
                
                if (!submission) return null;
                
                const job = jobs.find(j => j.id === submission.jobId);
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{assignment.assignmentTitle}</h3>
                      <p className="text-sm text-gray-600">
                        For: {job?.title} • Submitted: {new Date(submission.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Link 
                      to="/recruiter/candidates" 
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Review
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No pending assignment submissions</p>
            </div>
          )}
        </div>
        
        {/* Active Job Listings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Active Job Listings</h2>
            <Link to="/recruiter/post-job" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Post New Job
            </Link>
          </div>
          
          {recruiterJobs.filter(job => job.status === 'open').length > 0 ? (
            <div className="space-y-4">
              {recruiterJobs
                .filter(job => job.status === 'open')
                .map((job, index) => (
                  <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm text-gray-600">
                        {job.applications?.length || 0} applications • Posted: {new Date(job.datePosted).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        to="/recruiter/candidates" 
                        className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-50 text-sm"
                      >
                        View Applicants
                      </Link>
                      <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 text-sm">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No active job listings</p>
              <Link 
                to="/recruiter/post-job"
                className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Post Your First Job
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;