import { DownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import TabContent from 'Components/Library/TabContent/TabContent';
import Table from 'Components/Library/Table/Table';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { ModuleTypePolicyValuations } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import { FormatCurrencyPence } from 'Utils/Strings';
import { GetReport } from './GetReport';

import './PolicyValuations.css';

const PolicyValuations = () => {
    let report = GetReport();

    let includeNotes = report.Policies.some(p => p.Notes?.length && p.Notes !== '<p><br></p>');

    let columns = [{
        id: 'policy',
        header: 'Policy',
        width: 200,
        cell: ({ row }) => (
            <DownloadChip
                title  = {row.original.policy}
                fileId = {row.original.fileId}
            />
        ),
    }, {
        id: 'type',
        header: 'Type',
        width: 60,
    // TODO Confirm include or not
    // }, {
    //     id:     'fee',
    //     header: 'Fee',
    //     width:  60,
    }, {
        id: 'contributions',
        header: 'Contributions',
        width: 150,
    }, {
        id: 'startValue',
        header: 'Start value',
        width: 150,
    }, {
        id: 'endValue',
        header: 'End value',
        width: 150,
    }];

    if (includeNotes) {
        columns.push({
            id: 'notes',
            header: 'Notes',
            cell: ({ row }) => (
                row.original.notes && (
                    <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.notes }} />
                )
            ),
        });
    }
    
    let valuations = report.Policies.map(policy => {
        let contributions;
        switch (policy.MonthlyContributions) {
            case null: 
                contributions = `No data`;
                break;
            case 0:
                contributions = `No regular`;
                break;
            default:
                contributions = `Monthly (${FormatCurrencyPence(policy.MonthlyContributions)})`;
                break;
        }

        let platform = report.PolicyProviders.find(pp => pp.Id === policy.PolicyProviderId)?.Name;
        // let providerDiscount = report.ProviderDiscounts.find(t => t.PolicyProviderId === policy.PolicyProviderId);
        let type = report.PolicyTypes.find(pt => pt.Id === policy.PolicyTypeId)?.Name;

        let col = {
            id:            policy.Id,
            platform:      platform,
            type:          type,
            policy:        `${platform} ${policy.ExternalId}`,
            // fee:           providerDiscount ? `${providerDiscount.Discount}%`: '-',
            startValue:    FormatCurrencyPence(policy.StartValue),
            endValue:      FormatCurrencyPence(policy.EndValue),
            contributions: `${contributions}`,
            fileId:        policy.File?.Uid,
            notes:         policy.notes,
        };
        if (includeNotes) {
            col.notes = policy.Notes;
        }
        return col;
    }).sort((p,q) => (p.externalId < q.externalId) ? -1 : ((p.externalId > q.externalId) ? 1 : 0));

    return (
        <TabContent>
            <Module module = {ModuleTypePolicyValuations} />
            <br />

            <Table
                flexibleColumn   = {6}
                columns          = {columns}
                data             = {valuations}
                label            = 'POLICY VALUATIONS'
                enableRowActions = {false}
            />

            {/* <DataGrid autoHeight {...data} /> */}
        </TabContent>
    );
}

export default PolicyValuations;
