import React, { useState, useEffect } from 'react';
import axios from 'axios';

const monthsList = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const frequencyMonthsMap = {
  'Annual': ['Apr'],
  'Monthly': [...monthsList],
  'Quarterly': ['Apr', 'Jul', 'Oct', 'Jan'],
  'Semi-annual': ['Apr', 'Oct'],
  'Retainer': []
};

const CreateFeesHeading = () => {
  const [formData, setFormData] = useState({
    feesHeading: '',
    groupName: 'DEVELOPMENT FEE',
    frequency: 'Annual',
    accountName: 'Admission Fees',
    months: []
  });

  // Automatically select months on frequency change
  useEffect(() => {
    const autoMonths = frequencyMonthsMap[formData.frequency] || [];
    setFormData((prev) => ({ ...prev, months: autoMonths }));
  }, [formData.frequency]);

  const toggleMonth = (month) => {
    setFormData((prev) => {
      const months = prev.months.includes(month)
        ? prev.months.filter((m) => m !== month)
        : [...prev.months, month];
      return { ...prev, months };
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectAllMonths = () => {
    setFormData((prev) => ({ ...prev, months: [...monthsList] }));
  };

  const clearAllMonths = () => {
    setFormData((prev) => ({ ...prev, months: [] }));
  };

  const handleSubmit = async () => {
    try {
      // Replace with your backend endpoint
      await axios.post('/api/fees/', formData);
      alert('Fee Heading saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save. Try again!');
    }
  };

  return (
    <div className="p-4 bg-white">
      <h2 className="text-2xl font-bold text-cyan-700 mb-4">CREATE FEES HEADING</h2>

      {/* Form Controls */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <input
          name="feesHeading"
          value={formData.feesHeading}
          onChange={handleInputChange}
          placeholder="Fees Heading"
          className="border p-2"
        />
        <select name="groupName" value={formData.groupName} onChange={handleInputChange} className="border p-2">
          <option value="DEVELOPMENT FEE">DEVELOPMENT FEE</option>
          <option value="EXAM FEE">EXAM FEE</option>
          <option value="General">General</option>
        </select>
        <select name="frequency" value={formData.frequency} onChange={handleInputChange} className="border p-2">
          {Object.keys(frequencyMonthsMap).map((freq) => (
            <option key={freq} value={freq}>{freq}</option>
          ))}
        </select>
        <select name="accountName" value={formData.accountName} onChange={handleInputChange} className="border p-2">
          <option value="Admission Fees">Admission Fees</option>
          <option value="Tuition Fee">Tuition Fee</option>
          <option value="Transport Fee">Transport Fee</option>
        </select>
      </div>

      {/* Month Selection Controls */}
      <div className="mb-2 text-sm text-blue-600 font-medium">
        Select Months in which this fee becomes due
      </div>
      <div className="mb-3 flex gap-4 text-sm">
        <button onClick={selectAllMonths} className="text-green-600 underline">Select All</button>
        <button onClick={clearAllMonths} className="text-red-600 underline">Clear All</button>
        <span className="text-gray-500 italic">Click on any month to customize</span>
      </div>

      {/* Months Checkboxes */}
      <div className="grid grid-cols-6 gap-2 mb-4">
        {monthsList.map((month) => (
          <label key={month} className={`p-2 text-center cursor-pointer border rounded ${formData.months.includes(month) ? 'bg-cyan-300' : 'bg-gray-100'}`}>
            <input
              type="checkbox"
              checked={formData.months.includes(month)}
              onChange={() => toggleMonth(month)}
              className="hidden"
            />
            {month}
          </label>
        ))}
      </div>

      {/* Save Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Save
      </button>

      {/* Table Display */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-cyan-700 text-white">
            <tr>
              <th className="border px-2 py-1">Fees Heading</th>
              <th className="border px-2 py-1">Group</th>
              <th className="border px-2 py-1">Account</th>
              <th className="border px-2 py-1">Frequency</th>
              {monthsList.map((month) => (
                <th key={month} className="border px-2 py-1">{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">{formData.feesHeading}</td>
              <td className="border px-2 py-1">{formData.groupName}</td>
              <td className="border px-2 py-1">{formData.accountName}</td>
              <td className="border px-2 py-1">{formData.frequency}</td>
              {monthsList.map((month) => (
                <td key={month} className="border px-2 py-1 text-center">
                  {formData.months.includes(month) ? '✓' : ''}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateFeesHeading;
