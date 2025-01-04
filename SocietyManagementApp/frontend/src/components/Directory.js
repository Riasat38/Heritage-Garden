

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './Directory.css';
import { getUserFromStorage } from './utils.js'; // Adjust the import path as needed
import axios from 'axios';

const DirectoryPage = () => {
  const [admins, setAdmins] = useState([]);
  const [residents, setResidents] = useState([]);
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = getUserFromStorage();
      if (!token) {
        console.error('No token found, unable to fetch data');
        return;
      }

      try {
        console.log('Token:', token);

        const adminResponse = await axios.get('http://localhost:4069/society/homepage/admin', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        console.log('Admin data fetched:', adminResponse.data);
        setAdmins(adminResponse.data);

        const residentStaffResponse = await axios.get('http://localhost:4069/society/homepage/staff', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        console.log('Resident and staff data fetched:', residentStaffResponse.data);

        setResidents(residentStaffResponse.data.residents);
        setStaffs(residentStaffResponse.data.staffs);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const renderTable = (title, data, columns) => (
    <div className="directory-table">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              {columns.map((col) => {
                const lowerCaseCol = col.toLowerCase();
                console.log(`Rendering ${col} for ${item._id}: ${item[lowerCaseCol]}`); // Debugging
                return <td key={col}>{item[lowerCaseCol]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <h2>Directory</h2>
        {renderTable('Admins', admins, ['Name', 'Email', 'Contactno'])}
        {renderTable('Residents', residents, ['Name', 'Email', 'Contactno', 'Flatno'])}
        {renderTable('Staffs', staffs, ['Name', 'Email', 'Contactno', 'Role'])}
      </div>
    </div>
  );
};

export default DirectoryPage;





