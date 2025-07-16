import React, { useEffect, useState } from "react";
import axios from "axios";

const FeesRegister = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState("2024-04-01");
  const [toDate, setToDate] = useState("2024-04-02");
  const [userWise, setUserWise] = useState(true);

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate, userWise]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:3000/api/fees/apply", {
        params: { fromDate, toDate, userWise }
      });
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (field) => {
    return data.reduce((acc, item) => acc + (parseFloat(item[field]) || 0), 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const totals = {
    fees: calculateTotals("fees"),
    lateFee: calculateTotals("lateFee"),
    ledgerAmt: calculateTotals("ledgerAmt"),
    discount: calculateTotals("discount"),
    total: calculateTotals("total"),
    recdAmt: calculateTotals("recdAmt"),
    balance: calculateTotals("balance")
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Fees Register</h2>
        
        {/* Filters Section */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-gray-700 font-medium">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-gray-700 font-medium">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : 'Apply'}
            </button>
            
            <div className="flex items-center gap-2 ml-auto">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={userWise}
                  onChange={() => setUserWise(!userWise)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                User Wise
              </label>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adm No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Late Fee</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ledger Amt</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Recd Amt</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.recNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.admNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.rollNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.student}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.route}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(item.fees)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(item.lateFee)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(item.ledgerAmt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(item.discount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(item.total)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(item.recdAmt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(item.balance)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="17" className="px-6 py-4 text-center text-sm text-gray-500">
                    {loading ? 'Loading data...' : 'No records found for the selected criteria'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Total Fees</p>
              <p className="text-lg font-semibold text-blue-600">{formatCurrency(totals.fees)}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Late Fees</p>
              <p className="text-lg font-semibold text-blue-600">{formatCurrency(totals.lateFee)}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Ledger Amt</p>
              <p className="text-lg font-semibold text-blue-600">{formatCurrency(totals.ledgerAmt)}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Discount</p>
              <p className="text-lg font-semibold text-red-600">{formatCurrency(totals.discount)}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Net Amount</p>
              <p className="text-lg font-semibold text-green-600">{formatCurrency(totals.total)}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Received Amt</p>
              <p className="text-lg font-semibold text-green-600">{formatCurrency(totals.recdAmt)}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-xs text-gray-500">Balance Amt</p>
              <p className="text-lg font-semibold text-red-600">{formatCurrency(totals.balance)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesRegister;