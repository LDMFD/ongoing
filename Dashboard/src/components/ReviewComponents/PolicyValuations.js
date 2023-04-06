import React, { useCallback } from 'react';
import DownloadIcon from '@mui/icons-material/Download';

import { ModuleTypePolicyValuations } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { FormatCurrencyPence } from 'Utils/Strings';
import { GetReport } from './GetReport';
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';

import './PolicyValuations.css';

const PolicyValuations = () => {
    let report = GetReport();

    const downloadFile = useCallback(uid => () => {
        Download(uid);
    }, []);

    let includeNotes = report.Policies.some(p => p.Notes?.length && p.Notes !== '<p><br></p>');

    let columns = [
        {
            Header: 'Platform',
            accessor: 'platform',
            width: 8,
        },
        {
            Header: 'Type',
            accessor: 'type',
            width: 8,
        },
        {
            Header: 'Policy',
            accessor: 'policy',
            width: 12,
        },
        {
            Header: 'Start value',
            accessor: 'startValue',
            width: 8,
        },
        {
            Header: 'End value',
            accessor: 'endValue',
            width: 8,
        },
        {
            Header: 'Regular Contributions',
            accessor: 'contributions',
            width: 20,
        },
    ];
    if (includeNotes) {
        columns.push({
            Header: 'Notes',
            accessor: 'notes',
            width: 40,
            Cell: ({ row }) => (
                row.original.notes && (
                    <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.notes }} />
                )
            ),
        });
    }
    
    let valuations = report.Policies.map(p => {
        let contributions;
        switch (p.MonthlyContributions) {
            case null: 
                contributions = `Data not provided`;
                break;
            case 0:
                contributions = `No regular contributions`;
                break;
            default:
                contributions = `Monthly regular (${FormatCurrencyPence(p.MonthlyContributions)})`;
                break;
        }

        let policyCell = (
            <div className='ong-policyCell'>
                {p.File?.Uid ? (
                    <button className='ong-openFileIcon' onClick={downloadFile(p.File?.Uid)} title="Download policy factsheet">
                        {p.ExternalId}&nbsp;<DownloadIcon />
                    </button>
                ) : p.ExternalId}
            </div>
        )

        let platform = report.PolicyProviders.find(pp => pp.Id === p.PolicyProviderId)?.Name;
        let type = report.PolicyTypes.find(pt => pt.Id === p.PolicyTypeId)?.Name;

        let col = {
            id:            p.Id,
            platform:      platform,
            type:          type,
            externalId:    p.ExternalId,
            policy:        policyCell,
            startValue:    FormatCurrencyPence(p.StartValue),
            endValue:      FormatCurrencyPence(p.EndValue),
            contributions: `${contributions}`,
            fileUid:       p.File?.Uid,
        };
        if (includeNotes) {
            col.notes = p.Notes;
        }
        return col;
    }).sort((p,q) => (p.externalId < q.externalId) ? -1 : ((p.externalId > q.externalId) ? 1 : 0));

    return (
        <>
            <Module module = {ModuleTypePolicyValuations} />
            <br />

            <Table columns={columns} data={valuations} />

            {/* <DataGrid autoHeight {...data} /> */}
        </>
    );
}

export default PolicyValuations;
