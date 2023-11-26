import PropTypes from 'prop-types';

import { DownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import Table, { Row } from 'Components/Library/Table/Table';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Policy } from 'Types/ClientResources';
import { PolicyProvider, PolicyType } from 'Types/OrgResources';
import { FormatCurrency, FormatCurrencyPence } from 'Utils/Strings';
import { ProviderChargesPropType } from './CalculatedCharges';

const PoliciesTable = (props: {
    policies: Policy[],
    providerTotal: number,
    totalMoneyCharge: number,
}) => {
    let columns = [{
        id:     'policy',
        header: 'Policy number',
        cell: ({ row }: { row: Row }) => row.original.fileId ? (
            <DownloadChip
                title  = {row.original.policy}
                fileId = {row.original.fileId}
            />
        ) : row.original.policy,
    }, {
        id:     'type',
        header: 'Type',
    }, {
        id:     'endValue',
        header: 'End value',
    }, {
        id:     'percentage',
        header: '% of holdings on this platform'
    }, {
        id:     'platformFee',
        header: 'Platform Fee',
        cell:   ({ row }: { row: Row }) => (
            FormatCurrencyPence(row.original.platformFee)
        ),
    }];

    let report = GetReport();

    let data = props.policies.map(policy => {
        let type = report.PolicyTypes.find((pt: PolicyType) => pt.Id === policy.PolicyTypeId).Name;
        let provider = report.PolicyProviders.find((t: PolicyProvider) => t.Id === policy.PolicyProviderId).Name;
        let proportion = policy.EndValue / props.providerTotal;

        return {
            policy:      `${provider} ${policy.ExternalId}`,
            endValue:    FormatCurrency(policy.EndValue),
            type:        type,
            percentage:  `${(proportion * 100).toPrecision(4)}%`,
            platformFee: props.totalMoneyCharge * proportion,
            fileId:      policy.File ? policy.File.Uid : null,
        };
    });

    return (
        <Table
            label            = 'Policies'
            columns          = {columns}
            data             = {data}
            enableRowActions = {false}
        />
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
