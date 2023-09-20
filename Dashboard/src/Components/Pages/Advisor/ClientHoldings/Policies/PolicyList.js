import { useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './PolicyList.css';

import { DownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Api } from 'State';
import { Context } from 'State/StateProvider';
import { FormatCurrencyPence } from 'Utils/Strings';
import PageTitle from 'Components/Library/PageTitle/PageTitle';

const PolicyList = () => {
    const [ state, dispatch ] = useContext(Context);

    let { clientId } = useParams();
    let client = state.Clients.find(c => c.Id === clientId);

    const sync = useCallback(() => {
        Api.Advisor.ClientDetail.Read(dispatch, clientId);
    }, [ dispatch, clientId ]);

    useEffect(() => {
        sync();
    }, [ sync ]);

    let report = GetReport();

    const columns = [{
        id: 'policy',
        header: 'Policy',
        width: 150,
        Cell: ({ row }) => (
            <DownloadChip
                title  = {row.original.policy}
                fileId = {row.original.fileId}
            />
        ),
    }, {
        id: 'type',
        header: 'Type',
        width: 60,
    }, {
        id: 'platformDiscount',
        header: 'Fee',
        width: 60,
    }, {
        id: 'monthlies',
        header: 'Contributions',
        width: 60,
    }, {
        id: 'startValue',
        header: 'Start Value',
        width: 60,
    }, {
        id: 'endValue',
        header: 'End Value',
        width: 60,
    }, {
        id: 'notes',
        header: 'Notes',
        Cell: ({ row }) => (
            row.original.notes && (
                <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.notes }} />
            )
        ),
    }];

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
                contributions = `Monthly (${FormatCurrencyPence(policy.MonthlyContributions)})`;
                break;
        }

        return {
            id:               policy.Id,
            policy:           `${provider} ${policy.ExternalId}`,
            policyNumber:     policy.ExternalId,
            platformDiscount: providerDiscount ? `${providerDiscount.Discount}%`: '-',
            monthlies:        contributions,
            startValue:       FormatCurrencyPence(policy.StartValue),
            endValue:         FormatCurrencyPence(policy.EndValue),
            notes:            policy.Notes,
            fileId:           policy.File?.Uid,
            type,
        };
    }).sort((p,q) => (p.policyNumber < q.policyNumber) ? -1 : ((p.policyNumber > q.policyNumber) ? 1 : 0));

    return (
        <>
        <PageTitle title={`Policies | ${client.Identity.Forenames} ${client.Identity.Surname} | Amplifa`} />
            <Table
                flexibleColumn        = {7}
                columns               = {columns}
                data                  = {policies}
                resource              = {`clients/id/${clientId}/holdings/policies`}
                label                 = 'Policy'
            />
        </>
    );
}

export default PolicyList;
