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

const ForecastList = () => {
    let history = useHistory();

    const [state, dispatch ] = useContext(Context);
    let {
        ClientContext: client,
    } = state;

    let report = GetReport();

    const deleteForecast = useCallback(id => async () => {
        if (window.confirm(`Delete forecast document?`)) {
            await Api.Advisor.Forecasts.Delete(client.Id, id);
            await Api.Advisor.ClientDetail.Read(dispatch, client.Id);
        }
    }, [ dispatch, client.Id ]);

    const editForecast = useCallback(id => () => {
        history.push(`/clients/id/${client.Id}/documents/forecasts/id/${id}/edit`);
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
            accessor: 'forecast',
            Header: 'Forecast',
            width: 3,
            Cell: ({ row }) => (
                <button onClick={downloadFile(row.original.forecast.Uid)} className='ong-openFileIcon'>
                    {row.original.forecast.Filename}
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
                    <button onClick={editForecast(row.original.id)} className='ong-openFileIcon'>
                        <EditIcon />
                    </button>
                    <button onClick={deleteForecast(row.original.id)} className='ong-openFileIcon'>
                        <DeleteIcon />
                    </button>
                </>
            ),
        },
    ];

    let forecasts = report.Forecasts.map(ff => {
        return {
            id:        ff.Id,
            submitted: Day(ff.Submitted).utc(false).format('DD-MM-YYYY'),
            forecast:  ff.File,
        };
    }).sort((p,q) => (p.submitted < q.submitted) ? -1 : ((p.submitted > q.submitted) ? 1 : 0));

    return (
        <div className='ongoing-forecastList'>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${state.ClientContext.Id}/documents/forecasts/add` }}><Button>Add forecast document</Button></Link>
            </Toolbar>

            <Table columns={columns} data={forecasts} />
        </div>
    );
}

export default ForecastList;
