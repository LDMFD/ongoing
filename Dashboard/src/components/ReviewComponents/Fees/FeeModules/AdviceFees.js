import React, { useContext, useCallback } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import Day from 'dayjs';

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

    const downloadFile = useCallback(uid => () => {
        Download(uid);
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
                    ? <GridActionsCellItem icon={<DownloadIcon />} onClick={downloadFile(params.row.fileUid)} label="Download factsheet" />
                    : null,
            ].filter(t => t)),
        },
    ];

    let data = {
        rows: policies,
        columns: columns,
    }

    let feesReport = report.FeesReports?.map(fr => {
        return {
            id:        fr.Id,
            submitted: Day(fr.Submitted).format('DD-MM-YYYY'),
            file:      fr.File,
        };
    }).sort((p,q) => (p.submitted > q.submitted) ? -1 : ((p.submitted < q.submitted) ? 1 : 0))[0];

    return (
        <>
            <br />
            <ModuleWrapper module={ModuleTypeAdviceFee} />

            <p>
                Advice fee: {client.Fee}%

                {feesReport && (
                    <>
                        <br />
                        Fees report: <button onClick={downloadFile(feesReport.file.Uid)} className='ong-openFileIcon'>
                            {feesReport.file.Filename}
                            <DownloadIcon />
                        </button>
                    </>
                )}
            </p>

            <DataGrid autoHeight {...data} />
        </>
    );
}

export default AdviceFees;
