import React, { useCallback, useMemo } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import Day from 'dayjs';

import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';

import './RiskQuestionnaire.css';

const renderRowSubComponent = row => {
    return (
        <div className='ong-notes'
             dangerouslySetInnerHTML={{ __html: row.original.desc }} />
    )
}
  
const RiskQuestionnaire = () => {
    let report = GetReport();

    const downloadFile = useCallback(fileUid => () => {
        Download(fileUid);
    }, []);

    let assessments = useMemo(() => report.RiskAssessments.map(ra => {
        let level = report.RiskLevels.find(l => l.Id === ra.RiskLevelId);
        let provider = report.RiskProviders.find(t => t.Id === level.RiskProviderId);
        return {
            id:                   ra.Id,
            provider:             provider.Name,
            // level:                level.Level,
            label:                level.Label,
            desc:                 level.Desc,
            completed:            Day(ra.Completed).utc(false).format('DD-MM-YYYY'),
            questionnaire:        ra.File,
        };
    }).sort((p,q) => (p.completed < q.completed) ? -1 : ((p.completed > q.completed) ? 1 : 0)), [
        report.RiskAssessments,
        report.RiskLevels,
        report.RiskProviders,
    ]);
    
    let columns = useMemo(() => [
        {
            accessor: 'provider',
            Header: 'Provider',
            width: 1,
        },
        {
            accessor: 'label',
            Header: 'Label',
            width: 1.5,
        },
        {
            accessor: 'completed',
            Header: 'Completed',
            width: 1,
        },
        (assessments.length && assessments[0].questionnaire.Uid) ?
            {
                accessor: 'questionnaire',
                Header: 'Questionnaire',
                width: 2,
                Cell: ({ row }) => row.original.questionnaire.Uid ? (
                    <button onClick={downloadFile(row.original.questionnaire.Uid)} className='ong-openFileIcon'>
                        {row.original.questionnaire.Filename}
                        <DownloadIcon />
                    </button>
                ) : null,
        } : null,
        {
            accessor: 'desc',
            Header: 'Description',
            width: 5,
            Cell: ({ row }) => {
                if (!row.original.desc) {
                    return null;
                }
                let text = row.original.desc.substring(0, 200);
                text = text.substring(0, text.lastIndexOf(' ')) + '...';
                text += '<button>';
                text += row.isExpanded ? 'Collapse' : 'Expand';
                text += '</button>';
                return (
                    <div className                = 'ong-notes'
                         dangerouslySetInnerHTML = {{ __html: text }}
                         {...row.getToggleRowExpandedProps()} />
                );
            },
        },
    ].filter(c => c), [
        assessments, downloadFile
    ]);

    let columnsMemo = useMemo(() => columns, [ columns ]);

    return (
        <div className='ongoing-riskassessmentList'>
            <br />
            <Table columns               = {columnsMemo}
                   data                  = {assessments}
                   renderRowSubComponent = {renderRowSubComponent} />
        </div>
    );
}

export default RiskQuestionnaire;
