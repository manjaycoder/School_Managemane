import React, { useState } from "react";
import axios from "axios";
import AdminNav from "../Components/AdminNav";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  FiHome, FiUsers, FiBook, FiDollarSign,
  FiFileText, FiDownload, FiAward, FiSettings, FiClock, FiTrash2
} from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";

const ConfigureFeesPlan = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  const [feesHeading, setFeesHeading] = useState("TUITION FEES");
  const [feesValue, setFeesValue] = useState("500");
  const [selectedClasses, setSelectedClasses] = useState(["STD 5", "STD X"]);
  const [selectedCategories, setSelectedCategories] = useState(["Old Fees 6"]);
  const [tableData, setTableData] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [classList, setClassList] = useState([
    "12th","11th","10th","9th","8th","7th","6th","5th","4th","3th",
    "2th","1th","L.K.G","U.K.G","Nursery"
  ]);

  const [categoryList, setCategoryList] = useState([
    "General", "new Student", "Old Student"
  ]);

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const addNewClass = () => {
    if (newClassName && !classList.includes(newClassName)) {
      setClassList([...classList, newClassName]);
      setNewClassName("");
    }
  };

  const addNewCategory = () => {
    if (newCategory && !categoryList.includes(newCategory)) {
      setCategoryList([...categoryList, newCategory]);
      setNewCategory("");
    }
  };

  const deleteClass = (className) => {
    if (window.confirm(`Are you sure you want to delete "${className}"?`)) {
      setClassList(classList.filter(cls => cls !== className));
      setSelectedClasses(selectedClasses.filter(cls => cls !== className));
    }
  };

  const deleteCategory = (category) => {
    if (window.confirm(`Are you sure you want to delete "${category}"?`)) {
      setCategoryList(categoryList.filter(cat => cat !== category));
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/fees/plan", {
        feesHeading,
        value: feesValue,
        classes: selectedClasses,
        categories: selectedCategories
      });

      if (response.data.success) {
        const newRows = [];
        for (const cls of selectedClasses) {
          for (const cat of selectedCategories) {
            newRows.push({
              className: cls,
              category: cat,
              feesName: feesHeading,
              value: feesValue
            });
          }
        }
        setTableData(prev => [...prev, ...newRows]);
        alert("✅ Fee plan saved successfully!");
      } else {
        alert("❌ Failed to save fee plan");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("❌ Something went wrong while saving data");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar code remains the same */}
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
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="sticky top-0 z-30 bg-white shadow">
          <AdminNav />
        </div>

        <main className="p-6">
          <h2 className="text-2xl font-bold mb-4">Configure Fees Plan</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input value={feesHeading} onChange={(e) => setFeesHeading(e.target.value)} placeholder="Select Fees Heading" className="border p-2 rounded" />
            <input value={feesValue} onChange={(e) => setFeesValue(e.target.value)} placeholder="Fees Value" type="number" className="border p-2 rounded" />
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-white border rounded p-4">
              <h3 className="font-semibold text-blue-600 mb-2">Choose Classes</h3>
              <div className="flex mt-2">
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Add new class"
                  className="border p-2 rounded flex-1"
                />
                <button
                  onClick={addNewClass}
                  className="ml-2 bg-blue-500 text-white px-3 py-2 rounded"
                >
                  Add
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {classList.map(cls => (
                  <div key={cls} className="flex items-center justify-between">
                    <label className="block flex-1">
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(cls)}
                        onChange={() => toggleSelection(cls, selectedClasses, setSelectedClasses)}
                        className="mr-2"
                      />
                      {cls}
                    </label>
                    <button 
                      onClick={() => deleteClass(cls)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded p-4">
              <h3 className="font-semibold text-blue-600 mb-2">Choose Categories</h3>
              <div className="flex mt-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add new category"
                  className="border p-2 rounded flex-1"
                />
                <button
                  onClick={addNewCategory}
                  className="ml-2 bg-blue-500 text-white px-3 py-2 rounded"
                >
                  Add
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {categoryList.map(cat => (
                  <div key={cat} className="flex items-center justify-between">
                    <label className="block flex-1">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleSelection(cat, selectedCategories, setSelectedCategories)}
                        className="mr-2"
                      />
                      {cat}
                    </label>
                    <button 
                      onClick={() => deleteCategory(cat)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button onClick={handleUpdate} className="bg-blue-600 text-white px-6 py-2 rounded mb-6">Update</button>

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Class Name</th>
                  <th className="p-2 border">Category Name</th>
                  <th className="p-2 border">Fees Name</th>
                  <th className="p-2 border">Value</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border">{row.className}</td>
                    <td className="p-2 border">{row.category}</td>
                    <td className="p-2 border">{row.feesName}</td>
                    <td className="p-2 border">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConfigureFeesPlan;