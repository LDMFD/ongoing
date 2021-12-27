import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import axios from 'axios';

// let upload_count = 0;

const File = ({ reviewId, file }) => {
    useEffect(() => {
        console.log("uploading", file);

        // Prevent page unload whilst files are still uploading
        // ++upload_count;

        window.ApiClient.get(`/upload?Filename=${file.name}`).then(res => {
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
                window.ApiClient.post('/upload', {
                    Uid: res.data.Fields['key'],
                    Filename: file.name,
                    Size: file.size,
                    ReviewId: reviewId,
                })
                .catch(function (error) {
                    alert(error.response.data.error);  // https://stackoverflow.com/questions/49967779/axios-handling-errors
                })
            })
            .catch(response => {
                console.log('error',response);
            });
        });
    });

    return (
        <div>
            {file.name} {file.size} {file.type}
        </div>
    );
}

const FileInput = ({ reviewId }) => {
    const [ files, setFiles ] = useState(null);

    let input = React.createRef();

    const handleSubmit = (event) => {
        event.preventDefault();
        setFiles(Array.from(input.current.files));
    };

    return (
        <Paper>
            <form onSubmit={handleSubmit}>
                <label>
                    Upload file:
                    <input type="file" multiple ref={input} />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>

            {files && (
                <ul>
                    {files.map((f, ix) => (
                        <File key={ix} reviewId={reviewId} file={f} />
                    ))}
                </ul>
            )}
        </Paper>
    );
}

export default FileInput;
