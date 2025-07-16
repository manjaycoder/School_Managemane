import React, { useEffect, useState } from "react";
import axios from "axios";

const FeesRegister = () => {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState("2024-04-01");
  const [toDate, setToDate] = useState("2024-04-02");
  const [userWise, setUserWise] = useState(true);

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate, userWise]);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/details");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateTotals = (field) => {
    return data.reduce((acc, item) => acc + (parseFloat(item[field]) || 0), 0);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">FEES REGISTER</h2>
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <label>From</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border rounded p-1"
        />
        <label>To</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border rounded p-1"
        />
        <button
          onClick={fetchData}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          OK
        </button>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={userWise}
            onChange={() => setUserWise(!userWise)}
          />
          User Wise
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm border">
          <thead className="bg-blue-100">
            <tr>
              <th className="border px-2">Tick</th>
              <th className="border px-2">Dt</th>
              <th className="border px-2">Rec No</th>
              <th className="border px-2">Adm No</th>
              <th className="border px-2">Roll No</th>
              <th className="border px-2">Student</th>
              <th className="border px-2">Class</th>
              <th className="border px-2">Category</th>
              <th className="border px-2">Route</th>
              <th className="border px-2">Month</th>
              <th className="border px-2">Fees</th>
              <th className="border px-2">Late Fee</th>
              <th className="border px-2">Ledger Amt</th>
              <th className="border px-2">Discount</th>
              <th className="border px-2">Total</th>
              <th className="border px-2">Recd Amt</th>
              <th className="border px-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-2">
                  <input type="checkbox" />
                </td>
                <td className="border px-2">{item.date}</td>
                <td className="border px-2">{item.recNo}</td>
                <td className="border px-2">{item.admNo}</td>
                <td className="border px-2">{item.rollNo}</td>
                <td className="border px-2">{item.student}</td>
                <td className="border px-2">{item.class}</td>
                <td className="border px-2">{item.category}</td>
                <td className="border px-2">{item.route}</td>
                <td className="border px-2">{item.month}</td>
                <td className="border px-2">{item.fees}</td>
                <td className="border px-2">{item.lateFee}</td>
                <td className="border px-2">{item.ledgerAmt}</td>
                <td className="border px-2">{item.discount}</td>
                <td className="border px-2">{item.total}</td>
                <td className="border px-2">{item.recdAmt}</td>
                <td className="border px-2">{item.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-6 gap-4 mt-4 text-sm font-medium">
        <div>Total Fees: {calculateTotals("fees").toFixed(2)}</div>
        <div>Late Fees: {calculateTotals("lateFee").toFixed(2)}</div>
        <div>Ledger Amt: {calculateTotals("ledgerAmt").toFixed(2)}</div>
        <div>Discount: {calculateTotals("discount").toFixed(2)}</div>
        <div>Net Amt: {calculateTotals("total").toFixed(2)}</div>
        <div>Received Amt: {calculateTotals("recdAmt").toFixed(2)}</div>
        <div>Balance Amt: {calculateTotals("balance").toFixed(2)}</div>
      </div>
    </div>
  );
};

export default FeesRegister;
