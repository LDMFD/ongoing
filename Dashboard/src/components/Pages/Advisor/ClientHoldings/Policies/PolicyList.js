import React, { useContext, useCallback, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
import { FormatCurrencyPence } from 'Utils/Strings';
import IconGroup from 'Components/Library/IconGroup/IconGroup';
import Table from 'Components/Library/Table/Table';

const PolicyList = () => {
    const [state, dispatch ] = useContext(Context);
    let {
        Metadata: client,
    } = state;

    let { clientId } = useParams();

    const sync = useCallback(() => {
        Api.Advisor.ClientDetail.Read(dispatch, clientId);
    }, [ dispatch, clientId ]);

    useEffect(() => {
        sync();
    }, [ sync ]);

    let report = GetReport();

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
        width: 1.5,
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
        width: 2,
        Cell: ({ row }) => (
            <IconGroup>
                <Link to={`/clients/id/${client.Id}/holdings/policies/delete/${row.original.id}`}>
                    <DeleteIcon />
                </Link>
                <Link to={`/clients/id/${client.Id}/holdings/policies/id/${row.original.id}/edit`}>
                    <EditIcon />
                </Link>
            </IconGroup>
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
                contributions = `Monthly regular (${FormatCurrencyPence(policy.MonthlyContributions)})`;
                break;
        }

        return {
            id:               policy.Id,
            policyNumber:     policy.ExternalId,
            platformDiscount: providerDiscount ? `${providerDiscount.Discount}%` : '-',
            monthlies:        contributions,
            startValue:       FormatCurrencyPence(policy.StartValue),
            endValue:         FormatCurrencyPence(policy.EndValue),
            notes:            policy.Notes,
            fileUid:          policy.File?.Uid,
            type,
            provider,
        };
    }).sort((p,q) => (p.policyNumber < q.policyNumber) ? -1 : ((p.policyNumber > q.policyNumber) ? 1 : 0));

    return (
        <div className='ongoing-policyList'>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${state.Metadata.Id}/holdings/policies/add` }}><Button>Add policy</Button></Link>
            </Toolbar>

            <Table columns={columns} data={policies} />
        </div>
    );
}

export default PolicyList;
