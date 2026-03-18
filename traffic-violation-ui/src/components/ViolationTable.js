import React, { useEffect, useState } from "react";
import API from "../api/api";

function ViolationTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await API.get("/violations");
    setData(res.data);
  };

  return (
    <div>
      <h3>Violation History</h3>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Plate</th>
            <th>Type</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.plate}</td>
              <td>{v.type}</td>
              <td>{v.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViolationTable;