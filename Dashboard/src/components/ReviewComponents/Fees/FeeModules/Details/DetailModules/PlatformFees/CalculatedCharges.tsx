import React from 'react';
import PropTypes from 'prop-types';
import Table from 'Components/Library/Table/Table';
import { FormatCurrency, FormatCurrencyPence } from 'Utils/Strings';
import { ProviderCharge } from 'Types/OrgResources';

export type Row = {
    original: any,
}

const CalculatedChargesTable = (props: {
    charges: ProviderCharge[],
}) => {
    let columns = [{
        accessor: 'Boundary',
        Header: 'Tier',
        Cell: ({ row }: { row: Row }) => (
            <>  
                {FormatCurrencyPence(row.original.Boundary)}
                {row.original.UpperBoundary === Number.MAX_VALUE
                    ? '+'
                    : ` - ${FormatCurrencyPence(row.original.UpperBoundary)}`}
            </>
        ),
    }, {
        accessor: 'Amount',
        Header: 'Amount held in tier',
        Cell: ({ row }: { row: Row }) => FormatCurrencyPence(row.original.Amount),
    }, {
        accessor: 'Charge',
        Header: 'Charge (%)',
        Cell: ({ row }: { row: Row }) => `${(row.original.Charge)}%`,
    }, {
        accessor: 'MoneyCharge',
        Header: 'Charge (£)',
        Cell: ({ row }: { row: Row }) => FormatCurrencyPence(row.original.MoneyCharge),
    }];


    return (
        <>
            <Table columns={columns} data={props.charges} renderRowSubComponent={null} />
        </>
    );
}

export const ProviderChargesPropType = PropTypes.arrayOf(PropTypes.shape({
    Amount: PropTypes.number,
    Boundary: PropTypes.number,
    UpperBoundary: PropTypes.number,
    Charge: PropTypes.number,
    MoneyCharge: PropTypes.number,
}));

CalculatedChargesTable.propTypes = {
    charges: ProviderChargesPropType,
}

export default CalculatedChargesTable;
