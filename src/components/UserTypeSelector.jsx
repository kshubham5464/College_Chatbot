import React from 'react';
import { User, Users, GraduationCap } from 'lucide-react';

const UserTypeSelector = ({ onSelectUserType, darkMode }) => {
  const userTypes = [
    {
      type: 'student',
      label: 'Student',
      iconName: 'GraduationCap',
      description: 'Current student seeking academic help',
      greeting: 'Hello! I\'m here to help with your academic queries, course information, and campus facilities.',
      color: '#4f46e5'
    },
    {
      type: 'parent',
      label: 'Parent',
      iconName: 'Users',
      description: 'Parent looking for information',
      greeting: 'Welcome! I can help you with admission processes, fee structures, and general college information.',
      color: '#059669'
    },
    {
      type: 'visitor',
      label: 'Visitor',
      iconName: 'User',
      description: 'Prospective student or general visitor',
      greeting: 'Hi there! I\'m here to provide information about our college, courses, and admission procedures.',
      color: '#dc2626'
    }
  ];

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap size={24} />;
      case 'Users':
        return <Users size={24} />;
      case 'User':
        return <User size={24} />;
      default:
        return <User size={24} />;
    }
  };

  return (
    <div className={`user-type-selector ${darkMode ? 'dark-theme' : ''}`}>
      <div className="selector-header">
        <h3>Welcome! How can I assist you today?</h3>
        <p>Please select your role to get personalized assistance:</p>
      </div>
      
      <div className="user-type-grid">
        {userTypes.map((userType) => (
          <div
            key={userType.type}
            className="user-type-card"
            onClick={() => onSelectUserType(userType)}
            style={{ borderColor: userType.color }}
          >
            <div className="user-type-icon" style={{ color: userType.color }}>
              {getIcon(userType.iconName)}
            </div>
            <h4>{userType.label}</h4>
            <p>{userType.description}</p>
          </div>
        ))}
      </div>
      
      <div className="selector-footer">
        <small>You can change this anytime in settings</small>
      </div>
    </div>
  );
};

export default UserTypeSelector;
