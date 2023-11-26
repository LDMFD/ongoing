import { useParams } from 'react-router-dom';
import { useContext } from 'react';

import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Context } from 'State/StateProvider';
import { BuildDownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';
import PageTitle from 'Components/Library/PageTitle/PageTitle';

const RiskAssessmentList = () => {
    const [ state ] = useContext(Context);

    let { clientId } = useParams();
    let client = state.Clients.find(c => c.Id === clientId);

    let report = GetReport();

    const columns = [{
        id: 'provider',
        header: 'Provider',
    }, {
        id: 'level',
        header: 'Level',
        width: 200,
    }, {
        id: 'label',
        header: 'Label',
        width: 200,
    }, {
        id: 'completed',
        header: 'Completed',
        width: 200,
        type: 'date',
    }];

    let assessments = report.RiskAssessments.map(ra => {
        let level = report.RiskLevels.find(l => l.Id === ra.RiskLevelId);
        let provider = report.RiskProviders.find(t => t.Id === level.RiskProviderId);
        return {
            id:        ra.Id,
            provider:  provider.Name,
            level:     level.Level,
            label:     level.Label,
            desc:      level.Desc,
            completed: ra.Completed,
            fileId:    ra.File?.Uid,
        };
    }).sort((p,q) => (p.completed < q.completed) ? -1 : ((p.completed > q.completed) ? 1 : 0));

    return (
        <>
            <PageTitle title={`Risk assessments | ${client.Identity.Forenames} ${client.Identity.Surname} | Amplifa`} />

            <Table
                flexibleColumn        = {2}
                columns               = {columns}
                data                  = {assessments}
                resource              = {`clients/id/${state.Metadata.Id}/documents/risk-assessments`}
                label                 = 'Risk Assessment'
                defaultActionHeader   = 'Download'
                defaultActionRenderer = {BuildDownloadChip('Assessment')}
                detailId              = 'desc'
                detailRenderer = {({ row }) => (
                    <div
                        className               = 'ong-notes'
                        dangerouslySetInnerHTML = {{ __html: row.original.desc }}
                    />
                )}
            />
        </>
    );
}

export default RiskAssessmentList;
