import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const TextEditor = ({ onChange }) => {
  const [editorValue, setEditorValue] = useState('');

  const handleChange = (value) => {
    setEditorValue(value);
    onChange(value); 
  };

  return (
    <div>
      <ReactQuill
        value={editorValue}
        onChange={handleChange}
        theme="snow"
        style={{ minHeight: '300px', height: '300px' }}
      />
    </div>
  );
};

export default TextEditor;
