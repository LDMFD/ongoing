import React, { useCallback } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import Day from 'dayjs';

import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';

const RiskQuestionnaire = () => {
    let report = GetReport();

    const downloadFile = useCallback(fileUid => () => {
        Download(fileUid);
    }, []);

    let columns = [
        {
            accessor: 'provider',
            Header: 'Provider',
            width: 1,
        },
        {
            accessor: 'level',
            Header: 'Level',
            width: 1,
        },
        {
            accessor: 'label',
            Header: 'Label',
            width: 1,
        },
        {
            accessor: 'desc',
            Header: 'Description',
            width: 1,
        },
        {
            accessor: 'completed',
            Header: 'Completed',
            width: 1,
        },
    ];

    let assessments = report.RiskAssessments.map(ra => {
        let level = report.RiskLevels.find(l => l.Id === ra.RiskLevelId);
        let provider = report.RiskProviders.find(t => t.Id === level.RiskProviderId);
        return {
            id:                   ra.Id,
            provider:             provider.Name,
            level:                level.Level,
            label:                level.Label,
            desc:                 level.Desc,
            completed:            Day(ra.Completed).utc(false).format('DD-MM-YYYY'),
            questionnaire:        ra.Questionnaire,
        };
    }).sort((p,q) => (p.completed < q.completed) ? -1 : ((p.completed > q.completed) ? 1 : 0));
    
    assessments = assessments.length ? [ assessments[0] ] : [];

    if (assessments.length && assessments[0].questionnaire.Uid) {
        columns.push({
            accessor: 'questionnaire',
            Header: 'Questionnaire',
            width: 3,
            Cell: ({ row }) => row.original.questionnaire.Uid && (
                <button onClick={downloadFile(row.original.questionnaire.Uid)} className='ong-openFileIcon'>
                    {row.original.questionnaire.Filename}
                    <DownloadIcon />
                </button>
            ),
        });
    }

    return (
        <div className='ongoing-riskassessmentList'>
            <br />
            <Table columns={columns} data={assessments} />
        </div>
    );
}

export default RiskQuestionnaire;
