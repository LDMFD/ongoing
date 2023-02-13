import React, { useContext, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const ModelList = () => {
    const [ state, dispatch ] = useContext(Context);

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
            width: 100,
        }, {
            accessor: 'operator',
            Header: 'Operator',
            width: 50,
        }, {
            accessor: 'weightedOcfFee',
            Header: 'Weighted OCF Fee',
            width: 50,
        }, {
            accessor: 'weightedExAnteFee',
            Header: 'Weighted Transactional Fee',
            width: 50,
        }, {
            accessor: 'modified',
            Header: 'Last updated',
            width: 60,
        }, {
            accessor: 'file',
            Header: 'File',
            width: 100,
            Cell: ({ row }) => row.original.fileUid ? (
                <button onClick={downloadFile(row.original.fileUid)} className='ong-openFileIcon'>
                    {row.original.filename}
                    <DownloadIcon />
                </button>
            ) : null,
        }, {
            accessor: 'actions',
            Header: '',
            width: 50,
            Cell: ({ row }) => (
                <IconGroup>
                    <Link to={`/models/id/${row.original.id}/delete`}>
                        <DeleteIcon />
                    </Link>
                    <Link to={`/models/id/${row.original.id}/edit`}>
                        <EditIcon />
                    </Link>
                </IconGroup>
            ),
        },
    ];

    let models = state.Resources.Models.map(m => {
        let op = state.Resources.Operators.find(o => o.Id === m.OperatorId).Name;
        return {
            id:                m.Id,
            name:              m.Name,
            operator:          op,
            weightedOcfFee:    `${m.WeightedOcfFee}%`,
            weightedExAnteFee: `${m.WeightedExAnteFee}%`,
            modified:          FromCanonical(m.Modified)?.toLocaleDateString('en-GB'),
            filename:          m.File?.Filename,
            fileUid:           m.File?.Uid,
        };
    });

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: '/models/add' }}><Button>Add new model</Button></Link>
            </Toolbar>

            <Table columns={columns} data={models} />
        </>
    );
}

export default ModelList;
