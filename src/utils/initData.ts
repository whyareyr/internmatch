// Utility to initialize local storage with sample data if empty
export const initializeData = () => {
  // Check if data already exists
  const usersExist = localStorage.getItem('users');
  const jobsExist = localStorage.getItem('jobs');
  const assignmentsExist = localStorage.getItem('assignments');
  
  if (usersExist && jobsExist && assignmentsExist) {
    return; // Data already exists, no need to initialize
  }
  
  // Sample Users
  const users = [
    {
      id: 'student1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: 'password123',
      role: 'student',
      resume: {
        text: 'Computer Science student with strong skills in web development and UI/UX design. Looking for internships in frontend development.',
        skills: ['JavaScript', 'React', 'HTML', 'CSS', 'UI/UX Design', 'Figma'],
        education: 'B.S. Computer Science, University of Technology (2022-2026)',
        experience: 'Web Development Teaching Assistant (2023-Present)\n- Assisted in teaching web development fundamentals\n- Graded assignments and provided feedback to students'
      }
    },
    {
      id: 'student2',
      name: 'Jamie Smith',
      email: 'jamie@example.com',
      password: 'password123',
      role: 'student',
      resume: {
        text: 'Marketing student with experience in social media management and content creation. Seeking internships in digital marketing.',
        skills: ['Social Media', 'Content Creation', 'Marketing Analytics', 'SEO', 'Copywriting'],
        education: 'B.A. Marketing, State University (2021-2025)',
        experience: 'Social Media Intern at Local Business (Summer 2023)\n- Created content calendar and posts for Instagram and Facebook\n- Increased engagement by 25% over three months'
      }
    },
    {
      id: 'recruiter1',
      name: 'Sarah Miller',
      email: 'sarah@techco.com',
      password: 'password123',
      role: 'recruiter',
      company: 'TechGrowth Inc.'
    },
    {
      id: 'recruiter2',
      name: 'Michael Wong',
      email: 'michael@designfirm.com',
      password: 'password123',
      role: 'recruiter',
      company: 'DesignFusion'
    },
    {
      id: 'admin1',
      name: 'Admin User',
      email: 'admin@internmatch.com',
      password: 'admin123',
      role: 'admin'
    }
  ];
  
  // Sample Assignments
  const assignments = [
    {
      id: 'assignment1',
      title: 'Frontend Development Challenge',
      category: 'Engineering',
      description: 'Demonstrate your frontend development skills by completing this coding challenge. Focus on UI implementation, responsiveness, and clean code.',
      estimatedTime: '1-2 hours',
      questions: [
        {
          id: 'q1_1',
          text: 'Explain your approach to creating responsive web designs. What methodologies and tools do you prefer?',
          type: 'textarea'
        },
        {
          id: 'q1_2',
          text: 'Describe how you would implement a navigation menu that works well on both desktop and mobile devices.',
          type: 'textarea'
        },
        {
          id: 'q1_3',
          text: 'Which frontend framework do you prefer to work with?',
          type: 'multiple-choice',
          options: ['React', 'Vue', 'Angular', 'Svelte', 'None/Vanilla JS']
        },
        {
          id: 'q1_4',
          text: 'Share a link to a recent project or GitHub repository that showcases your frontend skills.',
          type: 'text'
        }
      ]
    },
    {
      id: 'assignment2',
      title: 'Marketing Campaign Analysis',
      category: 'Marketing',
      description: 'Analyze a sample marketing campaign and provide insights and recommendations for improvement.',
      estimatedTime: '1-2 hours',
      questions: [
        {
          id: 'q2_1',
          text: 'Review the attached campaign metrics. What are the three most important insights you can identify?',
          type: 'textarea'
        },
        {
          id: 'q2_2',
          text: 'If you were to reallocate the campaign budget, which channels would you invest more in and why?',
          type: 'textarea'
        },
        {
          id: 'q2_3',
          text: 'Describe a marketing campaign you\'ve worked on or studied that was particularly successful. What made it effective?',
          type: 'textarea'
        },
        {
          id: 'q2_4',
          text: 'Which metric do you believe is most important for measuring the success of a digital marketing campaign?',
          type: 'multiple-choice',
          options: ['Conversion Rate', 'ROI', 'Engagement', 'Reach/Impressions', 'Customer Acquisition Cost']
        }
      ]
    },
    {
      id: 'assignment3',
      title: 'Product Feature Prioritization',
      category: 'Product',
      description: 'Evaluate a list of potential product features and create a prioritization framework.',
      estimatedTime: '1-2 hours',
      questions: [
        {
          id: 'q3_1',
          text: 'Review the list of proposed features. How would you prioritize them and why?',
          type: 'textarea'
        },
        {
          id: 'q3_2',
          text: 'Describe your approach to determining which features to build first when resources are limited.',
          type: 'textarea'
        },
        {
          id: 'q3_3',
          text: 'How would you measure the success of a newly launched feature?',
          type: 'textarea'
        },
        {
          id: 'q3_4',
          text: 'Which product prioritization framework do you prefer?',
          type: 'multiple-choice',
          options: ['RICE Score', 'Kano Model', 'MoSCoW Method', 'Value vs Effort', 'Other (please explain)']
        }
      ]
    },
    {
      id: 'assignment4',
      title: 'Backend Architecture Design',
      category: 'Engineering',
      description: 'Design a backend architecture for a scalable web application with specific requirements.',
      estimatedTime: '2-3 hours',
      questions: [
        {
          id: 'q4_1',
          text: 'Design a system architecture for a social media platform that needs to support millions of users. Include database choices, API design, and scalability considerations.',
          type: 'textarea'
        },
        {
          id: 'q4_2',
          text: 'How would you implement authentication and authorization in this system?',
          type: 'textarea'
        },
        {
          id: 'q4_3',
          text: 'Describe your approach to handling high traffic and ensuring system reliability.',
          type: 'textarea'
        },
        {
          id: 'q4_4',
          text: 'Which backend technology stack would you choose for this project?',
          type: 'text'
        }
      ]
    },
    {
      id: 'assignment5',
      title: 'Data Analysis Challenge',
      category: 'Analytics',
      description: 'Analyze a dataset and derive meaningful insights to inform business decisions.',
      estimatedTime: '2-3 hours',
      questions: [
        {
          id: 'q5_1',
          text: 'Using the provided dataset, identify key trends and patterns that could impact business strategy.',
          type: 'textarea'
        },
        {
          id: 'q5_2',
          text: 'Create a visualization that effectively communicates your main findings.',
          type: 'text'
        },
        {
          id: 'q5_3',
          text: 'What additional data would you request to enhance your analysis, and why?',
          type: 'textarea'
        },
        {
          id: 'q5_4',
          text: 'Which data analysis tools are you most proficient with?',
          type: 'multiple-choice',
          options: ['Python (Pandas/NumPy)', 'R', 'SQL', 'Excel/Google Sheets', 'Tableau/Power BI']
        }
      ]
    }
  ];
  
  // Sample Jobs
  const jobs = [
    {
      id: 'job1',
      title: 'Frontend Developer Intern',
      company: 'TechGrowth Inc.',
      location: 'San Francisco, CA',
      type: 'Internship',
      description: 'Join our team as a Frontend Developer Intern and help build amazing user experiences for our customers. You will work closely with our design and product teams to implement responsive and performant UIs.',
      requirements: 'Strong knowledge of HTML, CSS, and JavaScript. Familiarity with React or similar frontend frameworks. Understanding of responsive design principles. Currently pursuing a degree in Computer Science or related field.',
      logoUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      recruiterId: 'recruiter1',
      datePosted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      status: 'open',
      requiredAssignments: ['Engineering'],
      applications: []
    },
    {
      id: 'job2',
      title: 'UX Design Intern',
      company: 'DesignFusion',
      location: 'New York, NY',
      type: 'Remote',
      description: 'DesignFusion is looking for a talented UX Design Intern to join our creative team. You will assist in designing user interfaces for web and mobile applications, conduct user research, and create wireframes and prototypes.',
      requirements: 'Portfolio showcasing UI/UX design projects. Proficiency with design tools such as Figma, Sketch, or Adobe XD. Understanding of user-centered design principles. Currently pursuing a degree in Design, HCI, or related field.',
      logoUrl: 'https://images.pexels.com/photos/2103127/pexels-photo-2103127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      recruiterId: 'recruiter2',
      datePosted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      status: 'open',
      requiredAssignments: ['Product'],
      applications: []
    },
    {
      id: 'job3',
      title: 'Marketing Intern',
      company: 'BrandWave',
      location: 'Chicago, IL',
      type: 'Hybrid',
      description: 'BrandWave is seeking a Marketing Intern to support our digital marketing initiatives. You will assist with social media management, content creation, email campaigns, and marketing analytics.',
      requirements: 'Strong written and verbal communication skills. Familiarity with social media platforms and content creation tools. Basic understanding of marketing analytics. Currently pursuing a degree in Marketing, Communications, or related field.',
      logoUrl: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      recruiterId: 'recruiter1',
      datePosted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      status: 'open',
      requiredAssignments: ['Marketing'],
      applications: []
    },
    {
      id: 'job4',
      title: 'Data Analysis Intern',
      company: 'TechGrowth Inc.',
      location: 'San Francisco, CA',
      type: 'On-site',
      description: 'TechGrowth is looking for a Data Analysis Intern to join our analytics team. You will help collect, process, and analyze data to support business decisions, create visualizations, and assist with building predictive models.',
      requirements: 'Experience with data analysis tools like Python, R, or Excel. Basic understanding of statistics and data visualization. Ability to communicate insights clearly. Currently pursuing a degree in Statistics, Mathematics, Computer Science, or related field.',
      logoUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      recruiterId: 'recruiter1',
      datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      status: 'open',
      requiredAssignments: ['Analytics'],
      applications: []
    },
    {
      id: 'job5',
      title: 'Product Management Intern',
      company: 'DesignFusion',
      location: 'Boston, MA',
      type: 'Remote',
      description: 'Join DesignFusion as a Product Management Intern and gain hands-on experience in the product development lifecycle. You will work with cross-functional teams to define requirements, conduct market research, and contribute to product strategy.',
      requirements: 'Strong analytical and problem-solving skills. Excellent communication and collaboration abilities. Interest in user-centered design and product development. Currently pursuing a degree in Business, Computer Science, or related field.',
      logoUrl: 'https://images.pexels.com/photos/2103127/pexels-photo-2103127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      recruiterId: 'recruiter2',
      datePosted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      status: 'open',
      requiredAssignments: ['Product'],
      applications: []
    },
    {
      id: 'job6',
      title: 'Backend Developer Intern',
      company: 'TechGrowth Inc.',
      location: 'San Francisco, CA',
      type: 'Hybrid',
      description: 'TechGrowth is seeking a Backend Developer Intern to join our engineering team. You will assist in designing and implementing APIs, database structures, and server-side logic for our web applications.',
      requirements: 'Knowledge of server-side programming languages like Node.js, Python, or Java. Familiarity with databases and RESTful APIs. Understanding of basic software engineering principles. Currently pursuing a degree in Computer Science or related field.',
      logoUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      recruiterId: 'recruiter1',
      datePosted: new Date().toISOString(), // Today
      status: 'open',
      requiredAssignments: ['Engineering'],
      applications: []
    }
  ];
  
  // Sample Student Assignments (empty initially, will be populated as students use the app)
  const studentAssignments = [];
  
  // Sample Applications (empty initially, will be populated as students apply)
  const applications = [];
  
  // Store data in localStorage
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('jobs', JSON.stringify(jobs));
  localStorage.setItem('assignments', JSON.stringify(assignments));
  localStorage.setItem('studentAssignments', JSON.stringify(studentAssignments));
  localStorage.setItem('applications', JSON.stringify(applications));
};