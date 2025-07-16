import React, { useState, useEffect } from "react";
import AdminNav from "../Components/AdminNav.jsx";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  FiHome, FiUsers, FiBook, FiDollarSign,
  FiFileText, FiDownload, FiAward, FiSettings,
  FiClock
} from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import axios from 'axios';
import "../index.css";
import DashboardCards from "../Components/DashboardCards.jsx";

const PublicDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6 text-center">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
          <div className="flex justify-center text-red-500 mb-4">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

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
            <MenuItem icon={<FiHome className="text-lg" />}>Dashboard</MenuItem>
            <SubMenu label="Academic" icon={<FiBook className="text-lg" />}>
              <MenuItem>Current Session</MenuItem>
              <MenuItem>Lesson Plan</MenuItem>
              <MenuItem>Class Management</MenuItem>
            </SubMenu>
            <SubMenu label="Finance" icon={<FiDollarSign className="text-lg" />}>
              <MenuItem>Collect Fee</MenuItem>
              <MenuItem>Demand Bill</MenuItem>
            </SubMenu>
            <MenuItem icon={<FiUsers />} >Student Management</MenuItem>
            <MenuItem icon={<FiFileText />} >Certificates</MenuItem>
            <MenuItem icon={<FiDownload />} >Downloads</MenuItem>
            <MenuItem icon={<FiAward />} >Staff Management</MenuItem>
            <MenuItem icon={<FiClock />} >User Log</MenuItem>
            <MenuItem icon={<FiSettings />} >Settings</MenuItem>
          </Menu>
        </Sidebar>
      </div>

      {/* Main content with left padding equal to sidebar width */}
      <div className={`flex flex-col w-full min-h-screen transition-all duration-300 ${collapsed ? 'pl-20' : 'pl-64'}`}>
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <AdminNav />
        </div>

        {/* Status messages */}
        {submitStatus === 'success' && (
          <div className="m-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
            Student admission submitted successfully!
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="m-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="m-4 bg-white rounded-xl shadow-sm overflow-hidden">
          <DashboardCards />
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;
