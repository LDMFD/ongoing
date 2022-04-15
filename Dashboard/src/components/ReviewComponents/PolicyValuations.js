import React, { useCallback } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';

import { ModuleTypePolicyValuations } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';
import { CurrencyFormatter } from 'Utils/Strings';
import { GetReport } from './GetReport';
import { Download } from 'Components/Widgets/FileHandling/FileDownloader';

const PolicyValuations = () => {
    let report = GetReport();

    const downloadFile = useCallback(params => () => {
        Download(params.row.fileUid);
    }, []);

    const columns = [
        { field: 'policy',        headerName: 'Policy',        flex: 0.1, },
        { field: 'startValue',    headerName: 'Start value',   flex: 0.1, },
        { field: 'endValue',      headerName: 'End value',     flex: 0.1, },
        { field: 'contributions', headerName: 'Contributions', flex: 0.2, },
        { field: 'notes',         headerName: 'Notes',         flex: 0.2, },
        {
            field: 'actions',
            type: 'actions',
            flex: .1,
            getActions: (params) => ([
                params.row.fileUid
                    ? <GridActionsCellItem icon={<DownloadIcon />} onClick={downloadFile(params)} label="Download factsheet" />
                    : null,
            ].filter(t => t)),
        },
    ];

    let valuations = report.Policies.map(p => {
        let contributions;
        switch (p.MonthlyContributions) {
            case null: 
                contributions = 'Data not provided';
                break;
            case 0:
                contributions = 'No regular contributions';
                break;
            default:
                contributions = 'Annual regular contributions';
                break;
        }

        return {
            id:            p.Id,
            policy:        p.ExternalId,
            startValue:    CurrencyFormatter.format(p.StartValue),
            endValue:      CurrencyFormatter.format(p.EndValue),
            contributions: `${contributions} (£${p.MonthlyContributions})`,
            notes:         p.Notes,
            fileUid:       p.File?.Uid,
        };
    });

    let data = {
        rows: valuations,
        columns,
    }

    return (
        <>
            <ModuleWrapper module = {ModuleTypePolicyValuations} />
            <br />

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default PolicyValuations;
