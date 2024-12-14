import React, { useState } from 'react';
import { createExcelType } from '../services/api';

const ExcelTypeForm = ({ onCreated }) => {
  const [name, setName] = useState('');
  const [startRow, setStartRow] = useState(1);
  const [startColumn, setStartColumn] = useState(1);
  const [columns, setColumns] = useState([{ name: '', type: '' }]);

  const handleColumnChange = (index, field, value) => {
    const newColumns = [...columns];
    newColumns[index][field] = value;
    setColumns(newColumns);
  };

  const addColumn = () => setColumns([...columns, { name: '', type: '' }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, start_row: startRow, start_column: startColumn, columns };
    await createExcelType(data);
    alert("Справочник создан!");
    setName('');
    setStartRow(1);
    setStartColumn(1);
    setColumns([{ name: '', type: '' }]);
    if (onCreated) onCreated(); // If you want to refresh after creation
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <h3>Создать справочник Excel</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Имя справочника"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Начальная строка"
          value={startRow}
          onChange={(e) => setStartRow(Number(e.target.value))}
          required
        />
        <input
          type="number"
          placeholder="Начальная колонка"
          value={startColumn}
          onChange={(e) => setStartColumn(Number(e.target.value))}
          required
        />

        {columns.map((col, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Имя колонки"
              value={col.name}
              onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
            />
            <select
              value={col.type}
              onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
            >
              <option value="">Выберите тип</option>
              <option value="str">Строка</option>
              <option value="int">Число</option>
              <option value="float">Дробное</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={addColumn}>Добавить колонку</button>
        <button type="submit">Создать</button>
      </form>
    </div>
  );
};

export default ExcelTypeForm;
