import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import MainLayout from "../layout/MainLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConfigureFeesPlan = () => {
  const [feeHeadings, setFeeHeadings] = useState([]);
  const [feesHeading, setFeesHeading] = useState("");
  const [feesValue, setFeesValue] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [classList, setClassList] = useState([
    "12th", "11th", "10th", "9th", "8th", "7th", "6th", "5th",
    "4th", "3rd", "2nd", "1st", "L.K.G", "U.K.G", "Nursery"
  ]);

  const [categoryList, setCategoryList] = useState([
    "General", "New Student", "Old Student"
  ]);

  useEffect(() => {
    const fetchFeeHeadings = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/fees");
        setFeeHeadings(res.data.data || []);
        setFeesHeading(res.data.data?.[0] || "");
      } catch (err) {
        console.error("Error fetching fees:", err);
      }
    };
    fetchFeeHeadings();
  }, []);

  const toggleSelection = (item, list, setList) => {
    setList(
      list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item]
    );
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
      setClassList(classList.filter((cls) => cls !== className));
      setSelectedClasses(selectedClasses.filter((cls) => cls !== className));
    }
  };

  const deleteCategory = (category) => {
    if (window.confirm(`Are you sure you want to delete "${category}"?`)) {
      setCategoryList(categoryList.filter((cat) => cat !== category));
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/fees/plan", {
        feesHeading,
        value: feesValue,
        classes: selectedClasses,
        categories: selectedCategories,
      });

      if (response.data.success) {
        const newRows = [];
        for (const cls of selectedClasses) {
          for (const cat of selectedCategories) {
            newRows.push({
              className: cls,
              category: cat,
              feesName: feesHeading,
              value: feesValue,
            });
          }
        }
        setTableData((prev) => [...prev, ...newRows]);
        
        toast.success("✅ Fee plan saved successfully");
      } else {
        
        toast.error("❌ Failed to save fee plan");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("❌ Server error while saving fee plan");
      
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <MainLayout>
        <ToastContainer position="top-right" autoClose={3000} />
        <main className="p-6 w-full">
          <h2 className="text-2xl font-bold mb-4 text-cyan-700">Configure Fees Plan</h2>

          <div className="flex gap-4 mb-4">
            <select
              value={feesHeading}
              onChange={(e) => setFeesHeading(e.target.value)}
              className="border p-2 w-1/2"
            >
              {feeHeadings.map((fee, idx) => (
                <option key={idx} value={fee}>{fee}</option>
              ))}
            </select>

            <input
              value={feesValue}
              onChange={(e) => setFeesValue(e.target.value)}
              className="border p-2 w-1/2"
              placeholder="Fees Value"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Class Section */}
            <div className="bg-white border rounded p-4">
              <h3 className="font-semibold text-blue-600 mb-2">Choose Classes</h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Add new class"
                  className="border p-2 rounded flex-1"
                />
                <button
                  onClick={addNewClass}
                  className="bg-blue-500 text-white px-3 py-2 rounded"
                >
                  Add
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {classList.map((cls) => (
                  <div key={cls} className="flex items-center justify-between">
                    <label className="flex-1">
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
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Section */}
            <div className="bg-white border rounded p-4">
              <h3 className="font-semibold text-blue-600 mb-2">Choose Categories</h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add new category"
                  className="border p-2 rounded flex-1"
                />
                <button
                  onClick={addNewCategory}
                  className="bg-blue-500 text-white px-3 py-2 rounded"
                >
                  Add
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {categoryList.map((cat) => (
                  <div key={cat} className="flex items-center justify-between">
                    <label className="flex-1">
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
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700"
          >
            Save
          </button>

          <div className="mt-6 overflow-x-auto bg-white rounded shadow">
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
      </MainLayout>
    </div>
  );
};

export default ConfigureFeesPlan;
