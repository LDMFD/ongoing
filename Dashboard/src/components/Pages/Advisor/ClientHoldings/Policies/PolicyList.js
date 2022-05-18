import React, { useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
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
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import { CurrencyFormatter } from 'Utils/Strings';
import Table from 'Components/Library/Table';

const PolicyList = () => {
    let history = useHistory();

    const [state, dispatch ] = useContext(Context);
    let {
        ClientContext: client,
    } = state;

    let report = GetReport();

    const deletePolicy = useCallback(id => async () => {
        if (window.confirm(`Delete policy?`)) {
            await Api.Advisor.Policies.Delete(client.Id, id);
            await Api.Advisor.ClientDetail.Read(dispatch, client.Id);
        }
    }, [ dispatch, client.Id ]);

    const editPolicy = useCallback(id => () => {
        history.push(`/clients/id/${client.Id}/holdings/policies/id/${id}/edit`);
    }, [ history, client.Id ]);

    const downloadFile = useCallback(fileUid => () => {
        Download(fileUid);
    }, []);

    const columns = [{
        accessor: 'policyNumber',
        Header: 'Policy',
        width: 1,
        Cell: ({ row }) => (
            <>
                {row.original.policyNumber}
                {row.original.fileUid &&
                    <button onClick={downloadFile(row.original.fileUid)} className='ong-openFileIcon'>
                        <DownloadIcon />
                    </button>
                }
            </>
        ),
    }, {
        accessor: 'platformDiscount',
        Header: 'Discounted Platform Fee',
        width: 1,
    }, {
        accessor: 'monthlies',
        Header: 'Monthly Contributions',
        width: 1,
    }, {
        accessor: 'startValue',
        Header: 'Start Value',
        width: 1,
    }, {
        accessor: 'endValue',
        Header: 'End Value',
        width: 1,
    }, {
        accessor: 'type',
        Header: 'Type',
        width: 1,
    }, {
        accessor: 'provider',
        Header: 'Provider',
        width: 1,
    }];

    let includeNotes = report.Policies.some(p => p.Notes?.length && p.Notes !== '<p><br></p>');
    if (includeNotes) {
        columns.push({
            Header: 'Notes',
            accessor: 'notes',
            width: 3,
            Cell: ({ row }) => (
                row.original.notes && (
                    <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.notes }} />
                )
            ),
        });
    }

    columns.push({
        accessor: 'actions',
        Header: '',
        width: 1,
        Cell: ({ row }) => (
            <>
                <button onClick={editPolicy(row.original.id)} className='ong-openFileIcon'>
                    <EditIcon />
                </button>
                <button onClick={deletePolicy(row.original.id)} className='ong-openFileIcon'>
                    <DeleteIcon />
                </button>
            </>
        ),
    });

    let policies = report.Policies.map(policy => {
        let type = report.PolicyTypes.find(t => t.Id === policy.PolicyTypeId).Name;
        let provider = report.PolicyProviders.find(t => t.Id === policy.PolicyProviderId).Name;
        let providerDiscount = report.ProviderDiscounts.find(t => t.PolicyProviderId === policy.PolicyProviderId);

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
                contributions = `Monthly regular (£${policy.MonthlyContributions})`;
                break;
        }

        return {
            id:               policy.Id,
            policyNumber:     policy.ExternalId,
            platformDiscount: providerDiscount ? `${providerDiscount.Discount}%` : '-',
            monthlies:        contributions,
            startValue:       CurrencyFormatter.format(policy.StartValue),
            endValue:         CurrencyFormatter.format(policy.EndValue),
            notes:            policy.Notes,
            fileUid:          policy.File?.Uid,
            type,
            provider,
        };
    }).sort((p,q) => (p.policyNumber < q.policyNumber) ? -1 : ((p.policyNumber > q.policyNumber) ? 1 : 0));

    return (
        <div className='ongoing-policyList'>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${state.ClientContext.Id}/holdings/policies/add` }}><Button>Add policy</Button></Link>
            </Toolbar>

            <Table columns={columns} data={policies} />
        </div>
    );
}

export default PolicyList;
