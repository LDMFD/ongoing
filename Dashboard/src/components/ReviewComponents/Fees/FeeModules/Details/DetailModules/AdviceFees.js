import React, { useContext, useCallback } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import Day from 'dayjs';

import { ModuleTypeAdviceFee } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import { FormatCurrencyPence } from 'Utils/Strings';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { Context } from 'State';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';

const AdviceFees = () => {
    const [state,  ] = useContext(Context);
    let client = state.Metadata;

    let report = GetReport();
    
    let policies = [];
    report.Policies.forEach(p => {
        if (!policies.some(pol => pol.Id === p.Id)) {
            policies.push({
                id:               p.Id,
                policyNumber:     p.ExternalId,
                fee:              FormatCurrencyPence(client.Fee * p.EndValue / 100),
                fileUid:          p.File?.Uid,
            });
        }
    });

    const downloadFile = useCallback(uid => () => {
        Download(uid);
    }, []);

    const columns = [
        {
            accessor: 'policyNumber',
            Header: 'Policy Number',
            width: 1,
        }, {
            accessor: 'fee',
            Header: 'Fee',
            width: 1,
        }, {
            accessor: 'actions',
            Header: 'Policy file',
            type: 'actions',
            width: .2,
            Cell: ({ row }) => (
                <>
                    {row.original.fileUid &&
                        <button onClick={downloadFile(row.original.fileUid)} className='ong-openFileIcon'>
                            <DownloadIcon />
                        </button>
                    }
                </>
            ),
        },
    ];

    let feesReport = report.FeesReports?.map(fr => {
        return {
            id:        fr.Id,
            submitted: Day(fr.Submitted).utc(false).format('DD-MM-YYYY'),
            file:      fr.File,
        };
    }).sort((p,q) => (p.submitted > q.submitted) ? -1 : ((p.submitted < q.submitted) ? 1 : 0))[0];

    return (
        <>
            <br />
            <Module module={ModuleTypeAdviceFee} />

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

            <Table columns={columns} data={policies} />
        </>
    );
}

export default AdviceFees;
