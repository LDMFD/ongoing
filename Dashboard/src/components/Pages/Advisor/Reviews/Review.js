import React, {  } from 'react';
import Day from 'dayjs';
import {
    Paper,
    Button
} from '@mui/material';

import FileInput from 'Components/Widgets/FileHandling/FileUploader';
import { Download } from 'Components/Widgets/FileHandling/FileDownloader';

const Review = ({ review }) => {
    const download = (uid) => {
        Download(uid);
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
