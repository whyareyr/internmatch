import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, FileText, Filter } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useAssignments } from '../../contexts/AssignmentsContext';

const AssignmentHub: React.FC = () => {
  const { user } = useUser();
  const { assignments, studentAssignments, getStudentAssignments } = useAssignments();
  const [filter, setFilter] = useState('all');
  const [userAssignments, setUserAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const userAssgns = getStudentAssignments(user.id);
      setUserAssignments(userAssgns);
    }
  }, [user, getStudentAssignments, studentAssignments]);

  // Get all available assignment types
  const assignmentTypes = [...new Set(assignments.map(a => a.category))];

  // Filter assignments based on selected filter
  const filteredAssignments = filter === 'all' 
    ? assignments 
    : assignments.filter(a => a.category === filter);

  const getAssignmentStatus = (assignmentId: string) => {
    const studentAssignment = userAssignments.find(a => a.assignmentId === assignmentId);
    return studentAssignment?.status || 'not-started';
  };

  const getSubmissionCount = (assignmentId: string) => {
    const studentAssignment = userAssignments.find(a => a.assignmentId === assignmentId);
    return studentAssignment?.submissions?.length || 0;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Assignment Hub</h1>
        
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">About Assignments</h2>
          <p className="text-gray-700 mb-4">
            Complete standardized assignments once and reuse them across multiple job applications. 
            This saves you time and allows recruiters to compare candidates more fairly.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span>Completed</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              <span>In Progress</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
              <span>Not Started</span>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Assignments
          </button>
          
          {assignmentTypes.map((type, index) => (
            <button
              key={index}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        
        {/* Assignments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map(assignment => {
            const status = getAssignmentStatus(assignment.id);
            const submissionCount = getSubmissionCount(assignment.id);
            
            return (
              <div key={assignment.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {assignment.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {assignment.description.length > 120 
                      ? `${assignment.description.substring(0, 120)}...` 
                      : assignment.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Est. time: {assignment.estimatedTime}</span>
                  </div>
                  
                  <div className="flex items-center text-sm mb-6">
                    {status === 'completed' && (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-700">Completed</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-gray-600">Submitted to {submissionCount} companies</span>
                      </>
                    )}
                    
                    {status === 'in-progress' && (
                      <>
                        <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-yellow-700">In Progress</span>
                      </>
                    )}
                    
                    {status === 'not-started' && (
                      <>
                        <AlertCircle className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600">Not Started</span>
                      </>
                    )}
                  </div>
                  
                  <Link
                    to={`/student/assignments/${assignment.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
                  >
                    {status === 'not-started' ? 'Start Assignment' : 'View Assignment'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredAssignments.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600">
              There are no assignments in this category. Try selecting a different filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentHub;