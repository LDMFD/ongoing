import React, { useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import {
    Button,
    Toolbar,
} from '@mui/material';

import { Context, Api } from 'State'
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Widgets/FileHandling/FileDownloader';

const PortfolioList = () => {
    let history = useHistory();

    const [state, dispatch ] = useContext(Context);
    let {
        ClientContext: client,
    } = state;

    let report = GetReport();

    const deletePortfolio = useCallback(params => async () => {
        if (window.confirm(`Delete portfolio?`)) {
            await Api.Advisor.Portfolios.Delete(client.Id, params.row.id);
            await Api.Advisor.ClientDetail.Read(dispatch, client.Id);
        }        
    }, [ dispatch, client.Id ]);

    const editPortfolio = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/clients/id/${client.Id}/holdings/portfolios/id/${id}/edit`);
    }, [ history, client.Id ]);

    const downloadFile = useCallback(params => () => {
        Download(params.row.fileUid);
    }, []);

    const columns = [
        { field: 'idLabel',    headerName: 'ID',          flex: 0.1, },
        { field: 'policy',     headerName: 'Policy',      flex: 0.1, },
        {
            field: 'policyActions',
            type: 'actions',
            flex: .01,
            getActions: (params) => [
                <GridActionsCellItem icon={<DownloadIcon />} onClick={downloadFile(params)}     label="Download factsheet" />,
            ]
        },
        { field: 'model',      headerName: 'Model',       flex: 0.1, },
        {
            field: 'modelActions',
            type: 'actions',
            flex: .01,
            getActions: (params) => [
                <GridActionsCellItem icon={<DownloadIcon />} onClick={downloadFile(params)}     label="Download factsheet" />,
            ]
        },
        { field: 'proportion', headerName: 'Proportion',  flex: 0.1, },
        {
            field: 'actions',
            type: 'actions',
            flex: .05,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />}     onClick={editPortfolio(params)}    label="Edit" />,
                <GridActionsCellItem icon={<DeleteIcon />}   onClick={deletePortfolio(params)}  label="Delete" />,
            ]
        },
    ];

    let portfolios = report.Portfolios.map(portfolio => {
        let policy = report.Policies.find(p => p.Id === portfolio.PolicyId).ExternalId;
        let model = report.Models.find(p => p.Id === portfolio.ModelId);
        return {
            id:         portfolio.Id,
            idLabel:    `#${portfolio.Id}`,
            policy,
            model:      model.Name,
            proportion: `${portfolio.Proportion * 100}%`,
            fileUid:    model.File?.Uid,
        };
    });

    let data = {
        rows: portfolios,
        columns: columns,
    }

    return (
        <div className='ongoing-portfolioList'>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/holdings/portfolios/add` }}><Button>Add portfolio</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </div>
    );
}

export default PortfolioList;
