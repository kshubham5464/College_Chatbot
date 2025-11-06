import React, { useState, useEffect } from 'react';
import AIAnalytics from './AIAnalytics';
import { 
  Settings, 
  Users, 
  MessageSquare, 
  Database, 
  Activity, 
  Shield, 
  Edit3, 
  Trash2, 
  Plus, 
  X,
  Search,
  Download,
  Upload,
  Send,
  Eye,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Brain
} from 'lucide-react';

const AdminPanel = ({ darkMode, onClose }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [users, setUsers] = useState([]);
  const [responses, setResponses] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [bulkMessage, setBulkMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Initialize data
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    // Load users data
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', type: 'student', status: 'active', lastActive: '2024-01-15', queries: 45 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'parent', status: 'active', lastActive: '2024-01-14', queries: 23 },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', type: 'visitor', status: 'inactive', lastActive: '2024-01-10', queries: 12 },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', type: 'student', status: 'active', lastActive: '2024-01-15', queries: 67 },
      { id: 5, name: 'David Brown', email: 'david@example.com', type: 'parent', status: 'active', lastActive: '2024-01-13', queries: 34 }
    ];
    setUsers(mockUsers);

    // Load responses data
    const mockResponses = [
      { id: 1, question: 'What are the admission requirements?', answer: 'To apply for admission, you need...', category: 'admission', userType: 'visitor', lastUpdated: '2024-01-10' },
      { id: 2, question: 'What is the fee structure?', answer: 'The fee structure for the current academic year...', category: 'fees', userType: 'parent', lastUpdated: '2024-01-12' },
      { id: 3, question: 'How do I access the student portal?', answer: 'You can access the student portal by...', category: 'portal', userType: 'student', lastUpdated: '2024-01-08' },
      { id: 4, question: 'What are the library timings?', answer: 'The library is open from 8:00 AM to 8:00 PM...', category: 'facilities', userType: 'student', lastUpdated: '2024-01-14' }
    ];
    setResponses(mockResponses);

    // Load system stats
    const mockStats = {
      totalUsers: 1247,
      activeUsers: 892,
      totalQueries: 15634,
      avgResponseTime: '2.3s',
      systemUptime: '99.8%',
      errorRate: '0.2%',
      popularQueries: [
        { query: 'Admission process', count: 234 },
        { query: 'Fee structure', count: 189 },
        { query: 'Course details', count: 156 },
        { query: 'Library timings', count: 134 }
      ]
    };
    setSystemStats(mockStats);
  };

  const tabs = [
    { id: 'content', label: 'Content Management', icon: <Database size={18} /> },
    { id: 'users', label: 'User Management', icon: <Users size={18} /> },
    { id: 'messaging', label: 'Bulk Messaging', icon: <MessageSquare size={18} /> },
    { id: 'monitoring', label: 'System Monitoring', icon: <Activity size={18} /> },
    { id: 'ai-analytics', label: 'AI Analytics', icon: <Brain size={18} /> }
  ];

  const renderContentManagement = () => (
    <div className="admin-section">
      <div className="section-header">
        <h3>Content Management System</h3>
        <div className="header-actions">
          <button className="btn btn-primary">
            <Plus size={16} />
            Add Response
          </button>
          <button className="btn btn-secondary">
            <Upload size={16} />
            Import
          </button>
          <button className="btn btn-secondary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search responses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="filter-select">
          <option value="">All Categories</option>
          <option value="admission">Admission</option>
          <option value="fees">Fees</option>
          <option value="facilities">Facilities</option>
          <option value="portal">Portal</option>
        </select>
        <select className="filter-select">
          <option value="">All User Types</option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="visitor">Visitor</option>
        </select>
      </div>

      <div className="responses-grid">
        {responses.filter(response => 
          response.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          response.answer.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(response => (
          <div key={response.id} className="response-card">
            <div className="response-header">
              <div className="response-meta">
                <span className={`category-badge ${response.category}`}>
                  {response.category}
                </span>
                <span className={`user-type-badge ${response.userType}`}>
                  {response.userType}
                </span>
              </div>
              <div className="response-actions">
                <button className="action-btn edit">
                  <Edit3 size={14} />
                </button>
                <button className="action-btn delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="response-content">
              <h4>{response.question}</h4>
              <p>{response.answer.substring(0, 100)}...</p>
              <div className="response-footer">
                <span className="last-updated">
                  <Clock size={12} />
                  Updated: {response.lastUpdated}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="admin-section">
      <div className="section-header">
        <h3>User Management & Access Controls</h3>
        <div className="header-actions">
          <button className="btn btn-primary">
            <Plus size={16} />
            Add User
          </button>
          <button className="btn btn-secondary">
            <Shield size={16} />
            Permissions
          </button>
        </div>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-icon active">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h4>{systemStats.totalUsers}</h4>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h4>{systemStats.activeUsers}</h4>
            <p>Active Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <h4>{systemStats.totalUsers - systemStats.activeUsers}</h4>
            <p>Inactive Users</p>
          </div>
        </div>
      </div>

      <div className="users-table-container">
        <div className="table-controls">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select">
            <option value="">All Types</option>
            <option value="student">Students</option>
            <option value="parent">Parents</option>
            <option value="visitor">Visitors</option>
          </select>
          <select className="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="users-table">
          <div className="table-header">
            <div className="table-cell">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedUsers(users.map(u => u.id));
                  } else {
                    setSelectedUsers([]);
                  }
                }}
              />
            </div>
            <div className="table-cell">User</div>
            <div className="table-cell">Type</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Last Active</div>
            <div className="table-cell">Queries</div>
            <div className="table-cell">Actions</div>
          </div>
          {users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          ).map(user => (
            <div key={user.id} className="table-row">
              <div className="table-cell">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, user.id]);
                    } else {
                      setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                    }
                  }}
                />
              </div>
              <div className="table-cell">
                <div className="user-info">
                  <div className="user-avatar">
                    <User size={16} />
                  </div>
                  <div>
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              </div>
              <div className="table-cell">
                <span className={`user-type-badge ${user.type}`}>
                  {user.type}
                </span>
              </div>
              <div className="table-cell">
                <span className={`status-badge ${user.status}`}>
                  {user.status}
                </span>
              </div>
              <div className="table-cell">{user.lastActive}</div>
              <div className="table-cell">{user.queries}</div>
              <div className="table-cell">
                <div className="action-buttons">
                  <button className="action-btn view">
                    <Eye size={14} />
                  </button>
                  <button className="action-btn edit">
                    <Edit3 size={14} />
                  </button>
                  <button className="action-btn delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBulkMessaging = () => (
    <div className="admin-section">
      <div className="section-header">
        <h3>Bulk Messaging System</h3>
        <div className="header-actions">
          <button className="btn btn-primary">
            <Send size={16} />
            Send Message
          </button>
        </div>
      </div>

      <div className="messaging-container">
        <div className="message-composer">
          <div className="composer-header">
            <h4>Compose Message</h4>
          </div>
          <div className="composer-body">
            <div className="recipient-selector">
              <label>Send to:</label>
              <div className="recipient-options">
                <label className="checkbox-option">
                  <input type="checkbox" />
                  All Users ({systemStats.totalUsers})
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" />
                  Students Only (847)
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" />
                  Parents Only (312)
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" />
                  Visitors Only (88)
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" />
                  Active Users Only ({systemStats.activeUsers})
                </label>
                <label className="checkbox-option">
                  <input type="checkbox" />
                  Selected Users ({selectedUsers.length})
                </label>
              </div>
            </div>

            <div className="message-input">
              <label>Message:</label>
              <textarea
                value={bulkMessage}
                onChange={(e) => setBulkMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={6}
              />
              <div className="message-stats">
                <span>Characters: {bulkMessage.length}/500</span>
              </div>
            </div>

            <div className="message-options">
              <label className="checkbox-option">
                <input type="checkbox" />
                Schedule for later
              </label>
              <label className="checkbox-option">
                <input type="checkbox" />
                Send as notification
              </label>
              <label className="checkbox-option">
                <input type="checkbox" />
                Require acknowledgment
              </label>
            </div>
          </div>
        </div>

        <div className="message-history">
          <h4>Recent Messages</h4>
          <div className="message-list">
            <div className="message-item">
              <div className="message-header">
                <span className="message-title">System Maintenance Notice</span>
                <span className="message-date">2024-01-15</span>
              </div>
              <div className="message-preview">
                Scheduled maintenance on January 20th from 2:00 AM to 4:00 AM...
              </div>
              <div className="message-stats">
                <span>Sent to: 1,247 users</span>
                <span>Delivered: 1,198</span>
                <span>Read: 892</span>
              </div>
            </div>
            <div className="message-item">
              <div className="message-header">
                <span className="message-title">New Features Available</span>
                <span className="message-date">2024-01-12</span>
              </div>
              <div className="message-preview">
                We've added new features to improve your experience...
              </div>
              <div className="message-stats">
                <span>Sent to: 847 users</span>
                <span>Delivered: 823</span>
                <span>Read: 654</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemMonitoring = () => (
    <div className="admin-section">
      <div className="section-header">
        <h3>System Monitoring & Health Checks</h3>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="monitoring-dashboard">
        <div className="system-stats">
          <div className="stat-card">
            <div className="stat-icon success">
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <h4>{systemStats.systemUptime}</h4>
              <p>System Uptime</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon info">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <h4>{systemStats.avgResponseTime}</h4>
              <p>Avg Response Time</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon warning">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-info">
              <h4>{systemStats.errorRate}</h4>
              <p>Error Rate</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active">
              <BarChart3 size={24} />
            </div>
            <div className="stat-info">
              <h4>{systemStats.totalQueries}</h4>
              <p>Total Queries</p>
            </div>
          </div>
        </div>

        <div className="monitoring-charts">
          <div className="chart-container">
            <h4>Popular Queries</h4>
            <div className="query-list">
              {systemStats.popularQueries?.map((query, index) => (
                <div key={index} className="query-item">
                  <span className="query-text">{query.query}</span>
                  <div className="query-bar">
                    <div 
                      className="query-fill" 
                      style={{ width: `${(query.count / 234) * 100}%` }}
                    ></div>
                  </div>
                  <span className="query-count">{query.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-container">
            <h4>System Health</h4>
            <div className="health-indicators">
              <div className="health-item">
                <div className="health-label">Database Connection</div>
                <div className="health-status success">
                  <CheckCircle size={16} />
                  Healthy
                </div>
              </div>
              <div className="health-item">
                <div className="health-label">API Response Time</div>
                <div className="health-status success">
                  <CheckCircle size={16} />
                  Normal
                </div>
              </div>
              <div className="health-item">
                <div className="health-label">Memory Usage</div>
                <div className="health-status warning">
                  <AlertTriangle size={16} />
                  High (78%)
                </div>
              </div>
              <div className="health-item">
                <div className="health-label">Disk Space</div>
                <div className="health-status success">
                  <CheckCircle size={16} />
                  Available (45%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`admin-panel ${darkMode ? 'dark-theme' : ''}`}>
      <div className={`admin-container ${darkMode ? 'dark-theme' : ''}`}>
        <div className="admin-header">
          <div className="admin-title">
            <Settings size={24} />
            <h2>Admin Panel</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="admin-content">
          <div className="admin-sidebar">
            <div className="admin-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="admin-main">
            {activeTab === 'content' && renderContentManagement()}
            {activeTab === 'users' && renderUserManagement()}
            {activeTab === 'messaging' && renderBulkMessaging()}
            {activeTab === 'monitoring' && renderSystemMonitoring()}
            {activeTab === 'ai-analytics' && <AIAnalytics darkMode={darkMode} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
