import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

const MediaEditor = ({ src, type, onSave }) => {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const trimMedia = async (start, duration) => {
    const inputName = 'input' + (type === 'video' ? '.mp4' : '.mp3');
    const outputName = 'output' + (type === 'video' ? '.mp4' : '.mp3');
    ffmpeg.FS('writeFile', inputName, await fetchFile(src));
    await ffmpeg.run('-i', inputName, '-ss', start, '-t', duration, outputName);
    const data = ffmpeg.FS('readFile', outputName);
    const url = URL.createObjectURL(new Blob([data.buffer], { type: type === 'video' ? 'video/mp4' : 'audio/mpeg' }));
    onSave(url);
  };

  return ready ? (
    <div>
      {type === 'video' && <video src={src} controls />}
      {type === 'audio' && <audio src={src} controls />}
      <button onClick={() => trimMedia('00:00:00', '00:00:10')}>裁剪前10秒</button>
    </div>
  ) : (
    <p>加载中...</p>
  );
};

export default MediaEditor;