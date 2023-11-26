import { useContext } from 'react';

import { ModuleTypeAdviceFee } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import { FormatCurrencyPence } from 'Utils/Strings';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { Context } from 'State';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { DownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';
import Panel from 'Components/Library/Panel/Panel';

const AdviceFees = () => {
    const [state,  ] = useContext(Context);
    let client = state.Metadata;

    let report = GetReport();
    
    let policies = [];
    report.Policies.forEach(policy => {
        let provider = report.PolicyProviders.find(t => t.Id === policy.PolicyProviderId).Name;
        if (!policies.some(pol => pol.Id === policy.Id)) {
            policies.push({
                id:     policy.Id,
                policy: `${provider} ${policy.ExternalId}`,
                fee:    FormatCurrencyPence(client.Fee * policy.EndValue / 100),
                fileId: policy.File?.Uid,
            });
        }
    });

    const columns = [{
        id: 'policy',
        header: 'Policy',
        width: 200,
        cell: ({ row }) => row.original.fileId ? (
            <DownloadChip
                title  = {row.original.policy}
                fileId = {row.original.fileId}
            />
        ) : row.original.policy,
    }, {
        id: 'fee',
        header: 'Fee',
        width: 200,
    }];

    let feesReports = report.FeesReports?.map(fr => {
        return {
            id:        fr.Id,
            // submitted: r.Submitted,
            file:      fr.File,
        };
    }).sort((p,q) => (p.submitted > q.submitted) ? -1 : ((p.submitted < q.submitted) ? 1 : 0));
    console.log(feesReports)

    return (
        <>
            <Module module={ModuleTypeAdviceFee} />

            <Panel>
                <p>
                    Your advice fee is: {client.Fee}%
                    
                    {feesReports.length === 1 ?
                        <p>
                            Download your fees report:
                            <DownloadChip
                                title={`Fees report ${feesReports[0].submitted}`}
                                fileId={feesReports[0].file.Uid}
                            />
                        </p>
                    :
                        <>
                            <p>Download your fees reports:</p>
                            <ul>
                                {feesReports.map(feesReport => (
                                    <li>
                                        <DownloadChip
                                            title={`Fees report ${feesReport.submitted}`}
                                            fileId={feesReport.file.Uid}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </>
                    }
                </p>
            </Panel>

            {policies.length > 0 &&
                <Table
                    label            = 'Policies'
                    columns          = {columns}
                    data             = {policies}
                    enableRowActions = {false}
                />
            }
        </>
    );
}

export default AdviceFees;
