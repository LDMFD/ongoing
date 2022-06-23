import React, { useContext, useCallback } from 'react';
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
import Table from 'Components/Library/Table/Table';
import { FromCanonical } from 'Utils/DateTime';

const ModelList = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    const onDelete = useCallback(id => async () => {
        if (window.confirm(`Delete model?`)) {
            await window.ApiClient.delete(`advisor/models/${id}`)
            await Api.Global.Entities.Read(dispatch);
        }        
    }, [ dispatch ]);

    const onEdit = useCallback(id => () => {
        history.push(`/models/id/${id}/edit`);
    }, [ history ]);

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
            Header: 'Weighted Ex Ante Fee',
            width: 50,
        }, {
            accessor: 'modified',
            Header: 'Last updated',
            width: 60,
        }, {
            accessor: 'file',
            Header: 'File',
            width: 100,
            Cell: ({ row }) => row.original.fileUid && (
                <button onClick={downloadFile(row.original.fileUid)} className='ong-openFileIcon'>
                    {row.original.filename}
                    <DownloadIcon />
                </button>
            ),
        }, {
            accessor: 'actions',
            Header: '',
            width: 50,
            Cell: ({ row }) => (
                <>
                    <button onClick={onEdit(row.original.id)} className='ong-openFileIcon'>
                        <EditIcon />
                    </button>
                    <button onClick={onDelete(row.original.id)} className='ong-openFileIcon'>
                        <DeleteIcon />
                    </button>
                </>
            ),
        },
    ];

    let models = state.Entities.Models.map(m => {
        let op = state.Entities.Operators.find(o => o.Id === m.OperatorId).Name;
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
