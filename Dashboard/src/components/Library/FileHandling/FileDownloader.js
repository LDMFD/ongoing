import DownloadIcon from '@mui/icons-material/Download';

import './FileDownloader.css'

import {
    Chip,
} from '@mui/material';

export const Download = (id) => {
    window.ApiClient.get(`storage/files?Uid=${id}`).then(res => {
        window.location = res.data.Url;
    })
};

export const DownloadChip = ({ title, fileId }) => fileId ? (
    <button onClick={Download.bind(null, fileId)} className='ong-table-default-action-link'>
        <Chip size="small" icon={<DownloadIcon />} label={title} />
    </button>
) : title;

// A function that takes a string `title`, that returns a function that takes a `row` object and returns
// a <DownloadChip /> component with the specified title that links to the file `row.fileId`.
export const BuildDownloadChip = (title) => row => row.fileId && (
    <DownloadChip title={title} fileId={row.fileId} />
);
