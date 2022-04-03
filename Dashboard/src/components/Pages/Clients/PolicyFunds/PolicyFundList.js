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

const PolicyFundList = () => {
    let history = useHistory();

    const [state, dispatch ] = useContext(Context);
    let {
        ClientContext: client,
    } = state;

    let report = GetReport();

    const deletePolicyFund = useCallback(params => async () => {
        if (window.confirm(`Delete policy fund?`)) {
            await Api.Clients.PolicyFunds.Delete(client.Id, params.row.id);
            await Api.Clients.ClientDetail.Read(dispatch, client.Id);
        }        
    }, [ dispatch, client.Id ]);

    const editPolicyFund = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/clients/id/${client.Id}/policy-funds/id/${id}/edit`);
    }, [ history, client.Id ]);

    const columns = [
        { field: 'idLabel',    headerName: 'ID',          flex: 0.1, },
        { field: 'policy',     headerName: 'Policy',      flex: 0.1, },
        { field: 'fund',       headerName: 'Fund',       flex: 0.1, },
        { field: 'proportion', headerName: 'Proportion',  flex: 0.1, },
        {
            field: 'actions',
            type: 'actions',
            flex: .05,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />}   onClick={editPolicyFund(params)}   label="Edit" />,
                <GridActionsCellItem icon={<DeleteIcon />} onClick={deletePolicyFund(params)} label="Delete" />,
            ]
        },
    ];

    let policyFunds = report.PolicyFunds.map(policyFund => {
        let policy = report.Policies.find(p => p.Id === policyFund.PolicyId).ExternalId;
        let fund = report.Funds.find(p => p.Id === policyFund.FundId).Name;
        return {
            id:         policyFund.Id,
            idLabel:    `#${policyFund.Id}`,
            policy,
            fund,
            proportion: policyFund.Proportion,
        };
    });

    let data = {
        rows: policyFunds,
        columns: columns,
    }

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/policy-funds/add` }}><Button>Add policy fund</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default PolicyFundList;
