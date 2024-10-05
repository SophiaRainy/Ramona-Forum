import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './FileUpload';
import ImageEditor from './ImageEditor';
import RichTextEditor from './RichTextEditor';
import MediaEditor from './MediaEditor';

const CreatePost = ({ token, onPostCreated, setError }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [showImageEditor, setShowImageEditor] = useState(false);

  const handleFileUploaded = (fileUrl, type) => {
    setMediaUrl(fileUrl);
    setMediaType(type);
    if (type === 'image') {
      setShowImageEditor(true);
    }
  };

  const handleImageSave = (editedImageUrl) => {
    setMediaUrl(editedImageUrl);
    setShowImageEditor(false);
  };

  const handleMediaSave = (editedUrl) => {
    setMediaUrl(editedUrl);
    setShowImageEditor(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/posts', 
        { title, content, mediaUrl, mediaType },
        { headers: { 'x-auth-token': token } }
      );
      onPostCreated(res.data);
      setTitle('');
      setContent('');
      setMediaUrl('');
      setMediaType('');
    } catch (err) {
      setError(err.response?.data?.msg || '发布帖子失败');
    }
  };

  return (
    <div>
      <h2>创建新帖子</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="标题"
          required
        />
        <RichTextEditor onChange={setContent} />
        <FileUpload onFileUploaded={handleFileUploaded} token={token} />
        {mediaUrl && (
          <div>
            {mediaType === 'image' && (
              <ImageEditor src={mediaUrl} onSave={handleImageSave} />
            )}
            {(mediaType === 'video' || mediaType === 'audio') && (
              <MediaEditor src={mediaUrl} type={mediaType} onSave={handleMediaSave} />
            )}
          </div>
        )}
        <button type="submit">发布</button>
      </form>
    </div>
  );
};

export default CreatePost;