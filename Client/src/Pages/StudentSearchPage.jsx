import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNav from "../Components/AdminNav";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { IoIosArrowForward } from "react-icons/io";
import {
  FiHome, FiUsers, FiBook, FiDollarSign,
  FiFileText, FiDownload, FiAward, FiSettings, FiClock
} from "react-icons/fi";

const StudentSearchPage = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    class: "",
    section: "",
    keyword: "",
  });

  const [students, setStudents] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setCollapsed(prev => !prev);

  useEffect(() => {
    const fetchClassSectionData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/classes/with-sections");
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching class-section data:", error);
      }
    };

    fetchClassSectionData();
  }, []);

  useEffect(() => {
    const selectedClass = classes.find(cls => cls.name === formData.class);
    setSections(selectedClass?.sections || []);

    if (!selectedClass?.sections.includes(formData.section)) {
      setFormData(prev => ({ ...prev, section: "" }));
    }
  }, [formData.class, classes]);

  const handleSearch = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/students/`);
    const data = await res.json();
    setStudents(data);
    console.log(data); // Add this to check the actual data structure
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};

const handleRowClick = (student) => {
  // Use the correct identifier field from your data
  const studentId = student.id || student.admissionNo || student._id;
  if (studentId) {
    navigate(`/students/${studentId}`);
  } else {
    console.error("No valid student ID found", student);
  }
};

// Then update your row click handler in the table:
// 

  return (
    <div className="select-none  flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
          <div className="select-none flex items-center justify-between p-4 border-b border-gray-100">
            {!collapsed && (
              <div className="select-none flex items-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className=" select-none ml-2 text-xl font-semibold text-gray-800">EduManage</span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="select-none p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
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

      <div className={`flex flex-col w-full min-h-screen transition-all duration-300 ${collapsed ? 'pl-20' : 'pl-64'}`}>
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <AdminNav />
        </div>

        <div className="select-none p-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎯 Search Students</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="select-none block text-sm font-medium" >Class</label>
              <select
                className="w-full mt-1 p-2 border rounded"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              >
                <option value="">Select</option>
                {classes.map(cls => (
                  <option key={cls.name} value={cls.name}>{cls.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="select-none block text-sm font-medium">Section</label>
              <select
                className="w-full mt-1 p-2 border rounded"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              >
                <option value="">Select</option>
                {sections.map((sec, idx) => (
                  <option key={idx} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="select-none block text-sm font-medium">Search By Keyword</label>
              <div className="flex mt-1">
                <input
                  type="text"
                  placeholder="Student Name"
                  className="w-full p-2 border rounded-l"
                  value={formData.keyword}
                  onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                />
                <button
                  onClick={handleSearch}
                  className="select-none bg-blue-500 text-white px-4 rounded-r"
                >
                  🔍
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto bg-white border rounded-lg shadow">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="select-none px-4 py-2">Admission No</th>
                  <th className="select-none px-4 py-2">Name</th>
                  <th className="select-none px-4 py-2">Class</th>
                  <th className="select-none px-4 py-2">Father</th>
                  <th className="select-none px-4 py-2">Mother</th>
                  <th className="select-none px-4 py-2">DOB</th>
                  <th className="select-none px-4 py-2">Gender</th>
                  <th className="select-none px-4 py-2">Roll No</th>
                  <th className="select-none px-4 py-2">Mobile</th>
                  <th className="select-none px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((stu, idx) => (
                    <tr
                      key={idx}
                      className="select-none border-t hover:bg-blue-50 cursor-pointer"
                      onClick={() => handleRowClick(stu)}
                    >
                      <td className="px-4 py-2">{stu.admissionNo}</td>
                      <td className="px-4 py-2">{stu.studentName}</td>
                      <td className="px-4 py-2">{stu.class}</td>
                      <td className="px-4 py-2">{stu.fatherName}</td>
                      <td className="px-4 py-2">{stu.motherName}</td>
                      <td className="px-4 py-2">{stu.dob}</td>
                      <td className="px-4 py-2">{stu.gender}</td>
                      <td className="px-4 py-2">{stu.rollNo}</td>
                      <td className="px-4 py-2">{stu.mobileNo}</td>
                      <td className="px-4 py-2 text-blue-600 hover:underline select-none">View</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="select-none text-center py-8 text-gray-500">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSearchPage;
