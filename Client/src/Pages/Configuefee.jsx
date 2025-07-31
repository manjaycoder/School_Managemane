import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConfigureFeesPlan = () => {
  const [feeHeadings, setFeeHeadings] = useState([]);
  const [feesHeading, setFeesHeading] = useState("");
  const [feesValue, setFeesValue] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  const [classList, setClassList] = useState([
    "10th", "9th", "8th", "7th", "6th", "5th",
    "4th", "3rd", "2nd", "1st", "Nursery", "L.K.G", "U.K.G"
  ]);
  const [categoryList, setCategoryList] = useState([
    "New Student", "Old Student", "General"
  ]);

  const [newClass, setNewClass] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const fetchFeeHeadings = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/fees/");
        const data = res.data.data || [];
        setFeeHeadings(data);
        if (data.length > 0) {
          setFeesHeading(data[0].feesHeading);
        }
      } catch (err) {
        console.error("Error fetching fees:", err);
        toast.error("Failed to load fees headings");
      }
    };

    fetchFeeHeadings();
  }, []);

  const toggleSelect = (item, list, setList) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const handleDeleteRow = (idx) => {
    setDataTable(dataTable.filter((_, i) => i !== idx));
  };

  const handleAddClass = () => {
    if (newClass && !classList.includes(newClass)) {
      setClassList([...classList, newClass]);
      setNewClass("");
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !categoryList.includes(newCategory)) {
      setCategoryList([...categoryList, newCategory]);
      setNewCategory("");
    }
  };

  const handleSubmit = async () => {
    if (!feesHeading || !feesValue || selectedClasses.length === 0 || selectedCategories.length === 0) {
      toast.warning("Please fill all fields and select at least one class and category");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/fees/plan", {
        feesHeading,
        value: feesValue,
        classes: selectedClasses,
        categories: selectedCategories,
      });

      if (response.data.success) {
        const newRows = selectedClasses.flatMap(cls =>
          selectedCategories.map(cat => ({
            className: cls,
            categoryName: cat,
            feesName: feesHeading,
            value: feesValue,
          }))
        );

        setDataTable((prev) => [...prev, ...newRows]);
        setSelectedClasses([]);
        setSelectedCategories([]);
        setFeesValue("");
        toast.success("Fee plan saved successfully");
      } else {
        toast.error("Failed to save fee plan");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Server error while saving fee plan");
    }
  };

  return (
    <MainLayout>
      <div className="p-4 bg-white">
        <h2 className="text-2xl font-bold text-cyan-700 mb-4">CONFIGURE FEES PLAN</h2>

        <div className="flex gap-4 mb-4">
          <select
            value={feesHeading}
            onChange={(e) => setFeesHeading(e.target.value)}
            className="border p-2 w-1/2"
          >
            <option value="">Select Fee Heading</option>
            {feeHeadings.map((fee, idx) => (
              <option key={idx} value={fee.feesHeading}>
                {fee.feesHeading}
              </option>
            ))}
          </select>

          <input
            value={feesValue}
            onChange={(e) => setFeesValue(e.target.value)}
            className="border p-2 w-1/2"
            placeholder="Fees Value"
            type="number"
          />
        </div>

        <div className="flex gap-4">
          {/* Class List */}
          <div className="w-1/2">
            <div className="flex justify-between mb-1">
              <h3 className="text-lg font-semibold text-blue-600">Choose Classes</h3>
              <div className="flex gap-2">
                <input
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="border px-2 py-1 text-sm"
                  placeholder="Add Class"
                />
                <button onClick={handleAddClass} className="bg-green-500 text-white px-2 rounded">
                  Add
                </button>
              </div>
            </div>
            <div className="border h-64 overflow-y-auto p-2">
              {classList.map((cls, idx) => (
                <label key={idx} className="block">
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(cls)}
                    onChange={() => toggleSelect(cls, selectedClasses, setSelectedClasses)}
                    className="mr-2"
                  />
                  {cls}
                </label>
              ))}
            </div>
          </div>

          {/* Category List */}
          <div className="w-1/2">
            <div className="flex justify-between mb-1">
              <h3 className="text-lg font-semibold text-blue-600">Choose Category</h3>
              <div className="flex gap-2">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="border px-2 py-1 text-sm"
                  placeholder="Add Category"
                />
                <button onClick={handleAddCategory} className="bg-green-500 text-white px-2 rounded">
                  Add
                </button>
              </div>
            </div>
            <div className="border h-64 overflow-y-auto p-2">
              {categoryList.map((cat, idx) => (
                <label key={idx} className="block">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleSelect(cat, selectedCategories, setSelectedCategories)}
                    className="mr-2"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Plan
        </button>

        {/* Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-cyan-700 text-white">
              <tr>
                <th className="border px-2 py-1">Class Name</th>
                <th className="border px-2 py-1">Category Name</th>
                <th className="border px-2 py-1">Fees Name</th>
                <th className="border px-2 py-1">Value</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataTable.map((row, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{row.className}</td>
                  <td className="border px-2 py-1">{row.categoryName}</td>
                  <td className="border px-2 py-1">{row.feesName}</td>
                  <td className="border px-2 py-1">{row.value}</td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => handleDeleteRow(idx)}
                      className="text-red-600 hover:underline"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </MainLayout>
  );
};

export default ConfigureFeesPlan;
