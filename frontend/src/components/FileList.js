import { downloadFile } from "../services/api";

const FileList = ({ files }) => {
    const handleDownload = async (fileId, fileName) => {
      const { data } = await downloadFile(fileId);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'download.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
  
    return (
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        <h3>Список доступных файлов</h3>
        {files.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '1rem' }}>Нет файлов</p>
        ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя файла</th>
              <th>Статус</th>
              <th>Скачать</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => (
              <tr key={file.id}>
                <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{file.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{file.name || "N/A"}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{file.status}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                  <button onClick={() => handleDownload(file.id, file.name)}>Скачать</button>
                </td>
              </tr>
            ))}
            {files.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>Нет файлов</td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>
    );
  };

  export default FileList;