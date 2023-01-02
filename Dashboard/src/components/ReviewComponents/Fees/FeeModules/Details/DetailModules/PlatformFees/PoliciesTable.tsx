import PropTypes from 'prop-types';
import Table from 'Components/Library/Table/Table';
import { CurrencyFormatter, CurrencyFormatterPence } from 'Utils/Strings';
import { ProviderChargesPropType, Row } from './CalculatedCharges';
import { Policy } from 'Types/Client';

const PoliciesTable = (props: {
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
        Header: '% of holdings on this platform'
    }, {
        accessor: 'PlatformFee',
        Header: 'Platform Fee',
        Cell: ({ row }: { row: Row }) => CurrencyFormatterPence.format(row.original.PlatformFee),
    }];

    let data = props.policies.map(p => {
        let proportion = p.EndValue / props.providerTotal;
        return {
            ...p,
            EndValue: CurrencyFormatter.format(p.EndValue),
            Percentage: `${(proportion * 100).toPrecision(4)}%`,
            PlatformFee: props.totalMoneyCharge * proportion,
        };
    });

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
