
import { DownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import Panel from 'Components/Library/Panel/Panel';
import Table, { Row } from 'Components/Library/Table/Table';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { CalculatePlatformModel } from 'Components/ReviewComponents/Fees/Model/FeeModel';
import { PolicyPortfolioFees, PortfolioFee, ProviderBlockView } from 'Components/ReviewComponents/Fees/Model/FeeTypes';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { ModuleTypePortfolioLevelFees } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import { Policy, Report } from 'Types/ClientResources';
import { FormatCurrencyPence, FormatPercent } from 'Utils/Strings';

interface PortfolioFeeRow {
    id?: string,
    Model: string | JSX.Element,
    ChargeOcf: string | JSX.Element,
    ChargeExAnte: string | JSX.Element,
    Percentage?: string,
    Include: boolean,
    WeightedFee?: string,
}

const PolicyBlock = (props: {
    report: Report
    policy: Policy
    fees: PolicyPortfolioFees
}) => {
    const columns = [
        {
            id: 'Model',
            header: 'Model',
            Cell: ({ row }: { row: Row }) => row.original.FileId ? (
                <DownloadChip
                    title  = {row.original.Model}
                    fileId = {row.original.FileId}
                />
            ) : row.original.Model,
            }, {
            id: 'ChargeOcf',
            header: 'OCF Fee (%)',
        }, {
            id: 'ChargeExAnte',
            header: 'Transactional fee (%)',
        }, {
            id: 'Percentage',
            header: 'Percentage of policy',
        }, {
            id: 'Include',
            header: 'Include in total?',
            width: 1,
            Cell: ({ row }: { row: Row }) => (
                (row.original.id !== 'avg' && row.original.id !== 'charges') ? 
                    row.original.Include ? 'Y' : 'N'
                : ''
            ),
        // }, {
        //     id: 'WeightedOcf',
        //     header: 'Weighted OCF (%)',
        //     width: 1,
        // }, {
        //     id: 'WeightedExAnte',
        //     header: 'Weighted Transactional (%)',
        //     width: 1,
        },
    ];

    let rows: PortfolioFeeRow[] = props.fees.PortfolioFees.map((p: PortfolioFee) => ({
        id: p.Id,
        ...p,
        Model: p.Model.Name,
        FileId: p.Model.File?.Uid,
        ChargeOcf: FormatPercent(p.ChargeOcf),
        ChargeExAnte: FormatPercent(p.ChargeExAnte),
        WeightedOcf: FormatPercent(p.WeightedOcf),
        WeightedExAnte: FormatPercent(p.WeightedExAnte),
        Percentage: FormatPercent(p.Percentage),
        Include: p.IncludeInFee,
    }));

    rows.push({
        id: 'avg',
        Model: <i>Weighted average</i>,
        ChargeOcf:<i>{FormatPercent(props.fees.WeightedAvgOcf)}</i>,
        ChargeExAnte:<i>{FormatPercent(props.fees.WeightedAvgExAnte)}</i>,
        Include: false,
    });
    rows.push({
        id: 'charges',
        Model: <b><i>Estimated charge</i></b>,
        ChargeOcf: <b><i>{FormatCurrencyPence(props.fees.ChargeOcf)}</i></b>,
        ChargeExAnte: <b><i>{FormatCurrencyPence(props.fees.ChargeExAnte)}</i></b>,
        Include: false,
    });

    return (
       <Panel>
            <Table
                label            = {`Portfolio ${props.policy.ExternalId} (value at end of period: ${FormatCurrencyPence(props.policy.EndValue)})`}
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
    let fees: Map<string, PolicyPortfolioFees> = props.block.Fees.PortfolioFees;
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

const PortfolioLevelFees = () => {
    let report = GetReport();

    let view = CalculatePlatformModel(report);

    return (
        <>
            <Module module={ModuleTypePortfolioLevelFees} client={null} />

            {view.Providers.map((b: ProviderBlockView, ix: number) => (
                <ProviderBlock key={ix} block={b} total={view.Total} />
            ))}
        </>
    );
}

export default PortfolioLevelFees;
