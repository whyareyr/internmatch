import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import { UserProvider } from './contexts/UserContext';
import { JobsProvider } from './contexts/JobsContext';
import { AssignmentsProvider } from './contexts/AssignmentsContext';

// Layout components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/StudentDashboard';
import ResumeUpload from './pages/student/ResumeUpload';
import AssignmentHub from './pages/student/AssignmentHub';
import AssignmentDetails from './pages/student/AssignmentDetails';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import JobPostingForm from './pages/recruiter/JobPostingForm';
import CandidateReview from './pages/recruiter/CandidateReview';
import AdminPortal from './pages/admin/AdminPortal';
import NotFound from './pages/NotFound';

// Initialize local storage with sample data if empty
import { initializeData } from './utils/initData';

function App() {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Initialize local storage with sample data if first time
    initializeData();
    setInitialized(true);
  }, []);

  if (!initialized) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <UserProvider>
      <JobsProvider>
        <AssignmentsProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                
                {/* Student Routes */}
                <Route path="student" element={<ProtectedRoute role="student" />}>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="resume" element={<ResumeUpload />} />
                  <Route path="assignments" element={<AssignmentHub />} />
                  <Route path="assignments/:id" element={<AssignmentDetails />} />
                </Route>
                
                {/* Recruiter Routes */}
                <Route path="recruiter" element={<ProtectedRoute role="recruiter" />}>
                  <Route path="dashboard" element={<RecruiterDashboard />} />
                  <Route path="post-job" element={<JobPostingForm />} />
                  <Route path="candidates" element={<CandidateReview />} />
                </Route>
                
                {/* Admin Routes */}
                <Route path="admin" element={<ProtectedRoute role="admin" />}>
                  <Route path="portal" element={<AdminPortal />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </AssignmentsProvider>
      </JobsProvider>
    </UserProvider>
  );
}

export default App;