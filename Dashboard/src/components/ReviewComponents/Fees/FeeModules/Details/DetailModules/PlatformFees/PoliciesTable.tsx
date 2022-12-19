import PropTypes from 'prop-types';
import Table from 'Components/Library/Table/Table';
import { CurrencyFormatter, CurrencyFormatterPence } from 'Utils/Strings';
import { ProviderChargesPropType, Row } from './CalculatedCharges';
import { Policy } from 'Types/Types';

const PoliciesTable = (params: {
    policies: Policy[],
    providerTotal: number,
    totalMoneyCharge: number,
}) => {
    let columns = [{
        accessor: 'ExternalId',
        Header: 'Policy number',
    }, {
        accessor: 'EndValue',
        Header: 'End value',
    }, {
        accessor: 'Percentage',
        Header: 'Percentage of portfolio'
    }, {
        accessor: 'PlatformFee',
        Header: 'Platform Fee',
        Cell: ({ row }: { row: Row }) => CurrencyFormatterPence.format(row.original.PlatformFee),
    }];

    // let charges = CalculatePlatformCharges(params.charges, params.total);
    
    let data = params.policies.map(p => ({    // CalculatePlatformFees(params.policies, params.total).map(p => ({
        ...p,
        EndValue: CurrencyFormatter.format(p.EndValue),
        Percentage: `${(p.EndValue / params.providerTotal * 100).toPrecision(4)}%`,
        PlatformFee: params.totalMoneyCharge, //charges.map(p => p.MoneyCharge).reduce((p, q) => p + q, 0),
    }));

    return (
        <Table columns={columns} data={data} renderRowSubComponent={null} />
    );
}

const FilePropType = PropTypes.shape({
    Uid: PropTypes.string,
    Filename: PropTypes.string,
    Size: PropTypes.number,
});

const PoliciesPropType = PropTypes.arrayOf(PropTypes.shape({
    EndValue: PropTypes.number,
    ExternalId: PropTypes.string,
    File: FilePropType,
    Id: PropTypes.string,
    MonthlyContributions: PropTypes.number,
    Notes: PropTypes.string,
    PolicyProviderId: PropTypes.string,
    PolicyTypeId: PropTypes.string,
    StartValue: PropTypes.number,
}));

PoliciesTable.propTypes = {
    policies: PoliciesPropType,
    charges: ProviderChargesPropType,
}

export default PoliciesTable;
