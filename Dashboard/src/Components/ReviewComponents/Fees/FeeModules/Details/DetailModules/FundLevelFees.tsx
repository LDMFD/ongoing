
import { DownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import Panel from 'Components/Library/Panel/Panel';
import Table, { Row } from 'Components/Library/Table/Table';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { CalculatePlatformModel } from 'Components/ReviewComponents/Fees/Model/FeeModel';
import { FundFee, PolicyFundFees, ProviderBlockView } from 'Components/ReviewComponents/Fees/Model/FeeTypes';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { ModuleTypeFundLevelFees } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import { Policy, Report } from 'Types/ClientResources';
import { FormatCurrencyPence, FormatPercent } from 'Utils/Strings';

interface FundFeeRow {
    id?: string,
    Fund: string | JSX.Element,
    ChargeOcf: string | JSX.Element,
    ChargeExAnte: string | JSX.Element,
    Percentage?: string,
    Include: boolean,
    WeightedFee?: string,
}

const PolicyBlock = (props: {
    report: Report
    policy: Policy
    fees: PolicyFundFees
}) => {
    const columns = [{
        id: 'Fund',
        header: 'Fund name',
        Cell: ({ row }: { row: Row }) => row.original.FileId ? (
            <DownloadChip
                title  = {row.original.Fund}
                fileId = {row.original.FileId}
            />
        ) : row.original.Fund,
    },
    {
        id: 'ChargeOcf',
        header: 'OCF (%)',
    },
    {
        id: 'ChargeExAnte',
        header: 'Transactional fee (%)',
    },
    {
        id: 'Percentage',
        header: 'Percentage of policy',
    }, {
        id: 'Include',
        header: 'Include in total?',
        Cell: ({ row }: { row: Row }) => (
            (row.original.id !== 'avg' && row.original.id !== 'charges') ? 
                row.original.Include ? 'Y' : 'N'
            : ''
        ),
        //     id: 'WeightedOcf',
        //     header: 'Weighted OCF (%)',
        // }, {
        //     id: 'WeightedExAnte',
        //     header: 'Weighted Transactional (%)',
        },
    ];

    let rows: FundFeeRow[] = props.fees.FundFees.map((p: FundFee) => ({
        id: p.Id,
        ...p,
        Fund: p.Fund.Name,
        FileId: p.Fund.File?.Uid,
        ChargeOcf: FormatPercent(p.ChargeOcf),
        ChargeExAnte: FormatPercent(p.ChargeExAnte),
        WeightedOcf: FormatPercent(p.WeightedOcf),
        WeightedExAnte: FormatPercent(p.WeightedExAnte),
        Percentage: FormatPercent(p.Percentage),
        Include: p.IncludeInFee,
    }));

    rows.push({
        id: 'avg',
        Fund: <i>Weighted average</i>,
        ChargeOcf:<i>{FormatPercent(props.fees.WeightedAvgOcf)}</i>,
        ChargeExAnte:<i>{FormatPercent(props.fees.WeightedAvgExAnte)}</i>,
        Include: false,
    });
    rows.push({
        id: 'charges',
        Fund: <b><i>Estimated charge</i></b>,
        ChargeOcf: <b><i>{FormatCurrencyPence(props.fees.ChargeOcf)}</i></b>,
        ChargeExAnte: <b><i>{FormatCurrencyPence(props.fees.ChargeExAnte)}</i></b>,
        Include: false,
    });

    return (
        <Panel>
            <h4>Policy: {props.policy.ExternalId}</h4>
            <p>
                Value at end of period: {FormatCurrencyPence(props.policy.EndValue)}
            </p>
 
            <Table
                label            = 'Fund level fees'
                columns          = {columns}
                data             = {rows}
                enableRowActions = {false}
            />

            {/* <ProportionWarning data={rows} property='Percentage' /> */}
         </Panel>
     );
 }

 const ProviderBlock = (props: {
    block: ProviderBlockView,
    total: number,
    key: number,
}) => {
    let fees: Map<string, PolicyFundFees> = props.block.Fees.FundFees;
    let report = GetReport();
    let ix = 0;
    return (
        <Panel>
            <h3>
                Platform: {props.block.Provider.Name}
            </h3>

            {[...Array.from(fees.keys())].map(policy => (
                <PolicyBlock
                    key    = {ix++}
                    report = {report}
                    policy = {report.Policies.find((p: Policy) => p.Id === policy)}
                    fees   = {fees.get(policy)!} />
            ))}
        </Panel>
    );
};

const FundLevelFees = () => {
    let report = GetReport();

    let view = CalculatePlatformModel(report);

    return (
        <>
            <Module module={ModuleTypeFundLevelFees} client={null} />

            {view.Providers.map((b: ProviderBlockView, ix: number) => (
                <ProviderBlock key={ix} block={b} total={view.Total} />
            ))}
        </>
    );
}

export default FundLevelFees;
