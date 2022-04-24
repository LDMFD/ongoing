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

import './PolicyList.css';

import { Api } from 'State';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Context } from 'State/StateProvider'
import { Download } from 'Components/Widgets/FileHandling/FileDownloader';
import { CurrencyFormatter } from 'Utils/Strings';

const PolicyList = () => {
    let history = useHistory();

    const [state, dispatch ] = useContext(Context);
    let {
        ClientContext: client,
    } = state;

    let report = GetReport();

    const deletePolicy = useCallback(params => async () => {
        if (window.confirm(`Delete policy?`)) {
            await Api.Clients.Policies.Delete(client.Id, params.row.id);
            await Api.Clients.ClientDetail.Read(dispatch, client.Id);
        }
    }, [ dispatch, client.Id ]);

    const editPolicy = useCallback(params => () => {
        let id = params.row.id;
        history.push(`/clients/id/${client.Id}/policies/id/${id}/edit`);
    }, [ history, client.Id ]);

    const downloadFile = useCallback(params => () => {
        Download(params.row.fileUid);
    }, []);

    const columns = [
        { field: 'policyNumber',     headerName: 'Policy Number',         flex: 0.1, },
        { field: 'platformDiscount', headerName: 'Platform Discount',     flex: 0.1, },
        { field: 'monthlies',        headerName: 'Monthly Contributions', flex: 0.1, },
        { field: 'startValue',       headerName: 'Start Value',           flex: 0.1, },
        { field: 'endValue',         headerName: 'End Value',             flex: 0.1, },
        { field: 'type',             headerName: 'Type',                  flex: 0.1, },
        { field: 'provider',         headerName: 'Provider',              flex: 0.1, },
        { field: 'notes',            headerName: 'Notes',                 flex: 0.1, },
        {
            field: 'actions',
            type: 'actions',
            flex: .1,
            getActions: (params) => ([
                params.row.fileUid
                    ? <GridActionsCellItem icon={<DownloadIcon />} onClick={downloadFile(params)} label="Download factsheet" />
                    : null,
                <GridActionsCellItem icon={<EditIcon />}     onClick={editPolicy(params)}   label="Edit" />,
                <GridActionsCellItem icon={<DeleteIcon />}   onClick={deletePolicy(params)} label="Delete" />,
            ].filter(t => t)),
        },
    ];

    let policies = report.Policies.map(policy => {
        let type = report.PolicyTypes.find(t => t.Id === policy.PolicyTypeId).Name;
        let provider = report.PolicyProviders.find(t => t.Id === policy.PolicyProviderId).Name;

        // TODO refactor with PolicyValuations.js
        let contributions;
        switch (policy.MonthlyContributions) {
            case null: 
                contributions = `Data not provided`;
                break;
            case 0:
                contributions = `No regular contributions`;
                break;
            default:
                contributions = `Annual regular (£${policy.MonthlyContributions})`;
                break;
        }

        return {
            id:               policy.Id,
            policyNumber:     policy.ExternalId,
            platformDiscount: `${policy.PlatformDiscount * 100}%`,
            monthlies:        contributions,
            startValue:       CurrencyFormatter.format(policy.StartValue),
            endValue:         CurrencyFormatter.format(policy.EndValue),
            notes:            policy.Notes,
            fileUid:          policy.File?.Uid,
            type,
            provider,
        };
    }).sort((p,q) => (p.policyNumber < q.policyNumber) ? -1 : ((p.policyNumber > q.policyNumber) ? 1 : 0));

    let data = {
        rows: policies,
        columns: columns,
    }

    return (
        <div className='ongoing-policyList'>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${state.ClientContext.Id}/policies/add` }}><Button>Add policy</Button></Link>
            </Toolbar>

            <DataGrid autoHeight {...data} />
        </div>
    );
}

export default PolicyList;
