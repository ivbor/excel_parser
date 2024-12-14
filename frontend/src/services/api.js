import axios from 'axios';

const API_BASE = "http://localhost:8000";

export const fetchExcelTypes = () => axios.get(`${API_BASE}/excel-types/`);
export const createExcelType = (data) => axios.post(`${API_BASE}/excel-types/`, data);
export const uploadFile = (file, excelTypeId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);
  formData.append('excel_type_id', excelTypeId);
  console.log(file.name);
  return axios.post(`${API_BASE}/upload/`, formData, 
    {headers: {'Content-Disposition': file.name}});
};
export const checkTaskStatus = (taskId) => axios.get(`${API_BASE}/tasks/${taskId}/`);
export const downloadFile = (fileId) => axios.get(`${API_BASE}/download/${fileId}/`, { responseType: 'blob' });
