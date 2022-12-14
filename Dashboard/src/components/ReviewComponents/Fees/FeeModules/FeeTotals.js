import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { CurrencyFormatter } from 'Utils/Strings';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import Table from 'Components/Library/Table/Table';
import { Context } from 'State'

const FeeTotals = () => {
    const [state] = useContext(Context);

    let { clientId } = useParams();

    let client = state.Clients.find(c => c.Id === clientId);

    let report = GetReport();

    const columns = [
        {
            accessor: 'policy',
            Header: 'Policy',
            width: 1,
        }, {
            accessor: 'endValue',
            Header: 'End Value',
            width: 1,
        }, {
            accessor: 'advice',
            Header: 'Advice Fee',
            width: 1,
        }, {
            accessor: 'platform',
            Header: 'Platform Fee',
            width: 1,
        }, {
            accessor: 'fundOcf',
            Header: 'Fund-level OCF',
            width: 1,
        }, {
            accessor: 'fundExAnte',
            Header: 'Fund-level Ex Ante',
            width: 1,
        }, {
            accessor: 'portfolioOcf',
            Header: 'Portfolio-level OCF',
            width: 1,
        }, {
            accessor: 'portfolioExAnte',
            Header: 'Portfolio-level Ex Ante',
            width: 1,
        }, {
            accessor: 'dim',
            Header: 'DIM Fee',
            width: 1,
        }, {
            accessor: 'total',
            Header: 'Total',
            width: 1,
        },
    ];

    let rows = report.Policies.map(policy => {
        let feeGBP = CurrencyFormatter.format(client.Fee / 100 * policy.EndValue);
        return {
            id:       policy.Id,
            policy:   policy.ExternalId,
            endValue: CurrencyFormatter.format(policy.EndValue),
            advice:   `${client.Fee}% (${feeGBP})`,
        };
    });

    return (
        <>
            <Table columns={columns} data={rows} />
        </>
    );
}

export default FeeTotals;
