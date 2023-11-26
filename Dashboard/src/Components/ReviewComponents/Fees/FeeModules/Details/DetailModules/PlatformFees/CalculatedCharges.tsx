import React from 'react';
import PropTypes from 'prop-types';
import Table, { Row } from 'Components/Library/Table/Table';
import { FormatCurrencyPence, FormatPercent } from 'Utils/Strings';
import { ProviderCharge } from 'Types/OrgResources';

const CalculatedChargesTable = (props: {
    charges: ProviderCharge[],
}) => {
    let columns = [{
        id: 'Boundary',
        header: 'Tier',
        cell: ({ row }: { row: Row }) => (
            <>  
                {FormatCurrencyPence(row.original.Boundary)}
                {row.original.UpperBoundary === Number.MAX_VALUE
                    ? '+'
                    : ` - ${FormatCurrencyPence(row.original.UpperBoundary)}`}
            </>
        ),
    }, {
        id: 'Amount',
        header: 'Amount held in tier',
        cell: ({ row }: { row: Row }) => (
            FormatCurrencyPence(row.original.Amount)
        ),
    }, {
        id: 'Charge',
        header: 'Charge (%)',
        cell: ({ row }: { row: Row }) => (
            FormatPercent(row.original.Charge)
        ),
    }, {
        id: 'MoneyCharge',
        header: 'Charge (£)',
        cell: ({ row }: { row: Row }) => (
            FormatCurrencyPence(row.original.MoneyCharge)
        ),
    }];

    return (
        <>
            <Table
                label            = 'Calculated charges'
                columns          = {columns}
                data             = {props.charges}
                enableRowActions = {false}
            />
        </>
    );
}

export const ProviderChargesPropType = PropTypes.arrayOf(PropTypes.shape({
    Amount: PropTypes.number,
    Boundary: PropTypes.number,
    UpperBoundary: PropTypes.number,
    MoneyCharge: PropTypes.number,
    Charge: PropTypes.number,
}));

CalculatedChargesTable.propTypes = {
    charges: ProviderChargesPropType,
}

export default CalculatedChargesTable;
