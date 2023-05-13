import Day from 'dayjs';
import { useMemo } from 'react';

import { BuildDownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import TabContent from 'Components/Library/TabContent/TabContent';
import Table from 'Components/Library/Table/Table';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { ModuleTypeRisk } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';

import './RiskQuestionnaire.css';

const RiskQuestionnaire = () => {
    let report = GetReport();

    let assessments = useMemo(() => report.RiskAssessments.map(ra => {
        let level = report.RiskLevels.find(l => l.Id === ra.RiskLevelId);
        let provider = report.RiskProviders.find(t => t.Id === level.RiskProviderId);
        return {
            id:        ra.Id,
            provider:  provider.Name,
            label:     level.Label,
            desc:      level.Desc,
            completed: Day(ra.Completed).utc(false).format('DD-MM-YYYY'),
            fileId:    ra.File?.Uid,
        };
    }).sort((p,q) => (p.completed < q.completed) ? -1 : ((p.completed > q.completed) ? 1 : 0)), [
        report.RiskAssessments,
        report.RiskLevels,
        report.RiskProviders,
    ]);
    
    let columns = [
        {
            id: 'provider',
            header: 'Provider',
            width: 200,
        },
        {
            id: 'label',
            header: 'Label',
            width: 300,
        },
        {
            id: 'completed',
            header: 'Completed',
            width: 300,
        },
    ];

    return (
        <TabContent>
            <Module module={ModuleTypeRisk} />

            <br />
            <Table
                flexibleColumn        = {2}
                columns               = {columns}
                data                  = {assessments}
                enableRowActions      = {false}
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
        </TabContent>
    );
}

export default RiskQuestionnaire;
