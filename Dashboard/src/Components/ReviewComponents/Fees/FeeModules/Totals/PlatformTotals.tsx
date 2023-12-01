
import Table, { ColumnType, Row } from 'Components/Library/Table/Table';
import { Report } from 'Types/ClientResources';
import { FormatCharge, FormatCurrencyPence } from 'Utils/Strings';
import { PlatformView, ProviderBlockView } from '../../Model/FeeTypes';

const PlatformTotals = (props: {
    report: Report,
    view: PlatformView,
}) => {
    let columns: ColumnType[] = props.view.Providers.map((prov: ProviderBlockView) => {
        return {
            id: prov.Id || '',
            header: prov.Provider!.Name,
            width: 200,
        };
    });
    columns.unshift({
        id: 'header',
        header: '',
        width: 200,
        // @ts-ignore as other rows don't have this property
        cell: ({ row }: { row: Row }) => (
            row.original.header
        ),
    });

    let endValues:                      any = { header: <b>Total invested on this platform</b> };
    let policyFeePercents:              any = { header: 'Total platform charges' };
    let fundLevelOcfs:                  any = { header: 'Fund level, OCF' }
    let fundLevelExAntes:               any = { header: 'Fund level, Transactional' }
    let portfolioLevelOcfs:             any = { header: 'Portfolio level, OCF' }
    let portfolioLevelExAntes:          any = { header: 'Portfolio level, Transactional' }
    let dims:                           any = { header: 'DIM charges' }
    let clientFees:                     any = { header: 'Total advice fees' };
    let totalCharges:                   any = { header: <b>Total of all charges on this platform</b> }

    let data = [
        endValues,
        policyFeePercents,
        fundLevelOcfs,
        fundLevelExAntes,
        portfolioLevelOcfs,
        portfolioLevelExAntes,
        dims,
        clientFees,
        totalCharges,
    ];

    props.view.Providers.forEach((prov: ProviderBlockView) => {
        let charges = props.view.ProviderTotals.get(prov.Id!)!;

        let advicePercent          = charges.AdviceCharge         / charges.TotalInvested * 100;
        let fundOcfPercent         = charges.FundLevelOcf         / charges.TotalInvested * 100;
        let fundExAntePercent      = charges.FundLevelExAnte      / charges.TotalInvested * 100;
        let portfolioOcfPercent    = charges.PortfolioLevelOcf    / charges.TotalInvested * 100;
        let portfolioExAntePercent = charges.PortfolioLevelExAnte / charges.TotalInvested * 100;
        let dimPercent             = charges.DimCharges           / charges.TotalInvested * 100;

        let totalPercent = (
            + prov.PlatformFeePercent
            + advicePercent
            + fundOcfPercent
            + fundExAntePercent
            + portfolioOcfPercent
            + portfolioExAntePercent
            + dimPercent
        )
        
        
        endValues[prov.Id!]             = FormatCurrencyPence(charges.TotalInvested);
        policyFeePercents[prov.Id!]     = FormatCharge(prov.PlatformFeePercent, charges.AnnualCharge);
        fundLevelOcfs[prov.Id!]         = FormatCharge(fundOcfPercent, charges.FundLevelOcf);
        fundLevelExAntes[prov.Id!]      = FormatCharge(fundExAntePercent, charges.FundLevelExAnte);
        portfolioLevelOcfs[prov.Id!]    = FormatCharge(portfolioOcfPercent, charges.PortfolioLevelOcf);
        portfolioLevelExAntes[prov.Id!] = FormatCharge(portfolioExAntePercent, charges.PortfolioLevelExAnte);
        dims[prov.Id!]                  = FormatCharge(dimPercent, charges.DimCharges);
        clientFees[prov.Id!]            = FormatCharge(advicePercent, charges.AdviceCharge);
        totalCharges[prov.Id!]          = <b>{FormatCharge(totalPercent, charges.TotalCharge)}</b>;
    });

    return (
        <Table
            label            = {'Platform Totals'}
            columns          = {columns}
            data             = {data}
            enableRowActions = {false}
        />
    );
};

export default PlatformTotals;
