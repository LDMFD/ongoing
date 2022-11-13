import React, { useCallback } from 'react';
import DownloadIcon from '@mui/icons-material/Download';

import { ModuleTypePolicyValuations } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { CurrencyFormatter } from 'Utils/Strings';
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
            Header: 'Policy',
            accessor: 'policy',
            width: 8,
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
            width: 12,
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
                contributions = `Monthly regular (£${p.MonthlyContributions})`;
                break;
        }

        let policyCell = (
            <div className='ong-policyCell'>
                {p.File?.Uid ? (
                    <button className='ong-openFileIcon' onClick={downloadFile(p.File?.Uid)} title="Download policy factsheet">
                        {p.ExternalId}
                        <DownloadIcon />
                    </button>
                ) : p.ExternalId}
            </div>
        )

        let col = {
            id:            p.Id,
            externalId:    p.ExternalId,
            policy:        policyCell,
            startValue:    CurrencyFormatter.format(p.StartValue),
            endValue:      CurrencyFormatter.format(p.EndValue),
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
