import React from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
} from '@mui/material';

import { Api } from 'State';
import Export from './Export';

export const DataTransfer = () => {
    const _throw = async () => {
        await Api.Superuser.Throw.Throw();
    };

    return (
        <ul>
            <li>
                <Export />
            </li>
            <li>
                <Link to={{ pathname: `/admin/transfer/import` }}><Button>Import</Button></Link>
            </li>
            <li >
                <Link to={{ pathname: `/admin/transfer/delete` }}><Button>Delete all data</Button></Link>
            </li>
            <li>
                <Button onClick={_throw}>Throw</Button>
            </li>
        </ul>
    );
};

export default Export;
