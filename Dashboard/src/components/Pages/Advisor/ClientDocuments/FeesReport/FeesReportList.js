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
import Table from 'Components/Library/Table';

const FeesReportList = () => {
    let history = useHistory();

    const [state, dispatch ] = useContext(Context);
    let {
        ClientContext: client,
    } = state;

    let report = GetReport();

    const deleteFeesReport = useCallback(id => async () => {
        if (window.confirm(`Delete fees report?`)) {
            await Api.Advisor.FeesReports.Delete(client.Id, id);
            await Api.Advisor.ClientDetail.Read(dispatch, client.Id);
        }
    }, [ dispatch, client.Id ]);

    const editFeesReport = useCallback(id => () => {
        history.push(`/clients/id/${client.Id}/documents/fees-reports/id/${id}/edit`);
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
            accessor: 'feesReport',
            Header: 'FeesReport',
            width: 3,
            Cell: ({ row }) => (
                <button onClick={downloadFile(row.original.feesReport.Uid)} className='ong-openFileIcon'>
                    {row.original.feesReport.Filename}
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
                    <button onClick={editFeesReport(row.original.id)} className='ong-openFileIcon'>
                        <EditIcon />
                    </button>
                    <button onClick={deleteFeesReport(row.original.id)} className='ong-openFileIcon'>
                        <DeleteIcon />
                    </button>
                </>
            ),
        },
    ];

    let feesReports = report.FeesReports.map(ff => {
        return {
            id:        ff.Id,
            submitted: Day(ff.Submitted).format('DD-MM-YYYY'),
            feesReport:  ff.File,
        };
    }).sort((p,q) => (p.submitted < q.submitted) ? -1 : ((p.submitted > q.submitted) ? 1 : 0));

    return (
        <div>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${state.ClientContext.Id}/documents/fees-reports/add` }}><Button>Add fees report</Button></Link>
            </Toolbar>

            <Table columns={columns} data={feesReports} />
        </div>
    );
}

export default FeesReportList;
