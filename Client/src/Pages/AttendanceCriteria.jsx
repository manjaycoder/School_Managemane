import React, { useState } from "react";
import AdminNav from "../Components/AdminNav";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  FiHome, FiUsers, FiBook, FiDollarSign,
  FiFileText, FiDownload, FiAward, FiSettings,
  FiClock
} from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom"; // ✅ Correct import

const AttendanceCriteria = () => {
  const navigate = useNavigate(); // ✅ Correct placement
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [date, setDate] = useState("2025-06-24");
  const [submitStatus, setSubmitStatus] = useState(null);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const handleSearch = () => {
    if (!selectedClass || !selectedSection || !date) {
      setSubmitStatus("error");
      setError("Please fill all fields before searching.");
    } else {
      setSubmitStatus("success");
      setError("");
    }
  };

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  const handleAddClass = () => {
    navigate("/class-manager");
  };

  const handleAddSection = () => {
    navigate("/section-manager");
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
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-700 mb-6">Attendance Criteria</h1>

            {submitStatus === "success" && (
              <div className="mb-4 p-4 rounded bg-green-100 text-green-700 border border-green-300">
                Student attendance data fetched successfully!
              </div>
            )}
            {submitStatus === "error" && (
              <div className="mb-4 p-4 rounded bg-red-100 text-red-700 border border-red-300">
                {error}
              </div>
            )}

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Criteria</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Class*</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select</option>
                    <option value="TEN">TEN</option>
                    <option value="NINE">NINE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Section*</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date*</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Search
                </button>
                <button
                  onClick={handleAddClass}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Add Class
                </button>
                <button
                  onClick={handleAddSection}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Add Section
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttendanceCriteria;
