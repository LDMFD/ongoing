import React from 'react';
import PropTypes from 'prop-types';
import Table from 'Components/Library/Table/Table';
import { CurrencyFormatter, CurrencyFormatterPence } from 'Utils/Strings';
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
                {CurrencyFormatter.format(row.original.Boundary)}
                {row.original.UpperBoundary === Number.MAX_VALUE
                    ? '+'
                    : ` - ${CurrencyFormatter.format(row.original.UpperBoundary)}`}
            </>
        ),
    }, {
        accessor: 'Amount',
        Header: 'Amount',
        Cell: ({ row }: { row: Row }) => CurrencyFormatter.format(row.original.Amount),
    }, {
        accessor: 'Charge',
        Header: 'Discounted charge',
        Cell: ({ row }: { row: Row }) => `${(row.original.Charge)}%`,
    }, {
        accessor: 'MoneyCharge',
        Header: 'Money Charge',
        Cell: ({ row }: { row: Row }) => CurrencyFormatterPence.format(row.original.MoneyCharge),
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
