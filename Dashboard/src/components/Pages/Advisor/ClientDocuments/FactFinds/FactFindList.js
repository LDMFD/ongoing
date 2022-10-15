import React, { useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import {
    Button,
    Toolbar,
} from '@mui/material';
import Day from 'dayjs';

import { Api } from 'State';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Context } from 'State/StateProvider'
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';

const FactFindList = () => {
    let history = useHistory();

    const [state, dispatch ] = useContext(Context);
    let {
        Metadata: client,
    } = state;

    let report = GetReport();

    const deleteFactFind = useCallback(id => async () => {
        if (window.confirm(`Delete fact find?`)) {
            await Api.Advisor.FactFinds.Delete(client.Id, id);
            await Api.Advisor.ClientDetail.Read(dispatch, client.Id);
        }
    }, [ dispatch, client.Id ]);

    const editFactFind = useCallback(id => () => {
        history.push(`/clients/id/${client.Id}/documents/fact-finds/id/${id}/edit`);
    }, [ history, client.Id ]);

    const downloadFile = useCallback(fileUid => () => {
        Download(fileUid);
    }, []);

    const columns = [
        {
            accessor: 'submitted',
            Header: 'Submitted',
            width: 1,
        },
        {
            accessor: 'factFind',
            Header: 'FactFind',
            width: 3,
            Cell: ({ row }) => (
                <button onClick={downloadFile(row.original.factFind.Uid)} className='ong-openFileIcon'>
                    {row.original.factFind.Filename}
                    <DownloadIcon />
                </button>
            ),
        },
        {
            accessor: 'actions',
            Header: '',
            width: 0.5,
            Cell: ({ row }) => (
                <>
                    <button onClick={editFactFind(row.original.id)} className='ong-openFileIcon'>
                        <EditIcon />
                    </button>
                    <button onClick={deleteFactFind(row.original.id)} className='ong-openFileIcon'>
                        <DeleteIcon />
                    </button>
                </>
            ),
        },
    ];

    let factFinds = report.FactFinds.map(ff => {
        return {
            id:        ff.Id,
            submitted: Day(ff.Submitted).utc(false).format('DD-MM-YYYY'),
            factFind:  ff.File,
        };
    }).sort((p,q) => (p.submitted < q.submitted) ? -1 : ((p.submitted > q.submitted) ? 1 : 0));

    return (
        <div className='ongoing-factfindList'>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${state.Metadata.Id}/documents/fact-finds/add` }}><Button>Add fact find</Button></Link>
            </Toolbar>

            <Table columns={columns} data={factFinds} />
        </div>
    );
}

export default FactFindList;
