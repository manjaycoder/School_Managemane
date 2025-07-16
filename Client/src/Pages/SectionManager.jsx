import React, { useState } from 'react';
import AdminNav from "../Components/AdminNav";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  FiHome, FiUsers, FiBook, FiDollarSign,
  FiFileText, FiDownload, FiAward, FiSettings,
  FiClock
} from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";

const SectionManager = () => {
  const [sections, setSections] = useState(['A', 'B', 'C', 'JAC', 'CBSE']);
  const [newSection, setNewSection] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const addSection = () => {
    const section = newSection.trim();
    if (section && !sections.includes(section)) {
      setSections([...sections, section]);
      setNewSection('');
    }
  };

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        <Sidebar
          collapsed={collapsed}
          backgroundColor="#fff"
          width="100%"
          rootStyles={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRight: "none"
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            {!collapsed && (
              <div className="flex items-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="ml-2 text-xl font-semibold text-gray-800">EduManage</span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            >
              <IoIosArrowForward className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <Menu
            menuItemStyles={{
              button: ({ level, active }) => {
                if (level === 0)
                  return {
                    color: active ? '#3B82F6' : '#4B5563',
                    backgroundColor: active ? '#EFF6FF' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#F3F4F6',
                    },
                  };
              },
            }}
          >
            <MenuItem icon={<FiHome />}>Dashboard</MenuItem>
            <SubMenu label="Academic" icon={<FiBook />}>
              <MenuItem>Current Session</MenuItem>
              <MenuItem>Lesson Plan</MenuItem>
              <MenuItem>Class Management</MenuItem>
            </SubMenu>
            <SubMenu label="Finance" icon={<FiDollarSign />}>
              <MenuItem>Collect Fee</MenuItem>
              <MenuItem>Demand Bill</MenuItem>
            </SubMenu>
            <MenuItem icon={<FiUsers />}>Student Management</MenuItem>
            <MenuItem icon={<FiFileText />}>Certificates</MenuItem>
            <MenuItem icon={<FiDownload />}>Downloads</MenuItem>
            <MenuItem icon={<FiAward />}>Staff Management</MenuItem>
            <MenuItem icon={<FiClock />}>User Log</MenuItem>
            <MenuItem icon={<FiSettings />}>Settings</MenuItem>
          </Menu>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className={`flex flex-col w-full min-h-screen transition-all duration-300 ${collapsed ? 'pl-20' : 'pl-64'}`}>
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <AdminNav />
        </div>

        <main className="p-6">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">Manage Sections</h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Add Section */}
            <div className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-bold mb-4">Add Section</h3>
              <input
                type="text"
                placeholder="Section Name"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3"
              />
              <button
                onClick={addSection}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>

            {/* Section List */}
            <div className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-bold mb-4">Section List</h3>
              <ul>
                {sections.map((sec, idx) => (
                  <li key={idx} className="flex justify-between items-center py-2 border-b">
                    <span>{sec}</span>
                    <button className="text-red-500 text-sm">✕</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SectionManager;
