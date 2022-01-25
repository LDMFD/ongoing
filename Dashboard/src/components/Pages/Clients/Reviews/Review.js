import React, {  } from 'react';
import Day from 'dayjs';
import {
    Paper,
    Button
} from '@mui/material';

import FileInput from 'components/Widgets/FileUploader';

const Review = ({ review }) => {
    const download = (uid) => {
        window.ApiClient.get(`/storage/download?Uid=${uid}`).then(res => {
            window.location = res.data.Url;
        })
    };

    return (
        <Paper elevation={2}>
            Date: {`${Day(review.Timestamp)}`}

            {review.Files ? (
                <>
                    <p>
                        Files:
                    </p>
                    <ul>
                        {review.Files.map(f => (
                            <li key={f.Id}>
                                {f.Filename} (uploaded {`${Day(f.Date)}`})

                                <Button onClick={download.bind(null, f.Uid)}>Download</Button>
                            </li>
                        ))}
                    </ul>
                </>
            ) : <>No files</>}

            <p>Upload new:</p>
            <FileInput reviewId={review.Id} />
        </Paper>
    );
}

export default Review;
