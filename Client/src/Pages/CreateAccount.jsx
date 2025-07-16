import React, { useState } from "react";
import AdminNav from "../Components/AdminNav";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiDollarSign,
  FiFileText,
  FiDownload,
  FiAward,
  FiSettings,
  FiClock
} from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";

const CreateAccount = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form, setForm] = useState({
    name: '',
    printAs: '',
    group: 'Income (Indirect)',
    openingBalance: '',
    drCr: 'Dr.',
    taxNo: '',
    address1: '',
    address2: '',
    city: '',
    pincode: '',
    state: '',
    stateCode: '',
    mobile: '',
    phone: '',
    email: '',
    contactPerson: '',
    panCard: ''
  });

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = () => {
    console.log('Saving form data:', form);
    // Submit logic here...
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

        <main className="p-4">
          <div className="bg-white p-6 rounded shadow max-w-5xl mx-auto">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold">Create Account</h2>
              <div className="space-x-2">
                <button className="bg-gray-200 px-4 py-1 rounded">Settings</button>
                <button className="bg-red-500 text-white px-4 py-1 rounded">Delete</button>
                <button className="bg-blue-500 text-white px-4 py-1 rounded">List</button>
                <button className="bg-gray-600 text-white px-4 py-1 rounded">Close</button>
              </div>
            </div>

            <div className="grid gap-4">
              <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded w-full" />
              <input type="text" name="printAs" placeholder="Print As" value={form.printAs} onChange={handleChange} className="border p-2 rounded w-full" />

              <div className="grid md:grid-cols-5 gap-4">
                <input type="text" name="group" value={form.group} onChange={handleChange} className="border p-2 rounded" />
                <button className="bg-blue-500 text-white px-3 py-2 rounded">+</button>
                <button className="bg-yellow-500 text-white px-3 py-2 rounded">✎</button>
                <input type="text" name="openingBalance" placeholder="Opening Bal." value={form.openingBalance} onChange={handleChange} className="border p-2 rounded" />
                <select name="drCr" value={form.drCr} onChange={handleChange} className="border p-2 rounded">
                  <option value="Dr.">Dr.</option>
                  <option value="Cr.">Cr.</option>
                </select>
              </div>

              <input type="text" name="taxNo" placeholder="Tax No. (GSTIN / VAT No.)" value={form.taxNo} onChange={handleChange} className="border p-2 rounded w-full" />
              <input type="text" name="address1" placeholder="Address Line 1" value={form.address1} onChange={handleChange} className="border p-2 rounded w-full" />
              <input type="text" name="address2" placeholder="Address Line 2" value={form.address2} onChange={handleChange} className="border p-2 rounded w-full" />

              <div className="grid md:grid-cols-4 gap-4">
                <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} className="border p-2 rounded" />
                <input type="text" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="border p-2 rounded" />
                <input type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} className="border p-2 rounded" />
                <input type="text" name="stateCode" placeholder="State Code" value={form.stateCode} onChange={handleChange} className="border p-2 rounded" />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <input type="text" name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} className="border p-2 rounded" />
                <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border p-2 rounded" />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" name="contactPerson" placeholder="Contact Person" value={form.contactPerson} onChange={handleChange} className="border p-2 rounded" />
                <input type="text" name="panCard" placeholder="PAN Card No." value={form.panCard} onChange={handleChange} className="border p-2 rounded" />
              </div>

              <div className="text-right">
                <button onClick={handleSave} className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700">
                  Save
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateAccount;
