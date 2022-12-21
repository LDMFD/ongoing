import React, { useState, useEffect, useCallback } from 'react';
import { Prompt } from 'react-router-dom';
import {
    Button,
    LinearProgress,
} from '@mui/material';
import Clear from '@mui/icons-material/Clear';
import axios from 'axios';

const COMPLETION_PERCENT = 5;                                         // 5% of progress bar reserved for commit state
const MAX_FRACTION_BEFORE_COMPLETION = 1 - COMPLETION_PERCENT / 100;  // 0.95

var upload_count = 0;

const controller = new AbortController();

const File = ({ file, onProgress, onCompletion }) => {
    let [ uploaded, setUploaded ] = useState(false);

    let [ percent, setPercent ] = useState(0);

    const _onProgress = useCallback((proportion, inCompletion) => {
        let p = proportion * 100;
        if (!inCompletion) {
            p *= MAX_FRACTION_BEFORE_COMPLETION;
        }
        p = Math.round(Math.min(p, 100));
        setPercent(p);

        // Report to containing dialog
        onProgress(p);
    }, [ setPercent, onProgress ]);

    const upload = useCallback((file, onCompletion) => {
        // Prevent page unload whilst files are still uploading
        ++upload_count;

        let fileSpec = {
            Uid: '',
            Filename: '',
            Size: 0,
        };

        window.ApiClient.post(`storage/files`, {
            Filename: file.name,
        }).then(res => {
            let postData = new FormData();

            Object.keys(res.data.Fields).forEach(f => {
                postData.append(f, res.data.Fields[f]);
            })
            postData.append('file', file);
            
            axios({
                signal: controller.signal,
                method: "POST",
                url: res.data.Url,  // GCP upload
                data: postData,
                headers: {
                    "Cache-Control": "no-cache,max-age=0",
                    "Content-Disposition": `attachment; filename=${file.Filename}`,
                },
                onUploadProgress: (progressEvent) => {
                    _onProgress(progressEvent.loaded / progressEvent.total);
                },
            }).then(_ => {
                fileSpec = {
                    Uid:      res.data.Fields['key'],
                    Filename: file.name,
                    Size:     file.size,
                };

                window.ApiClient.post('storage/signal', fileSpec)
                    .then(() => {
                        _onProgress(100, true);
                        setUploaded(true);
                        onCompletion(fileSpec);
                        --upload_count;
                    })
                    .catch((error) => {
                        --upload_count;
                        console.log('error',error);
                        alert(error?.response?.data?.error);  // https://stackoverflow.com/questions/49967779/axios-handling-errors
                    })
            })
            .catch(response => {
                console.log('error',response);
            });
        });
    }, [ _onProgress ]);

    // Prevent upload loop due to onCompletion
    useEffect(() => {
        if (!uploaded && upload_count === 0) {
            upload(file, onCompletion);
        }
    }, [ uploaded, upload, file, onCompletion ])

    return (
        <div>
            {percent < 100 &&
                <LinearProgress variant="determinate" value={percent} />
            }
            <Prompt when={percent < 100} message="File upload in progress - abort?" />
        </div>
    );
}

const FileInput = ({ onProgress, onCompletion, onRemove }) => {
    const [ file, setFile ] = useState(null);

    let input = React.createRef();

    const _triggerUpload = (event) => {
        event.preventDefault();
        setFile(Array.from(input.current.files)[0]);
    };

    const _remove = (event) => {
        setFile(null);
        onRemove();
        // controller.abort()
        event.preventDefault();
    }

    return (
        <>
            <label>
                {!file &&
                    <input type="file" onChange={_triggerUpload} ref={input} />
                }
            </label>
            <br />

            {file &&
                <>
                    <div>
                        {file.name}<Button onClick={_remove}><Clear /></Button>
                    </div>
                    <File file         = {file}
                          onProgress   = {onProgress}
                          onCompletion = {onCompletion} />
                </>
            }
        </>
    );
}

const FileUploader = ({ label, stateUpdater, state, property='File' }) => {

    const _onRemove = () => {
        stateUpdater({
            ...state,
            [property]: null,
            // Uploading: false,
        });
    };
    
    let _onCompletion = (fileSpec) => {
        stateUpdater({
            ...state,
            [property]: fileSpec,
            // Uploading: false,
        });
    };

    let _onProgress = (percent) => {
        stateUpdater({
            ...state,
            Uploading: percent !== 100,
        });
    }
    
    return (
        <>
            <b>{label}</b>
            <br />
            <FileInput onProgress   = {_onProgress}
                       onCompletion = {_onCompletion}
                       onRemove     = {_onRemove} />
        </>
    );
}

export default FileUploader;
