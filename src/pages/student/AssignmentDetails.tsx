import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useAssignments } from '../../contexts/AssignmentsContext';
import { useJobs } from '../../contexts/JobsContext';

const AssignmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { assignments, studentAssignments, startAssignment, submitAssignment } = useAssignments();
  const { jobs } = useJobs();
  
  const [assignment, setAssignment] = useState<any>(null);
  const [studentAssignment, setStudentAssignment] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
  
  // Find assignment details
  useEffect(() => {
    if (id) {
      const foundAssignment = assignments.find(a => a.id === id);
      if (foundAssignment) {
        setAssignment(foundAssignment);
        
        // Initialize answers state with empty values for each question
        const initialAnswers: { [key: string]: string } = {};
        foundAssignment.questions.forEach((q: any) => {
          initialAnswers[q.id] = '';
        });
        setAnswers(initialAnswers);
      }
    }
  }, [id, assignments]);
  
  // Find student assignment if it exists
  useEffect(() => {
    if (user && id) {
      const found = studentAssignments.find(
        sa => sa.studentId === user.id && sa.assignmentId === id
      );
      
      if (found) {
        setStudentAssignment(found);
        // If there are saved answers, load them
        if (found.answers) {
          setAnswers(found.answers);
        }
      } else if (user && assignment) {
        // Start the assignment if it hasn't been started yet
        startAssignment(user.id, assignment.id);
      }
    }
  }, [user, id, assignment, studentAssignments, startAssignment]);
  
  // Get eligible jobs for this assignment (matching category)
  const eligibleJobs = jobs.filter(job => 
    job.requiredAssignments?.includes(assignment?.category)
  );
  
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    
    try {
      // Validate that all questions have been answered
      const unansweredQuestions = assignment.questions.filter((q: any) => !answers[q.id]?.trim());
      
      if (unansweredQuestions.length > 0) {
        setMessage({
          type: 'error',
          text: 'Please answer all questions before submitting.'
        });
        setSubmitting(false);
        return;
      }
      
      // Check if any jobs are selected
      if (selectedJobs.length === 0) {
        setMessage({
          type: 'error',
          text: 'Please select at least one job to submit this assignment to.'
        });
        setSubmitting(false);
        return;
      }
      
      // Submit the assignment
      if (user && assignment) {
        await submitAssignment(user.id, assignment.id, answers, selectedJobs);
        
        setMessage({
          type: 'success',
          text: `Assignment submitted successfully to ${selectedJobs.length} job${selectedJobs.length > 1 ? 's' : ''}!`
        });
        
        // Reset selected jobs after submission
        setSelectedJobs([]);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred while submitting the assignment. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <p>Loading assignment details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/student/assignments')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Assignments
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{assignment.title}</h1>
              <div className="flex items-center mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-3">
                  {assignment.category}
                </span>
                <span className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  Est. time: {assignment.estimatedTime}
                </span>
              </div>
            </div>
            
            {studentAssignment?.status === 'completed' && (
              <div className="mt-4 md:mt-0 flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>
        
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Assignment Questions */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Instructions</h2>
                <p className="text-gray-700">{assignment.description}</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                  {assignment.questions.map((question: any, index: number) => (
                    <div key={question.id} className="border-t pt-6">
                      <label className="block font-medium text-gray-900 mb-3">
                        {index + 1}. {question.text}
                      </label>
                      
                      {question.type === 'text' && (
                        <input
                          type="text"
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={studentAssignment?.status === 'completed'}
                        />
                      )}
                      
                      {question.type === 'textarea' && (
                        <textarea
                          rows={4}
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={studentAssignment?.status === 'completed'}
                        />
                      )}
                      
                      {question.type === 'multiple-choice' && (
                        <div className="space-y-2">
                          {question.options?.map((option: string, optionIndex: number) => (
                            <label key={optionIndex} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option}
                                checked={answers[question.id] === option}
                                onChange={() => handleAnswerChange(question.id, option)}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                disabled={studentAssignment?.status === 'completed'}
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {studentAssignment?.status !== 'completed' && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Submit to Jobs</h2>
                    <p className="text-gray-700 mb-4">
                      Select the jobs you want to submit this assignment to:
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      {eligibleJobs.length > 0 ? (
                        eligibleJobs.map(job => (
                          <label key={job.id} className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={selectedJobs.includes(job.id)}
                              onChange={() => toggleJobSelection(job.id)}
                              className="mt-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <div>
                              <div className="font-medium">{job.title}</div>
                              <div className="text-sm text-gray-600">{job.company}</div>
                            </div>
                          </label>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">
                          No jobs currently require this assignment.
                        </p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={submitting || eligibleJobs.length === 0}
                      className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium ${
                        submitting || eligibleJobs.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Submit Assignment</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Assignment Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p>{assignment.category}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Questions</h3>
                  <p>{assignment.questions.length}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Estimated Time</h3>
                  <p>{assignment.estimatedTime}</p>
                </div>
                
                {studentAssignment?.status === 'completed' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Submitted To</h3>
                    <div className="mt-2 space-y-2">
                      {studentAssignment.submissions?.map((sub: any) => {
                        const job = jobs.find(j => j.id === sub.jobId);
                        return (
                          <div key={sub.id} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>{job?.title} at {job?.company}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tips</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="inline-block w-1 h-1 rounded-full bg-gray-500 mt-1.5 mr-2"></span>
                      <span>Be concise and specific in your answers.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-1 h-1 rounded-full bg-gray-500 mt-1.5 mr-2"></span>
                      <span>Use examples from your experience when relevant.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-1 h-1 rounded-full bg-gray-500 mt-1.5 mr-2"></span>
                      <span>Proofread before submitting.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;