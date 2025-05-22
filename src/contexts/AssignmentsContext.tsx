import React, { createContext, useContext, useState, useEffect } from 'react';

interface Assignment {
  id: string;
  title: string;
  category: string;
  description: string;
  estimatedTime: string;
  questions: Array<{
    id: string;
    text: string;
    type: 'text' | 'textarea' | 'multiple-choice';
    options?: string[];
  }>;
}

interface StudentAssignment {
  id: string;
  studentId: string;
  studentName?: string;
  assignmentId: string;
  assignmentTitle?: string;
  assignment?: Assignment;
  status: 'not-started' | 'in-progress' | 'completed';
  answers?: { [key: string]: string };
  submissions: Array<{
    id: string;
    jobId: string;
    date: string;
    reviewed: boolean;
    feedback?: string;
    reviewDate?: string;
  }>;
}

interface AssignmentsContextType {
  assignments: Assignment[];
  studentAssignments: StudentAssignment[];
  startAssignment: (studentId: string, assignmentId: string) => boolean;
  submitAssignment: (studentId: string, assignmentId: string, answers: { [key: string]: string }, jobIds: string[]) => boolean;
  getStudentAssignments: (studentId: string) => StudentAssignment[];
  updateSubmissionReview: (studentId: string, assignmentId: string, jobId: string, reviewData: any) => boolean;
}

const AssignmentsContext = createContext<AssignmentsContextType | null>(null);

export const useAssignments = () => {
  const context = useContext(AssignmentsContext);
  if (!context) {
    throw new Error('useAssignments must be used within an AssignmentsProvider');
  }
  return context;
};

export const AssignmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studentAssignments, setStudentAssignments] = useState<StudentAssignment[]>([]);

  // Load assignments and student assignments from localStorage on mount
  useEffect(() => {
    const savedAssignments = localStorage.getItem('assignments');
    const savedStudentAssignments = localStorage.getItem('studentAssignments');
    
    if (savedAssignments) {
      try {
        setAssignments(JSON.parse(savedAssignments));
      } catch (e) {
        console.error('Error parsing saved assignments:', e);
      }
    }
    
    if (savedStudentAssignments) {
      try {
        setStudentAssignments(JSON.parse(savedStudentAssignments));
      } catch (e) {
        console.error('Error parsing saved student assignments:', e);
      }
    }
  }, []);

  // Save assignments and student assignments to localStorage when they change
  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);
  
  useEffect(() => {
    localStorage.setItem('studentAssignments', JSON.stringify(studentAssignments));
  }, [studentAssignments]);

  // Start an assignment for a student
  const startAssignment = (studentId: string, assignmentId: string): boolean => {
    try {
      // Check if student already has this assignment
      const existingAssignment = studentAssignments.find(
        sa => sa.studentId === studentId && sa.assignmentId === assignmentId
      );
      
      if (existingAssignment) {
        // If already started or completed, don't create a new one
        return true;
      }
      
      // Get assignment details
      const assignment = assignments.find(a => a.id === assignmentId);
      if (!assignment) return false;
      
      // Get student details
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const student = users.find((u: any) => u.id === studentId);
      if (!student) return false;
      
      // Create new student assignment
      const newStudentAssignment: StudentAssignment = {
        id: `sa_${Date.now()}`,
        studentId,
        studentName: student.name,
        assignmentId,
        assignmentTitle: assignment.title,
        assignment: assignment,
        status: 'in-progress',
        submissions: []
      };
      
      setStudentAssignments([...studentAssignments, newStudentAssignment]);
      return true;
    } catch (e) {
      console.error('Error starting assignment:', e);
      return false;
    }
  };

  // Submit an assignment for a student
  const submitAssignment = (
    studentId: string, 
    assignmentId: string, 
    answers: { [key: string]: string },
    jobIds: string[]
  ): boolean => {
    try {
      // Find the student assignment
      const studentAssignmentIndex = studentAssignments.findIndex(
        sa => sa.studentId === studentId && sa.assignmentId === assignmentId
      );
      
      if (studentAssignmentIndex === -1) return false;
      
      // Get the current student assignment
      const currentStudentAssignment = studentAssignments[studentAssignmentIndex];
      
      // Create submissions for each job
      const submissions = jobIds.map(jobId => ({
        id: `sub_${Date.now()}_${jobId}`,
        jobId,
        date: new Date().toISOString(),
        reviewed: false
      }));
      
      // Update the student assignment
      const updatedStudentAssignment = {
        ...currentStudentAssignment,
        status: 'completed' as const,
        answers,
        submissions: [
          ...currentStudentAssignment.submissions,
          ...submissions
        ]
      };
      
      // Update the student assignments array
      const updatedStudentAssignments = [...studentAssignments];
      updatedStudentAssignments[studentAssignmentIndex] = updatedStudentAssignment;
      
      setStudentAssignments(updatedStudentAssignments);
      return true;
    } catch (e) {
      console.error('Error submitting assignment:', e);
      return false;
    }
  };

  // Get all assignments for a student
  const getStudentAssignments = (studentId: string): StudentAssignment[] => {
    // Get assignments the student has already started/completed
    const studentAssgns = studentAssignments.filter(sa => sa.studentId === studentId);
    
    // Get all available assignments
    const allAssignmentIds = new Set(assignments.map(a => a.id));
    
    // Find assignments not yet started by the student
    const startedAssignmentIds = new Set(studentAssgns.map(sa => sa.assignmentId));
    const notStartedAssignmentIds = [...allAssignmentIds].filter(id => !startedAssignmentIds.has(id));
    
    // Create "not-started" student assignments for the remaining assignments
    const notStartedStudentAssignments = notStartedAssignmentIds.map(assignmentId => {
      const assignment = assignments.find(a => a.id === assignmentId);
      if (!assignment) return null;
      
      return {
        id: `placeholder_${assignmentId}`,
        studentId,
        assignmentId,
        assignmentTitle: assignment.title,
        assignment,
        status: 'not-started' as const,
        submissions: []
      };
    }).filter(Boolean) as StudentAssignment[];
    
    return [...studentAssgns, ...notStartedStudentAssignments];
  };

  // Update a submission review
  const updateSubmissionReview = (
    studentId: string, 
    assignmentId: string, 
    jobId: string, 
    reviewData: any
  ): boolean => {
    try {
      // Find the student assignment
      const studentAssignmentIndex = studentAssignments.findIndex(
        sa => sa.studentId === studentId && sa.assignmentId === assignmentId
      );
      
      if (studentAssignmentIndex === -1) return false;
      
      // Get the current student assignment
      const currentStudentAssignment = studentAssignments[studentAssignmentIndex];
      
      // Find the submission for the specific job
      const updatedSubmissions = currentStudentAssignment.submissions.map(sub => {
        if (sub.jobId === jobId) {
          return {
            ...sub,
            ...reviewData
          };
        }
        return sub;
      });
      
      // Update the student assignment
      const updatedStudentAssignment = {
        ...currentStudentAssignment,
        submissions: updatedSubmissions
      };
      
      // Update the student assignments array
      const updatedStudentAssignments = [...studentAssignments];
      updatedStudentAssignments[studentAssignmentIndex] = updatedStudentAssignment;
      
      setStudentAssignments(updatedStudentAssignments);
      return true;
    } catch (e) {
      console.error('Error updating submission review:', e);
      return false;
    }
  };

  const value = {
    assignments,
    studentAssignments,
    startAssignment,
    submitAssignment,
    getStudentAssignments,
    updateSubmissionReview
  };

  return <AssignmentsContext.Provider value={value}>{children}</AssignmentsContext.Provider>;
};