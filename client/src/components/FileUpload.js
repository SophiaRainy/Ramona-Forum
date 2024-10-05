import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onFileUploaded, token }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });
      onFileUploaded(res.data.fileUrl);
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} accept="image/*,video/*,audio/*" />
      <button type="submit">上传</button>
    </form>
  );
};

export default FileUpload;