import React, { useState, useEffect } from 'react';
import ExcelTypeForm from './components/ExcelTypeForm';
import FileUpload from './components/FileUpload';
import TaskStatusChecker from './components/TaskStatus';
import FileList from './components/FileList';
import { fetchExcelTypes } from './services/api';
import axios from 'axios';

const App = (() => {
  const [excelTypes, setExcelTypes] = useState([]);
  const [files, setFiles] = useState([]);

  const fetchTypes = async () => {
    const { data } = await fetchExcelTypes();
    setExcelTypes(data);
  };

  const fetchFiles = async () => {
    // Assuming you have an endpoint /files/ that returns a list of files
    const { data } = await axios.get('http://localhost:8000/files/');
    setFiles(data);
  };

  useEffect(() => {
    fetchTypes();
    fetchFiles();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <h2>Управление Excel файлами</h2>
      <ExcelTypeForm onCreated={fetchTypes} />
      <FileUpload excelTypes={excelTypes} onUpload={fetchFiles} />
      <FileList files={files} />
      <TaskStatusChecker />
    </div>
  );}
);

export default App;
