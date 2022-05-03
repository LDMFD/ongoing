import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './RichTextEditor.css';

let toolbarId = 0;

const RichTextEditor = ({ label, initialValue, onChange }) => {
    let tId = useRef(toolbarId++);

    let modules = {
        toolbar: {
            container: `#rich-toolbar-${tId.current}`,
        },
        clipboard: {
            matchVisual: false,
        },
    }

    let formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link',
    ]

    return (
        <div className="text-editor">
            {label}
            <div id={`rich-toolbar-${tId.current}`}>
                <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
                    <option value="1"></option>
                    <option value="2"></option>
                    <option value=""></option>
                </select>
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>
                <button className="ql-strike"></button>
                <button className="ql-blockquote"></button>
                <button className="ql-list" value="ordered"></button>
                <button className="ql-list" value="bullet"></button>
                <button className="ql-indent" value="-1"></button>
                <button className="ql-indent" value="+1"></button>
                <button className="ql-link"></button>
                <button className="ql-clean"></button>
            </div>
            <ReactQuill theme    = 'snow'
                        modules  = {modules}
                        formats  = {formats}
                        value    = {initialValue}
                        onChange = {onChange} />
        </div>
    )
}

export default RichTextEditor;
