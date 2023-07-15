import { useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Table from 'Components/Library/Table/Table';
// import { ProportionWarning } from 'Components/Library/Warning/ProportionWarning';
import { DownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Api, Context } from 'State';
import { PercentageFormatter } from 'Utils/Strings';

const PortfolioList = () => {
    const [ , dispatch ] = useContext(Context);

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
        width: 200,
        Cell: ({ row }) => (
            <DownloadChip
                title  = {row.original.policy}
                fileId = {row.original.policyFileId}
            />
        ),
    }, {
        id: 'operator',
        header: 'Operator',
        width: 200,
    }, {
        id: 'model',
        header: 'Model',
        width: 200,
        Cell: ({ row }) => (
            <DownloadChip
                title  = {row.original.model}
                fileId = {row.original.modelFileId}
            />
        ),
    }, {
        id: 'proportion',
        header: '% of policy',
        width: 100,
    }, {
        id: 'includeInFee',
        header: 'Include in fee?',
        width: 100,
    }];

    let portfolios = report.Portfolios.map(portfolio => {
        let policy = report.Policies.find(p => p.Id === portfolio.PolicyId);
        let provider = report.PolicyProviders.find(t => t.Id === policy.PolicyProviderId).Name;
        let model = report.Models.find(p => p.Id === portfolio.ModelId);
        let operator = report.Operators.find(o => o.Id === model.OperatorId);
        return {
            id:           portfolio.Id,
            idLabel:      `#${portfolio.Id}`,
            model:        model.Name,
            operator:     operator.Name,
            policy:       `${provider} ${policy.ExternalId}`,
            proportion:   `${PercentageFormatter.format(portfolio.Proportion * 100)}%`,
            includeInFee: portfolio.IncludeInFee ? 'Y' : 'N',
            policyFileId: policy.File?.Uid,
            modelFileId:  model.File?.Uid,
        };
    }).reverse();

    return (
        <Table
            flexibleColumn        = {1}
            columns               = {columns}
            data                  = {portfolios}
            resource              = {`clients/id/${clientId}/holdings/portfolios`}
            label                 = 'Portfolio'
        />
    );
    // <ProportionWarning data={report.Portfolios} property='Proportion' />
}

export default PortfolioList;
