import React, { useState, useEffect } from 'react';
import { fetchExcelTypes, uploadFile } from '../services/api';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [excelTypes, setExcelTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const loadExcelTypes = async () => {
      const { data } = await fetchExcelTypes();
      setExcelTypes(data);
    };
    loadExcelTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await uploadFile(file, selectedType);
    alert(`Задача создана с ID: ${data.task_id}`);
    if (onUpload) onUpload();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Загрузить Excel файл</h3>
      <select onChange={(e) => setSelectedType(e.target.value)} required>
        <option value="">Выберите тип Excel</option>
        {excelTypes.map((type) => (
          <option key={type.id} value={type.id}>{type.name}</option>
        ))}
      </select>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
      <button type="submit">Загрузить</button>
    </form>
  );
};

export default FileUpload;
