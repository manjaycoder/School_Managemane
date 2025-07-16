import React, { useState } from 'react';

const classList = [
  'Passout', 'Passout 2023', 'PLAY', 'STD 1', 'STD 2', 'STD 3', 'STD 4', 'STD 5', 'STD 6', 'STD 7', 'STD 8', 'STD 9', 'STD X', 'LKG'
];

const categoryList = [
  '1 in 4 Free', '1 To 5', '6 To 8', '9 & 10', 'Old Fees 1', 'Old Fees 4', 'Old Fees 6', 'Old Fees 9', 'Old Fees 10', 'Ultra Poor'
];

const ConfigureFeesPlan = () => {
  const [feesHeading, setFeesHeading] = useState('TUITION FEES');
  const [feesValue, setFeesValue] = useState('500');
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  const toggleSelect = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleUpdate = () => {
    const newRows = selectedClasses.flatMap(cls =>
      selectedCategories.map(cat => ({
        className: cls,
        categoryName: cat,
        feesName: feesHeading,
        value: feesValue
      }))
    );
    setDataTable(prev => [...prev, ...newRows]);
  };

  return (
    <div className="p-4 bg-white">
      <h2 className="text-2xl font-bold text-cyan-700 mb-4">CONFIGURE FEES PLAN</h2>
      <div className="flex gap-4 mb-4">
        <input
          value={feesHeading}
          onChange={(e) => setFeesHeading(e.target.value)}
          className="border p-2 w-1/2"
          placeholder="Select Fees Heading"
        />
        <input
          value={feesValue}
          onChange={(e) => setFeesValue(e.target.value)}
          className="border p-2 w-1/2"
          placeholder="Fees Value"
        />
      </div>

      <div className="flex gap-4">
        {/* Class List */}
        <div className="w-1/2">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">Choose Classes</h3>
          <div className="border h-64 overflow-y-auto p-2">
            {classList.map(cls => (
              <label key={cls} className="block">
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
          <h3 className="text-lg font-semibold text-blue-600 mb-2">Choose Category</h3>
          <div className="border h-64 overflow-y-auto p-2">
            {categoryList.map(cat => (
              <label key={cat} className="block">
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
        onClick={handleUpdate}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Update
      </button>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-cyan-700 text-white">
            <tr>
              <th className="border px-2 py-1">Class Name</th>
              <th className="border px-2 py-1">Category Name</th>
              <th className="border px-2 py-1">Fees Name</th>
              <th className="border px-2 py-1">Value</th>
            </tr>
          </thead>
          <tbody>
            {dataTable.map((row, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{row.className}</td>
                <td className="border px-2 py-1">{row.categoryName}</td>
                <td className="border px-2 py-1">{row.feesName}</td>
                <td className="border px-2 py-1">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfigureFeesPlan;