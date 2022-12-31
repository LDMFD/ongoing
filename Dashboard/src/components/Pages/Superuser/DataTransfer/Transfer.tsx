import React from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
} from '@mui/material';
import Export from './Export';

export const DataTransfer = () => {
    return (
        <ul>
            <li>
                <Export />
            </li>
            <li>
                <Link to={{ pathname: `/admin/transfer/import` }}><Button>Import</Button></Link>
            </li>
            <li>
                <Link to={{ pathname: `/admin/transfer/delete` }}><Button>Delete all data</Button></Link>
            </li>
        </ul>
    );
};

export default Export;
