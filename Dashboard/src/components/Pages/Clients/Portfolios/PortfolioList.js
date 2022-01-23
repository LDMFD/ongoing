import React, { useContext, useCallback } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Toolbar,
} from '@mui/material';

import { Context, Api } from 'State'

const PortfolioList = () => {
    let history = useHistory();

    const [state, dispatch ] = useContext(Context);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    let client = state.Clients.find(c => c.Id === clientId);

    const deletePortfolio = useCallback(params => async () => {
        if (window.confirm(`Delete portfolio?`)) {
            await Api.Clients.Portfolios.Delete(clientId, params.row.id);
            await Api.Clients.ClientDetail.Read(dispatch, clientId);
        }        
    }, [ dispatch, clientId ]);

    const editPortfolio = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/clients/id/${clientId}/portfolios/id/${id}/edit`);
    }, [ history, clientId ]);

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

    let portfolios = client.Portfolios.map(portfolio => {
        let policy = client.Policies.find(p => p.Id === portfolio.PolicyId).ExternalId;
        let model = state.Models.find(p => p.Id === portfolio.ModelId).Name;
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
