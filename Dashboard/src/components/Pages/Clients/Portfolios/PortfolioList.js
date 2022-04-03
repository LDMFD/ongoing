import React, { useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Toolbar,
} from '@mui/material';

import { Context, Api } from 'State'
import { GetReport } from 'components/ReviewComponents/GetReport';

const PortfolioList = () => {
    let history = useHistory();

    const [state, dispatch ] = useContext(Context);
    let {
        ClientContext: client,
    } = state;

    let report = GetReport();

    const deletePortfolio = useCallback(params => async () => {
        if (window.confirm(`Delete portfolio?`)) {
            await Api.Clients.Portfolios.Delete(client.Id, params.row.id);
            await Api.Clients.ClientDetail.Read(dispatch, client.Id);
        }        
    }, [ dispatch, client.Id ]);

    const editPortfolio = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/clients/id/${client.Id}/portfolios/id/${id}/edit`);
    }, [ history, client.Id ]);

    const columns = [
        { field: 'idLabel',    headerName: 'ID',          flex: 0.1, },
        { field: 'policy',     headerName: 'Policy',      flex: 0.1, },
        { field: 'model',      headerName: 'Model',       flex: 0.1, },
        { field: 'proportion', headerName: 'Proportion',  flex: 0.1, },
        {
            field: 'actions',
            type: 'actions',
            flex: .05,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />}   onClick={editPortfolio(params)}   label="Edit" />,
                <GridActionsCellItem icon={<DeleteIcon />} onClick={deletePortfolio(params)} label="Delete" />,
            ]
        },
    ];

    let portfolios = report.Portfolios.map(portfolio => {
        let policy = report.Policies.find(p => p.Id === portfolio.PolicyId).ExternalId;
        let model = report.Models.find(p => p.Id === portfolio.ModelId).Name;
        return {
            id:         portfolio.Id,
            idLabel:    `#${portfolio.Id}`,
            policy,
            model,
            proportion: portfolio.Proportion,
        };
    });

    let data = {
        rows: portfolios,
        columns: columns,
    }

    return (
        <div className='ongoing-portfolioList'>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/portfolios/add` }}><Button>Add portfolio</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </div>
    );
}

export default PortfolioList;
