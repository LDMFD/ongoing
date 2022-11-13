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
import Table from 'Components/Library/Table/Table';
import { FromCanonical } from 'Utils/DateTime';

const FundList = () => {
    let history = useHistory();
    const [ state, dispatch] = useContext(Context);

    const getFunds = useCallback(() => {
        Api.OrgResources.Entities.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        getFunds();
    }, [ getFunds ]);
    
    const onDelete = useCallback(id => async () => {
        if (window.confirm(`Delete fund?`)) {
            await window.ApiClient.delete(`advisor/funds/${id}`)
            await Api.OrgResources.Entities.Read(dispatch);
        }        
    }, [ dispatch ]);

    const onEdit = useCallback(id => () => {
        history.push(`/funds/id/${id}/edit`);
    }, [ history ]);

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
