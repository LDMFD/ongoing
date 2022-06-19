import React, { useState, useEffect, useCallback } from 'react';
import {
    Button,
} from '@mui/material';
import axios from 'axios';
import Day from 'dayjs';

import { Download } from './FileDownloader';

const File = ({ file, completionCallback }) => {
    let [ uploaded, setUploaded ] = useState(false);

    const upload = useCallback((file, completionCallback) => {
        let fileSpec = {
            Uid: '',
            Filename: '',
            Size: 0,
        };

        window.ApiClient.get(`common/storage/upload?Filename=${file.name}`).then(res => {
            let postData = new FormData();

            Object.keys(res.data.Fields).forEach(f => {
                postData.append(f, res.data.Fields[f]);
            })
            postData.append('file', file);
            
            axios({
                method: "POST",
                url: res.data.Url,  // GCP upload
                data: postData,
                headers: {
                    "Cache-Control": "no-cache,max-age=0",
                    "Content-Disposition": `attachment; filename=${file.Filename}`,
                },
            }).then(_ => {
                fileSpec = {
                    Uid:      res.data.Fields['key'],
                    Filename: file.name,
                    Size:     file.size,
                };

                window.ApiClient.post('common/storage/upload', fileSpec)
                .then(() => {
                    setUploaded(true);
                    completionCallback(fileSpec);
                })
                .catch((error) => {
                    console.log('error',error);
                    alert(error?.response?.data?.error);  // https://stackoverflow.com/questions/49967779/axios-handling-errors
                })
            })
            .catch(response => {
                console.log('error',response);
            });
        });
    }, []);

    // Prevent upload loop due to completionCallback
    useEffect(() => {
        if (!uploaded) {
            upload(file, completionCallback);
        }
    }, [ uploaded, upload, file, completionCallback ])

    return (
        <div>
            {file.name} {file.size} {file.type}
        </div>
    );
}

const FileInput = ({ completionCallback }) => {
    const [ file, setFile ] = useState(null);

    let input = React.createRef();

    const triggerUpload = (event) => {
        event.preventDefault();
        setFile(Array.from(input.current.files)[0]);
    };

    return (
        <>
            <label>
                <input type="file" multiple onChange={triggerUpload} ref={input} />
            </label>
            <br />
            {/* <button onClick={triggerUpload}>Submit</button> */}

            {file &&
                <File file               = {file}
                        completionCallback = {completionCallback} />
            }

            {/* {files && (
                <ul>
                    {files.map((f, ix) => (
                        <File key={ix} reviewId={reviewId} file={f} />
                    ))}
                </ul>
            )} */}
        </>
    );
}

const FileUploader = ({file, stateUpdater, state, property='File' }) => {
    const download = (uid) => {
        Download(uid);
    };
    
    const remove = () => {
        stateUpdater({
            ...state,
            [property]: null,
        });
    };
    
    let fileUploaded = (fileSpec) => {
        stateUpdater({
            ...state,
            [property]: fileSpec,
        });
    };
    
    return (
        <>
            <b>File upload</b>
            <br />
            {file?.Uid ? (
                <div>
                    {file.Filename} (uploaded {`${Day(file.Date)}`})
                    <Button onClick={download.bind(null, file.Uid)}>Download</Button>
                    <Button onClick={remove}>Remove</Button>
                </div>
            ) : <p>No files</p>}

            <FileInput completionCallback={fileUploaded} />
        </>
    );
}

export default FileUploader;
