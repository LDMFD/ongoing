import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Controller } from 'react-hook-form';

import './RichTextEditor.css';
import { FormInputProps } from '../FormControls/FormInputProps';

let toolbarId = 0;


const RichTextEditor = ({ label, initialValue, onChange }: any) => {
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
                        
export const RichTextEditor2 = (props: FormInputProps) => {
    let tId = useRef(toolbarId++);

    if (!props.control) {
        return null;
    }

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

    let rules: any = {
        required: {
            value: props.required,
            message: 'Required field (minimum two words)',
        },
    };
    if (props.required) {
        rules.pattern = {
            value: /^(?!<p>((<\/p><p><br>)|(<br>)|\s)+<\/p>$).*$/,   // prevent only spaces/newlines if required
            message: 'Required field',
        }
    }

    return (
        <div className="ong-richtext">
            <label>{props.label}</label>
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

            <Controller
                name    = {props.name}
                control = {props.control}
                rules   = {rules}
                render = {({
                    field: { onChange, value },
                    fieldState: { error },
                    formState,
                }) => (
                    <>
                        <ReactQuill
                            theme    = 'snow'
                            modules  = {modules}
                            formats  = {formats}
                            value    = {value}
                            onChange = {onChange}
                        />

                        {error &&
                            <div className='ong-form-error'>
                                {error.message}
                            </div>
                        }
                    </>    
                )}
            />
                                                 
        </div>
    )
}

export default RichTextEditor;
