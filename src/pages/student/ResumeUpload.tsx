import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

const ResumeUpload: React.FC = () => {
  const { user, updateUserProfile } = useUser();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load existing resume data if available
  useEffect(() => {
    if (user?.resume) {
      setResumeText(user.resume.text || '');
      setSkills(user.resume.skills || []);
      setEducation(user.resume.education || '');
      setExperience(user.resume.experience || '');
    }
  }, [user]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Only accept PDF files (in a real app, we'd have a parser)
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setMessage({
        type: 'error',
        text: 'Please upload a PDF file'
      });
      return;
    }
    
    setFile(file);
    
    // In a real app, we'd parse the PDF here
    // For demo purposes, we'll just simulate parsing after a delay
    setMessage({
      type: 'success',
      text: 'Resume uploaded successfully! Analyzing content...'
    });
    
    setTimeout(() => {
      // Simulate parsed content
      const simulatedText = "Frontend Developer with 2 years of experience in React and TypeScript. Bachelor's degree in Computer Science.";
      setResumeText(simulatedText);
      setSkills(['React', 'TypeScript', 'HTML', 'CSS', 'JavaScript']);
      setEducation("Bachelor's in Computer Science, University of Technology");
      setExperience("Frontend Developer at Tech Solutions (2021-Present)\n- Developed responsive web applications\n- Collaborated with UX/UI designers");
      
      setMessage({
        type: 'success',
        text: 'Resume analyzed successfully!'
      });
    }, 1500);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user profile with resume data
    if (user) {
      updateUserProfile(user.id, {
        resume: {
          text: resumeText,
          skills,
          education,
          experience,
          fileName: file?.name || 'resume.pdf'
        }
      });
      
      setMessage({
        type: 'success',
        text: 'Resume saved successfully!'
      });
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Upload Your Resume</h1>
        
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
            {/* File Upload Area */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (PDF)
              </label>
              
              <div 
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
                  dragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".pdf"
                  className="hidden" 
                  onChange={handleChange}
                />
                
                {file ? (
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-lg font-medium text-gray-700">Drag & drop your resume here</p>
                    <p className="text-sm text-gray-500 mt-1">or click to browse files (PDF only)</p>
                  </>
                )}
              </div>
            </div>
            
            {/* Resume Content Fields */}
            <div className="space-y-6">
              <div>
                <label htmlFor="resumeText" className="block text-sm font-medium text-gray-700 mb-2">
                  Resume Overview
                </label>
                <textarea
                  id="resumeText"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="A brief summary of your professional background..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map((skill, index) => (
                    <div 
                      key={index} 
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                    >
                      <span>{skill}</span>
                      <button 
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                  Education
                </label>
                <textarea
                  id="education"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="Your educational background..."
                />
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Work Experience
                </label>
                <textarea
                  id="experience"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Your work history..."
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/student/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save Resume
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;