import React, { useContext, useCallback } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Toolbar,
} from '@mui/material';

import { Context } from 'State/StateProvider'

import './PolicyList.css';
import { Api } from 'State';

const PolicyList = () => {
    let history = useHistory();

    const [state, dispatch ] = useContext(Context);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    let client = state.Clients.find(c => c.Id === clientId);

    const deletePolicy = useCallback(params => async () => {
        if (window.confirm(`Delete policy?`)) {
            await Api.Clients.Policies.Delete(clientId, params.row.id);
            await Api.Clients.ClientDetail.Read(dispatch, clientId);
        }
    }, [ dispatch, clientId ]);

    const editPolicy = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/clients/id/${clientId}/policies/id/${id}/edit`);
    }, [ history, clientId ]);

    const columns = [
        { field: 'policyNumber',     headerName: 'Policy Number',         flex: 0.1, },
        { field: 'platformDiscount', headerName: 'Platform Discount',     flex: 0.1, },
        { field: 'monthlies',        headerName: 'Monthly Contributions', flex: 0.1, },
        { field: 'type',             headerName: 'Type',                  flex: 0.1, },
        { field: 'provider',         headerName: 'Provider',              flex: 0.1, },
        {
            field: 'actions',
            type: 'actions',
            flex: .05,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />}   onClick={editPolicy(params)}   label="Edit" />,
                <GridActionsCellItem icon={<DeleteIcon />} onClick={deletePolicy(params)} label="Delete" />,
            ]
        },
    ];

    let policies = client.Policies.map(policy => {
        let type = state.PolicyTypes.find(t => t.Id === policy.PolicyTypeId).Name;
        let provider = state.PolicyProviders.find(t => t.Id === policy.PolicyProviderId).Name;
        return {
            id:               policy.Id,
            policyNumber:     policy.ExternalId,
            platformDiscount: policy.PlatformDiscount,
            monthlies:        policy.MonthlyContributions,
            type,
            provider,
        };
    });

    let data = {
        rows: policies,
        columns: columns,
    }

    return (
        <div className='ongoing-policyList'>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/policies/add` }}><Button>Add policy</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </div>
    );
}

export default PolicyList;
