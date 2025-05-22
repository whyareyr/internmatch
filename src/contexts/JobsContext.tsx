import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  logoUrl: string;
  recruiterId: string;
  datePosted: string;
  status: 'open' | 'closed';
  requiredAssignments?: string[];
  applications?: string[];
}

interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  date: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  matchScore: number;
  skills?: string[];
  education?: string;
  experience?: string;
}

interface JobsContextType {
  jobs: Job[];
  applications: Application[];
  getJobMatches: (studentId: string) => any[];
  applyToJob: (studentId: string, jobId: string) => boolean;
  hasApplied: (studentId: string | undefined, jobId: string) => boolean;
  createJob: (jobData: any) => boolean;
  getJobApplications: (jobId: string) => Application[];
  getRecruiterJobs: (recruiterId: string) => Job[];
  updateApplication: (applicationId: string, data: any) => boolean;
}

const JobsContext = createContext<JobsContextType | null>(null);

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // Load jobs and applications from localStorage on mount
  useEffect(() => {
    const savedJobs = localStorage.getItem('jobs');
    const savedApplications = localStorage.getItem('applications');
    
    if (savedJobs) {
      try {
        setJobs(JSON.parse(savedJobs));
      } catch (e) {
        console.error('Error parsing saved jobs:', e);
      }
    }
    
    if (savedApplications) {
      try {
        setApplications(JSON.parse(savedApplications));
      } catch (e) {
        console.error('Error parsing saved applications:', e);
      }
    }
  }, []);

  // Save jobs and applications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);
  
  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  // Get job matches for a student based on their resume
  const getJobMatches = (studentId: string): any[] => {
    if (!studentId) return [];
    
    // Get user data to match with jobs
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const student = users.find((u: any) => u.id === studentId);
    
    if (!student || !student.resume) return [];
    
    // Calculate match score for each job
    return jobs
      .filter(job => job.status === 'open')
      .map(job => {
        // Simple matching algorithm based on skills and keywords
        let matchScore = 0;
        const studentSkills = student.resume.skills || [];
        const studentResume = `${student.resume.text || ''} ${student.resume.education || ''} ${student.resume.experience || ''}`.toLowerCase();
        
        // Extract keywords from job description and requirements
        const jobText = `${job.title} ${job.description} ${job.requirements}`.toLowerCase();
        
        // Match skills
        studentSkills.forEach((skill: string) => {
          if (jobText.includes(skill.toLowerCase())) {
            matchScore += 20; // Each matching skill adds 20 points
          }
        });
        
        // Match keywords
        const keywordMatches = ['javascript', 'react', 'node', 'python', 'java', 'marketing', 'design', 'product', 'research', 'analytics', 'leadership', 'communication', 'teamwork'];
        keywordMatches.forEach(keyword => {
          if (jobText.includes(keyword) && studentResume.includes(keyword)) {
            matchScore += 10; // Each matching keyword adds 10 points
          }
        });
        
        // Cap the score at 100
        matchScore = Math.min(matchScore, 100);
        
        return {
          ...job,
          matchScore
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore); // Sort by match score
  };

  // Apply to a job
  const applyToJob = (studentId: string, jobId: string): boolean => {
    if (!studentId || !jobId) return false;
    
    // Get user data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const student = users.find((u: any) => u.id === studentId);
    
    if (!student) return false;
    
    // Get job data
    const job = jobs.find(j => j.id === jobId);
    if (!job) return false;
    
    // Check if already applied
    if (hasApplied(studentId, jobId)) return false;
    
    // Create application
    const newApplication: Application = {
      id: `app_${Date.now()}`,
      jobId,
      candidateId: studentId,
      candidateName: student.name,
      candidateEmail: student.email,
      date: new Date().toISOString(),
      status: 'pending',
      matchScore: getJobMatches(studentId).find(j => j.id === jobId)?.matchScore || 0,
      skills: student.resume?.skills || [],
      education: student.resume?.education || '',
      experience: student.resume?.experience || ''
    };
    
    // Update applications
    setApplications([...applications, newApplication]);
    
    // Update job's applications array
    const updatedJobs = jobs.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          applications: [...(j.applications || []), newApplication.id]
        };
      }
      return j;
    });
    
    setJobs(updatedJobs);
    
    return true;
  };

  // Check if a student has already applied to a job
  const hasApplied = (studentId: string | undefined, jobId: string): boolean => {
    if (!studentId) return false;
    
    return applications.some(app => 
      app.candidateId === studentId && app.jobId === jobId
    );
  };

  // Create a new job listing
  const createJob = (jobData: any): boolean => {
    try {
      const newJob: Job = {
        id: `job_${Date.now()}`,
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        type: jobData.type,
        description: jobData.description,
        requirements: jobData.requirements,
        logoUrl: jobData.logoUrl || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
        recruiterId: jobData.recruiterId,
        datePosted: jobData.datePosted || new Date().toISOString(),
        status: jobData.status || 'open',
        requiredAssignments: jobData.requiredAssignments || [],
        applications: []
      };
      
      setJobs([...jobs, newJob]);
      return true;
    } catch (e) {
      console.error('Error creating job:', e);
      return false;
    }
  };

  // Get all applications for a specific job
  const getJobApplications = (jobId: string): Application[] => {
    return applications.filter(app => app.jobId === jobId);
  };

  // Get all jobs posted by a specific recruiter
  const getRecruiterJobs = (recruiterId: string): Job[] => {
    return jobs.filter(job => job.recruiterId === recruiterId);
  };

  // Update application status
  const updateApplication = (applicationId: string, data: any): boolean => {
    try {
      const updatedApplications = applications.map(app => {
        if (app.id === applicationId) {
          return {
            ...app,
            ...data
          };
        }
        return app;
      });
      
      setApplications(updatedApplications);
      return true;
    } catch (e) {
      console.error('Error updating application:', e);
      return false;
    }
  };

  const value = {
    jobs,
    applications,
    getJobMatches,
    applyToJob,
    hasApplied,
    createJob,
    getJobApplications,
    getRecruiterJobs,
    updateApplication
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};