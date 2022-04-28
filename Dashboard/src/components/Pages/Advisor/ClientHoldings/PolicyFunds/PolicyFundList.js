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
import { Download } from 'Components/Library/FileHandling/FileDownloader';

const PolicyFundList = () => {
    let history = useHistory();

    const [state, dispatch ] = useContext(Context);
    let {
        ClientContext: client,
    } = state;

    let report = GetReport();

    const deletePolicyFund = useCallback(params => async () => {
        if (window.confirm(`Delete policy fund?`)) {
            await Api.Advisor.PolicyFunds.Delete(client.Id, params.row.id);
            await Api.Advisor.ClientDetail.Read(dispatch, client.Id);
        }        
    }, [ dispatch, client.Id ]);

    const editPolicyFund = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/clients/id/${client.Id}/holdings/policy-funds/id/${id}/edit`);
    }, [ history, client.Id ]);

    const downloadFile = useCallback(params => () => {
        Download(params.row.fileUid);
    }, []);

    const columns = [
        { field: 'policy',     headerName: 'Policy',      flex: 0.1, },
        { field: 'fund',       headerName: 'Fund',       flex: 0.1, },
        { field: 'proportion', headerName: 'Proportion',  flex: 0.1, },
        {
            field: 'actions',
            type: 'actions',
            flex: .05,
            getActions: (params) => ([
                params.row.fileUid
                    ? <GridActionsCellItem icon={<DownloadIcon />} onClick={downloadFile(params)} label="Download factsheet" />
                    : null,
                <GridActionsCellItem icon={<EditIcon />}     onClick={editPolicyFund(params)}   label="Edit" />,
                <GridActionsCellItem icon={<DeleteIcon />}   onClick={deletePolicyFund(params)} label="Delete" />,
            ].filter(t => t)),
        },
    ];

    let policyFunds = report.PolicyFunds.map(policyFund => {
        let policy = report.Policies.find(p => p.Id === policyFund.PolicyId).ExternalId;
        let fund = report.Funds.find(p => p.Id === policyFund.FundId);
        return {
            id:         policyFund.Id,
            idLabel:    `#${policyFund.Id}`,
            policy,
            fund:       fund.Name,
            proportion: `${policyFund.Proportion * 100}%`,
            fileUid:    fund.File?.Uid,
        };
    });

    let data = {
        rows: policyFunds,
        columns: columns,
    }

    return (
        <>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/holdings/policy-funds/add` }}><Button>Add policy fund</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default PolicyFundList;
