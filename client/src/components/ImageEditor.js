import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const ImageEditor = ({ src, onSave }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current);
    fabric.Image.fromURL(src, (img) => {
      fabricCanvasRef.current.add(img);
      fabricCanvasRef.current.renderAll();
    });
  }, [src]);

  const applyFilter = (filter) => {
    const obj = fabricCanvasRef.current.getActiveObject();
    if (obj) {
      obj.filters.push(filter);
      obj.applyFilters();
      fabricCanvasRef.current.renderAll();
    }
  };

  const rotate = () => {
    const obj = fabricCanvasRef.current.getActiveObject();
    if (obj) {
      obj.rotate(obj.angle + 90);
      fabricCanvasRef.current.renderAll();
    }
  };

  const handleSave = () => {
    const dataURL = fabricCanvasRef.current.toDataURL();
    onSave(dataURL);
  };

  return (
    <div>
      <canvas ref={canvasRef} width={500} height={500} />
      <button onClick={() => applyFilter(new fabric.Image.filters.Grayscale())}>灰度</button>
      <button onClick={() => applyFilter(new fabric.Image.filters.Sepia())}>复古</button>
      <button onClick={rotate}>旋转</button>
      <button onClick={handleSave}>保存</button>
    </div>
  );
};

export default ImageEditor;
