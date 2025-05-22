import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'student' | 'recruiter' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  resume?: {
    text?: string;
    skills?: string[];
    education?: string;
    experience?: string;
    fileName?: string;
  };
}

interface UserContextType {
  user: User | null;
  login: (data: any) => boolean;
  logout: () => void;
  register: (data: any) => boolean;
  updateUserProfile: (userId: string, data: any) => boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
      }
    }
  }, []);

  // Get users from local storage
  const getUsers = (): any[] => {
    try {
      const users = localStorage.getItem('users');
      return users ? JSON.parse(users) : [];
    } catch (e) {
      console.error('Error getting users:', e);
      return [];
    }
  };

  // Save users to local storage
  const saveUsers = (users: any[]) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const login = (data: any): boolean => {
    // If id is provided, it's a quick login
    if (data.id) {
      setUser(data);
      localStorage.setItem('currentUser', JSON.stringify(data));
      return true;
    }

    // Regular login with email/password
    const users = getUsers();
    const foundUser = users.find(u => 
      u.email === data.email && 
      u.password === data.password &&
      u.role === data.role
    );

    if (foundUser) {
      const userToSave = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        company: foundUser.company,
        resume: foundUser.resume
      };
      
      setUser(userToSave);
      localStorage.setItem('currentUser', JSON.stringify(userToSave));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = (data: any): boolean => {
    const users = getUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === data.email)) {
      return false;
    }
    
    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      company: data.role === 'recruiter' ? data.company || data.name + ' Inc.' : undefined,
      resume: data.role === 'student' ? {
        text: '',
        skills: [],
        education: '',
        experience: ''
      } : undefined
    };
    
    // Add to users array
    users.push(newUser);
    saveUsers(users);
    
    // Log user in
    const userToSave = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      company: newUser.company,
      resume: newUser.resume
    };
    
    setUser(userToSave);
    localStorage.setItem('currentUser', JSON.stringify(userToSave));
    
    return true;
  };

  const updateUserProfile = (userId: string, data: any): boolean => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        ...data
      };
      
      saveUsers(users);
      
      // Update current user if it's the same
      if (user && user.id === userId) {
        const updatedUser = {
          ...user,
          ...data
        };
        
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      
      return true;
    }
    
    return false;
  };

  const value = {
    user,
    login,
    logout,
    register,
    updateUserProfile
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};