import React, { useState } from 'react';
import { checkTaskStatus } from '../services/api';

const TaskStatusChecker = () => {
    const [taskId, setTaskId] = useState('');
    const [statusResult, setStatusResult] = useState(null);
  
    const handleCheckStatus = async () => {
      if (!taskId) return;
      const { data } = await checkTaskStatus(taskId);
      setStatusResult(data);
    };
  
    return (
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        <h3>Проверить статус задачи</h3>
        <input
          type="text"
          placeholder="Task ID"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
        />
        <button onClick={handleCheckStatus}>Проверить</button>
        {statusResult && (
          <div style={{ marginTop: '1rem' }}>
            <p><b>Task ID:</b> {statusResult.task_id}</p>
            <p><b>Status:</b> {statusResult.status}</p>
            <p><b>Result:</b> {JSON.stringify(statusResult.result)}</p>
          </div>
        )}
      </div>
    );
  };
  
  export default TaskStatusChecker;