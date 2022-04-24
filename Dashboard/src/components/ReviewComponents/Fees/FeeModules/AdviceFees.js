import React, { useContext, useCallback } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';

import { ModuleTypeAdviceFee } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { CurrencyFormatter } from 'Utils/Strings';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';
import { Context } from 'State';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Widgets/FileHandling/FileDownloader';

const AdviceFees = () => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

    let report = GetReport();
    
    let policies = [];
    report.Policies.forEach(p => {
        if (!policies.some(pol => pol.Id === p.Id)) {
            policies.push({
                id:               p.Id,
                policyNumber:     p.ExternalId,
                fee:              CurrencyFormatter.format(client.Fee * p.EndValue / 100),
                fileUid:          p.File?.Uid,
            });
        }
    });

    const downloadFile = useCallback(params => () => {
        Download(params.row.fileUid);
    }, []);

    const columns = [
        { field: 'policyNumber', headerName: 'Policy Number', flex: 0.1, },
        { field: 'fee',          headerName: 'Fee',           flex: 0.1, },
        {
            field: 'actions',
            type: 'actions',
            flex: .01,
            getActions: (params) => ([
                params.row.fileUid
                    ? <GridActionsCellItem icon={<DownloadIcon />} onClick={downloadFile(params)} label="Download factsheet" />
                    : null,
            ].filter(t => t)),
        },
    ];

    let data = {
        rows: policies,
        columns: columns,
    }

    return (
        <>
            <br />
            <ModuleWrapper module={ModuleTypeAdviceFee} />

            <p>
                Advice fee: {client.Fee}%
            </p>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default AdviceFees;
