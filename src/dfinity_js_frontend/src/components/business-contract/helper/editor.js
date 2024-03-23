// RichTextEditor.js
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, name }) => {
    const [editorHtml, setEditorHtml] = useState('');

    useEffect(() => {
        if (value !== editorHtml) {
            setEditorHtml(value);
        }
    }, []);

    const handleChange = (html) => {
        setEditorHtml(html);
        if (onChange) {
            onChange(html, name); // Pass both html and name to the parent component
        }
    };

    return (
        <div>
            <ReactQuill
                theme="snow"
                value={editorHtml}
                onChange={handleChange}
            />
        </div>
    );
};

export default RichTextEditor;
