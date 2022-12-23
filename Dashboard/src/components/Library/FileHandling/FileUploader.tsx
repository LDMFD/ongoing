import React, { useState, useCallback, useEffect } from 'react';
import { Prompt } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import {
    Button,
    LinearProgress,
    Paper,
} from '@mui/material';
import Clear from '@mui/icons-material/Clear';
import axios from 'axios';

import { FormInputProps } from '../FormControls/FormInputProps';
import { File as FileResource } from 'Types/Types';

import './FileUploader.css';

const COMPLETION_PERCENT = 5;                                         // 5% of progress bar reserved for commit state
const MAX_FRACTION_BEFORE_COMPLETION = 1 - COMPLETION_PERCENT / 100;  // 0.95

var upload_count = 0;

const controller = new AbortController();

interface FileSpec {
    Uid: string,
    Filename: string,
    Size: number,
}

const FileControl = (props: {
    file: File,
    onCompletion: any,
}) => {
    let [ uploaded, setUploaded ] = useState(false);

    let [ percent, setPercent ] = useState(0);

    const _onProgress = useCallback((proportion: number, inCompletion: boolean) => {
        let p = proportion * 100;
        if (!inCompletion) {
            p *= MAX_FRACTION_BEFORE_COMPLETION;
        }
        p = Math.round(Math.min(p, 100));
        setPercent(p);
    }, [ setPercent ]);

    const upload = useCallback((htmlFile: File) => {
        // Prevent page unload whilst files are still uploading
        ++upload_count;

        let fileSpec: FileSpec = {
            Uid: '',
            Filename: '',
            Size: 0,
        };

        (window as any).ApiClient.post(`storage/files`, {
            Filename: htmlFile.name,
        }).then((res: any) => {
            let postData = new FormData();

            Object.keys(res.data.Fields).forEach(f => {
                postData.append(f, res.data.Fields[f]);
            })
            postData.append('file', htmlFile);
            
            axios({
                signal: controller.signal,
                method: "POST",
                url: res.data.Url,  // GCP upload
                data: postData,
                headers: {
                    "Cache-Control": "no-cache,max-age=0",
                    "Content-Disposition": `attachment; filename=${htmlFile.name}`,
                },
                onUploadProgress: (progressEvent: any) => {
                    _onProgress(progressEvent.loaded / progressEvent.total, false);
                },
            }).then((_: any) => {
                fileSpec = {
                    Uid:      res.data.Fields['key'],
                    Filename: htmlFile.name,
                    Size:     htmlFile.size,
                };

                (window as any).ApiClient.post('storage/signal', fileSpec)
                    .then(() => {
                        _onProgress(100, true);
                        setUploaded(true);
                        props.onCompletion(fileSpec);
                        --upload_count;
                    })
                    .catch((error: any) => {
                        --upload_count;
                        console.error('error',error);
                        alert(error?.response?.data?.error);  // https://stackoverflow.com/questions/49967779/axios-handling-errors
                    })
            })
            .catch((response: any) => {
                console.error('error',response);
            });
        });
    }, [ props, _onProgress ]);

    // Prevent upload loop due to onCompletion
    useEffect(() => {
        if (!uploaded && upload_count === 0) {
            upload(props.file);
        }
    }, [ uploaded, upload, props.file, props.onCompletion ])

    return (
        <div>
            {percent < 100 &&
                <LinearProgress variant="determinate" value={percent} />
            }
            <Prompt when={percent < 100} message="File upload in progress - abort?" />
        </div>
    );
}

const FileInput = (props: {
    file: FileResource,
    onChange: any,
    submitRef: any,
}) => {
    // HTML File
    const [ file, setFile ] = useState(null);

    let input = React.createRef();

    const _triggerUpload = (event: any) => {
        event.preventDefault();

        props.submitRef.current.disabled = 'disabled';
        props.submitRef.current.style.color = 'rgba(0, 0, 0, 0.26)';

        // @ts-ignore
        setFile(Array.from(input.current.files)[0]);
    };

    const _remove = (event: any) => {
        setFile(null);
        props.onChange(null)
        event.preventDefault();
    }

    const _complete = (t: any) => {
        props.submitRef.current.disabled = '';
        props.submitRef.current.style.color = '#1976d2';
        props.onChange(t);
    }

    return (
        <div className='ong-uploader-control'>
            {props.file &&
                <>
                    {props.file.Filename}<Button onClick={_remove}><Clear /></Button>
                </>
            }

            {!file ?
                !props.file ?
                    <input type="file" onChange={_triggerUpload} ref={input as any} />
                : null
                :
                <>
                    <FileControl file         = {file}
                                 onCompletion = {_complete} />
                </>
            }
        </div>
    );
}

interface FileInputProps extends FormInputProps {
    submitRef: any,
}

const FileUploader = (props: FileInputProps) => {
    return (
        <Controller
            name    = {props.name}
            control = {props.control}
            render={({
                field: { onChange, value },
                fieldState: { error },
                formState,
            }) => (
                <Paper elevation={1}>
                    <div className='ong-uploader-label'>
                        {props.label}
                    </div>

                    <FileInput file      = {value}
                                onChange  = {onChange}
                                submitRef = {props.submitRef} />
                </Paper>
            )}
        />
    );
}

export default FileUploader;
