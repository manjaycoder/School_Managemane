import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminNav from "../Components/AdminNav";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { IoIosArrowForward } from "react-icons/io";
import {
  FiHome, FiUsers, FiBook, FiDollarSign,
  FiFileText, FiDownload, FiAward, FiSettings, FiClock
} from "react-icons/fi";

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(prev => !prev);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/students/${id}`);
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error("Failed to fetch student", err);
      }
    };

    fetchStudent();
  }, [id]);

  if (!student) {
    return <div className="text-center py-10 text-gray-600 text-lg">Loading student profile...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <div className={`select-none fixed top-0 left-0 h-full z-40 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
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
            <MenuItem icon={<FiUsers />} >Students</MenuItem>
            <MenuItem icon={<FiBook />} >Academics</MenuItem>
            <MenuItem icon={<FiDollarSign />} >Finance</MenuItem>
            <MenuItem icon={<FiFileText />} >Certificates</MenuItem>
            <MenuItem icon={<FiDownload />} >Downloads</MenuItem>
            <MenuItem icon={<FiAward />} >Staff</MenuItem>
            <MenuItem icon={<FiClock />} >Logs</MenuItem>
            <MenuItem icon={<FiSettings />} >Settings</MenuItem>
          </Menu>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className={`flex flex-col w-full min-h-screen transition-all duration-300 ${collapsed ? 'pl-20' : 'pl-64'}`}>
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <AdminNav />
        </div>

        <div className="select-none max-w-7xl mx-auto p-6">
          <div className="select-none grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar Card */}
            <div className="bg-white shadow rounded-2xl p-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3R1ZGVudCUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                alt="Profile"
                className="w-24 h-24 mx-auto rounded-full mb-4 border-4 border-blue-100"
              />
              <h2 className="select-none text-xl font-semibold text-gray-800 mb-2">{student.firstName} {student.lastName}</h2>
              <p className="text-sm text-gray-500">Admission No: <span className="font-medium text-gray-700">{student.id}</span></p>
              <p className="text-sm text-gray-500">Roll No: <span className="font-medium text-gray-700">{student.rollNo}</span></p>
              <p className="text-sm text-gray-500">Class: {student.class} ({student.academicYear})</p>
              <p className="text-sm text-gray-500">Section: {student.section}</p>
              <p className="text-sm text-gray-500">Gender: {student.gender}</p>
            </div>

            {/* Profile Info */}
            <div className="md:col-span-2 bg-white shadow rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Student Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                <p><span className="font-medium">Admission Date:</span> {student.admissionDate}</p>
                <p><span className="font-medium">Date of Birth:</span> {student.dob}</p>
                <p><span className="font-medium">Mobile Number:</span> {student.fatherPhoneNumber}</p>
                <p><span className="font-medium">Category:</span> {student.category}</p>
                <p><span className="font-medium">Caste:</span> {student.caste}</p>
                <p><span className="font-medium">Religion:</span> {student.religion}</p>
                <p><span className="font-medium">Email:</span> {student.email}</p>
              </div>

              <h4 className="text-lg font-semibold mt-6 mb-2 text-gray-800">Address</h4>
              <p className="text-gray-700"><span className="font-medium">Current Address:</span> {student.currentAddress}</p>
              <p className="text-gray-700"><span className="font-medium">Permanent Address:</span> {student.permanentAddress}</p>

              <h4 className="text-lg font-semibold mt-6 mb-2 text-gray-800">Parent / Guardian</h4>
              <p className="text-gray-700"><span className="font-medium">Father Name:</span> {student.fatherName}</p>
              <p className="text-gray-700"><span className="font-medium">Father Phone:</span> {student.fatherPhoneNumber}</p>
              <p className="text-gray-700"><span className="font-medium">Father Occupation:</span> {student.fatherOccupation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
