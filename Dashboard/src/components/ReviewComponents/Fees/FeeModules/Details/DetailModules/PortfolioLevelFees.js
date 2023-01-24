import React, { useCallback } from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

import { ModuleTypePortfolioLevelFees } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import { FormatCurrencyPence, FormatPercent } from 'Utils/Strings';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';
import { ProportionWarning } from 'Components/Library/Warning/ProportionWarning';
import Panel from 'Components/Library/Panel/Panel';

const PolicyPortfolios = ({ report, policy, portfolios }) => {
    const downloadFile = useCallback(fileUid => () => {
        Download(fileUid);
    }, []);

    const columns = [
        {
            accessor: 'model',
            Header: 'Model',
            width: 1,
        }, {
            accessor: 'ocfFee',
            Header: 'OCF Fee (%)',
            width: 1,
        }, {
            accessor: 'exAnteFee',
            Header: 'Ex Ante Fee (%)',
            width: 1,
        }, {
            accessor: 'proportionStr',
            Header: 'Percentage of policy' ,
            width: 1,
        // }, {
        //     accessor: 'weightedOcfFee',
        //     Header: 'Weighted OCF (%)',
        //     width: 1,
        // }, {
        //     accessor: 'weightedExAnteFee',
        //     Header: 'Weighted Ex Ante (%)',
        //     width: 1,
        }, {
            accessor: 'actions',
            Header: 'Factsheet',
            type: 'actions',
            width: .5,
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

    portfolios = portfolios.filter(p => p.policyId === policy.Id).map(p => ({
        ...p,
        model: p.model.Name,
        fileUid: p.model.File?.Uid,
    }));

    if (!portfolios.length) {
        return null;
    }

    let ocfWeightedAvg    = portfolios.map(p => p.weightedOcfFee).reduce((p, q) => p + q, 0);
    let exAnteWeightedAvg = portfolios.map(p => p.weightedExAnteFee).reduce((p, q) => p + q, 0);

    let ocfPounds    = ocfWeightedAvg    / 100 * policy.EndValue;
    let exAntePounds = exAnteWeightedAvg / 100 * policy.EndValue;

    portfolios.push({
        id: 'avg',
        model: <i>Weighted average</i>,
        ocfFee: <i>{FormatPercent(ocfWeightedAvg)}</i>,
        exAnteFee: <i>{FormatPercent(exAnteWeightedAvg)}</i>,
    });
    portfolios.push({
        id: 'charges',
        model: <i>Estimated charges</i>,
        ocfFee: <i>{FormatCurrencyPence(ocfPounds)}</i>,
        exAnteFee: <i>{FormatCurrencyPence(exAntePounds)}</i>,
    });

    let provider = report.PolicyProviders.find(p => p.Id === policy.PolicyProviderId);

    console.log(portfolios)
    return (
       <Panel>
            <h3>{provider.Name} ({policy.ExternalId})</h3>

            <p>
                Value at end of period: {FormatCurrencyPence(policy.EndValue)} <br />
            </p>

            <Table columns={columns} data={portfolios} />

            <ProportionWarning data={portfolios} property='proportion' />

            {policy.File &&
                <p>
                    Factsheet: {policy.File.Filename}
                    <Button onClick={Download.bind(null, policy.File.Uid)}>Download</Button>
                </p>
            }
        </Panel>
    );
}

const PortfolioLevelFees = () => {
    let report = GetReport();

    let portfolios = report.Portfolios.filter(p => p.IncludeInFee).map(portfolio => {
        let policy = report.Policies.find(p => p.Id === portfolio.PolicyId);
        let model = report.Models.find(m => m.Id === portfolio.ModelId);

        let ocfPercent    = (model.WeightedOcfFee).toPrecision(2);
        let exAntePercent = (model.WeightedExAnteFee).toPrecision(2);

        let ocfSterling    = model.WeightedOcfFee * policy.EndValue / 100;
        let exAnteSterling = model.WeightedExAnteFee * policy.EndValue / 100;

        let ocfStr    = `${ocfPercent}% (${FormatCurrencyPence(ocfSterling)})`;
        let exAnteStr = `${exAntePercent}% (${FormatCurrencyPence(exAnteSterling)})`;

        return {
            id:                portfolio.Id,
            proportion:        portfolio.Proportion * 100,
            proportionStr:     FormatPercent(portfolio.Proportion * 100),
            policyId:          policy.Id,
            endValue:          policy.EndValue,
            model:             model,
            ocfFee:            ocfStr,
            exAnteFee:         exAnteStr,
            ocf:               model.WeightedOcfFee,
            exAnte:            model.WeightedExAnteFee,
            weightedOcfFee:    model.WeightedOcfFee * portfolio.Proportion,
            weightedExAnteFee: model.WeightedExAnteFee * portfolio.Proportion,
        };
    });

    return (
        <>
            <Module module={ModuleTypePortfolioLevelFees} />
            <br />

            {report.Policies.map(p => 
                <PolicyPortfolios report={report}
                                  policy={p}
                                  portfolios={portfolios}
                                  key={p.Id} />
            )}
        </>
    );
}

export default PortfolioLevelFees;
