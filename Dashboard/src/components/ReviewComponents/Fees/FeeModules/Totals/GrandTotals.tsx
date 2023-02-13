import React from 'react';

import { FormatCurrencyPence, FormatCharge } from 'Utils/Strings';
import { PlatformView } from '../../Model/FeeTypes';
import { Report } from 'Types/ClientResources';
import Table from 'Components/Library/Table/Table';
import Panel from 'Components/Library/Panel/Panel';

const GrandTotals = (props: {
    report: Report,
    view: PlatformView,
    weightedAvgFee: number,
    totalCharges: number,
}) => {
    let columns = [{
        accessor: 'header',
        Header: '',
        width: 0.8,
    }, {
        accessor: 'total',
        Header: '',
        width: 1,
    }];

    let endValues:            any = { header: 'Total invested' + (props.view.Providers.length > 1 ? ' across all platforms' : '') };
    let platformFee:          any = { header: 'Total platform charges' };
    let fundLevelOcf:         any = { header: 'Fund level, OCF' }
    let fundLevelExAnte:      any = { header: 'Fund level, Transactional' }
    let portfolioLevelOcf:    any = { header: 'Portfolio level, OCF' }
    let portfolioLevelExAnte: any = { header: 'Portfolio level, Transactional' }
    let dimFee:               any = { header: 'DIM' }
    let clientFee:            any = { header: 'Advice fee' };
    let totalCharge:          any = { header: 'Total of all charges' }

    let data = [
        endValues,
        platformFee,
        fundLevelOcf,
        fundLevelExAnte,
        portfolioLevelOcf,
        portfolioLevelExAnte,
        dimFee,
        clientFee,
        totalCharge,
    ];

    let charges = props.view.GrandTotals;

    let totalPlatformPercent   = charges.AnnualCharge         / charges.TotalInvested * 100;
    let advicePercent          = charges.AdviceCharge         / charges.TotalInvested * 100;
    let fundOcfPercent         = charges.FundLevelOcf         / charges.TotalInvested * 100;
    let fundExAntePercent      = charges.FundLevelExAnte      / charges.TotalInvested * 100;
    let portfolioOcfPercent    = charges.PortfolioLevelOcf    / charges.TotalInvested * 100;
    let portfolioExAntePercent = charges.PortfolioLevelExAnte / charges.TotalInvested * 100;
    let dimPercent             = charges.DimCharges           / charges.TotalInvested * 100;

    let totalPercent = (
        + totalPlatformPercent
        + advicePercent
        + fundOcfPercent
        + fundExAntePercent
        + portfolioOcfPercent
        + portfolioExAntePercent
        + dimPercent
    );
    
    endValues['total']            = FormatCurrencyPence(charges.TotalInvested);
    platformFee['total']          = FormatCharge(totalPlatformPercent, props.view.TotalPlatformCharge);
    fundLevelOcf['total']         = FormatCharge(fundOcfPercent, charges.FundLevelOcf);
    fundLevelExAnte['total']      = FormatCharge(fundExAntePercent, charges.FundLevelExAnte);
    portfolioLevelOcf['total']    = FormatCharge(portfolioOcfPercent, charges.PortfolioLevelOcf);
    portfolioLevelExAnte['total'] = FormatCharge(portfolioExAntePercent, charges.PortfolioLevelExAnte);
    dimFee['total']               = FormatCharge(dimPercent, charges.DimCharges);
    clientFee['total']            = FormatCharge(advicePercent, charges.AdviceCharge);

    let tc = (
        + props.view.TotalPlatformCharge
        + charges.FundLevelOcf
        + charges.FundLevelExAnte
        + charges.PortfolioLevelOcf
        + charges.PortfolioLevelExAnte
        + charges.DimCharges
        + charges.AdviceCharge
    );

    totalCharge['total']          = <u>{FormatCharge(totalPercent, tc)}</u>;
         // props.view.GrandTotalCharge);

    return (
        <Panel>
            <h3>Grand Totals</h3>
            <Table columns={columns} data={data} renderRowSubComponent={null} />
        </Panel>
    );
}

export default GrandTotals;
