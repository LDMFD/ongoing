import React, { useCallback } from 'react';
import DownloadIcon from '@mui/icons-material/Download';

import { ModuleTypePolicyValuations } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';
import { CurrencyFormatter } from 'Utils/Strings';
import { GetReport } from './GetReport';
import { Download } from 'Components/Widgets/FileHandling/FileDownloader';
import Table from '../Widgets/Table';

import './PolicyValuations.css';

const PolicyValuations = () => {
    let report = GetReport();

    const downloadFile = useCallback(uid => () => {
        Download(uid);
    }, []);

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
            Header: 'Contributions',
            accessor: 'contributions',
            width: 10,
        },
        {
            Header: 'Notes',
            accessor: 'notes',
            width: 40,
            Cell: ({ row }) => (
                row.original.notes && (
                    <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.notes }} />
                )
            ),
        },
    ];
    
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
                contributions = `Annual regular (£${p.MonthlyContributions})`;
                break;
        }

        let policyCell = (
            <div className='ong-policyCell'>
                {p.ExternalId}
                {p.File?.Uid && (
                    <span className='ong-openFileIcon'>
                        <button onClick={downloadFile(p.File?.Uid)} title="Download policy factsheet">
                            <DownloadIcon />
                        </button>
                    </span>
                )}
            </div>
        )

        return {
            id:            p.Id,
            externalId:    p.ExternalId,
            policy:        policyCell,
            startValue:    CurrencyFormatter.format(p.StartValue),
            endValue:      CurrencyFormatter.format(p.EndValue),
            contributions: `${contributions}`,
            notes:         p.Notes,
            fileUid:       p.File?.Uid,
        };
    }).sort((p,q) => (p.externalId < q.externalId) ? -1 : ((p.externalId > q.externalId) ? 1 : 0));

    return (
        <>
            <ModuleWrapper module = {ModuleTypePolicyValuations} />
            <br />

            <Table columns={columns} data={valuations} />

            {/* <DataGrid autoHeight {...data} /> */}
        </>
    );
}

export default PolicyValuations;
