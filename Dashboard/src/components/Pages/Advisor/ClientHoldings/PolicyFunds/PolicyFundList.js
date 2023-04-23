import { useContext, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Context, Api } from 'State';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import Table from 'Components/Library/Table/Table';
import { ProportionWarning } from 'Components/Library/Warning/ProportionWarning';
import { DownloadChip } from 'Components/Library/FileHandling/FileDownloader';

const PolicyFundList = () => {
    const [state, dispatch ] = useContext(Context);
    let {
        Metadata: client,
    } = state;

    let { clientId } = useParams();

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
        width: 300,
        Cell: ({ row }) => (
            <DownloadChip
                title  = {row.original.policy}
                fileId = {row.original.policyFileId}
            />
        ),
    }, {
        id: 'fund',
        header: 'Fund',
        width: 300,
        Cell: ({ row }) => (
            <DownloadChip
                title  = {row.original.fund}
                fileId = {row.original.fundFileId}
            />
        ),
    }, {
        id: 'proportion',
        header: 'Proportion',
        width: 200,
    }, {
        id: 'includeInFee',
        header: 'Include in fee?',
    }];

    let policyFunds = report.PolicyFunds.map(policyFund => {
        let policy = report.Policies.find(p => p.Id === policyFund.PolicyId);
        let type = report.PolicyTypes.find(t => t.Id === policy.PolicyTypeId).Name;
        let provider = report.PolicyProviders.find(t => t.Id === policy.PolicyProviderId).Name;
        let fund = report.Funds.find(p => p.Id === policyFund.FundId);
        return {
            id:           policyFund.Id,
            idLabel:      `#${policyFund.Id}`,
            policy:       `${provider} ${policy.ExternalId} (${type})`,
            fund:         fund.Name,
            proportion:   `${policyFund.Proportion * 100}%`,
            includeInFee: policyFund.IncludeInFee ? 'Y' : 'N',
            policyFileId: policy.File?.Uid,
            fundFileId:   fund.File?.Uid,
        };
    });

    return (
        <>
            <Table
                flexibleColumn        = {4}
                columns               = {columns}
                data                  = {policyFunds}
                resource              = {`clients/id/${client.Id}/holdings/policy-funds`}
                label                 = 'Policy Fund'
            />

            <ProportionWarning data={report.PolicyFunds} property='Proportion' />
        </>
    );
}

export default PolicyFundList;
