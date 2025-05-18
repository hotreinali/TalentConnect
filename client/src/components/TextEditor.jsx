import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const TextEditor = ({ value, onChange }) => {
  return (
    <div>
      <ReactQuill
        value={value}
        onChange={onChange}
        theme="snow"
        style={{ minHeight: '200px', height: '200px' }}
      />
    </div>
  );
};

export default TextEditor;
