import React, { useEffect, useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';

import { Context, Api } from 'State'
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import IconGroup from 'Components/Library/IconGroup/IconGroup';
import Table from 'Components/Library/Table/Table';
import { FromCanonical } from 'Utils/DateTime';

const FundList = () => {
    const [ state, dispatch] = useContext(Context);

    const sync = useCallback(() => {
        Api.OrgResources.Entities.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        sync();
    }, [ sync ]);
    
    const downloadFile = useCallback(fileUid => () => {
        Download(fileUid);
    }, []);

    const columns = [
        {
            accessor: 'name',
            Header: 'Name',
            width: 120,
        }, {
            accessor: 'ocfFee',
            Header: 'OCF Fee',
            width: 50,
        }, {
            accessor: 'exAnteFee',
            Header: 'Ex Ante Fee',
            width: 50,
        }, {
            accessor: 'modified',
            Header: 'Last updated',
            width: 50,
        }, {
            accessor: 'factsheet',
            Header: 'Fact sheet',
            width: 80,
            Cell: ({ row }) => row.original.fileUid ? (
                <button onClick={downloadFile(row.original.fileUid)} className='ong-openFileIcon'>
                    {row.original.filename}
                    <DownloadIcon />
                </button>
            ) : null,
        }, {
            accessor: 'actions',
            Header: '',
            width: 80,
            Cell: ({ row }) => (
                <IconGroup>
                    <Link to={`/funds/id/${row.original.id}/delete`}>
                        <DeleteIcon />
                    </Link>
                    <Link to={`/funds/id/${row.original.id}/edit`}>
                        <EditIcon />
                    </Link>
                </IconGroup>
            ),
        },
    ];
    
    let funds = state.Resources.Funds.map(f => {
        return {
            id:        f.Id,
            name:      f.Name,
            ocfFee:    `${f.OcfFee}%`,
            exAnteFee: `${f.ExAnteFee}%`,
            modified:  FromCanonical(f.Modified)?.toLocaleDateString('en-GB'),
            filename:  f.File?.Filename,
            fileUid:   f.File?.Uid,
        };
    });

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/funds/add' }}><Button>Add new fund</Button></Link>
            </Toolbar>

            <Table columns={columns} data={funds} />
        </>
    );
}

export default FundList;
