import React, { useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import {
    Button,
    Toolbar,
} from '@mui/material';
import Day from 'dayjs';

import { Api } from 'State';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Context } from 'State/StateProvider'
import { Download } from 'Components/Widgets/FileHandling/FileDownloader';
import Table from '../../../Widgets/Table';

const RiskAssessmentList = () => {
    let history = useHistory();

    const [state, dispatch ] = useContext(Context);
    let {
        ClientContext: client,
    } = state;

    let report = GetReport();

    const deleteRiskAssessment = useCallback(id => async () => {
        if (window.confirm(`Delete assessment?`)) {
            await Api.Clients.RiskAssessments.Delete(client.Id, id);
            await Api.Clients.ClientDetail.Read(dispatch, client.Id);
        }
    }, [ dispatch, client.Id ]);

    const editRiskAssessment = useCallback(id => () => {
        history.push(`/clients/id/${client.Id}/risk-assessments/id/${id}/edit`);
    }, [ history, client.Id ]);

    const downloadFile = useCallback(fileUid => () => {
        Download(fileUid);
    }, []);

    const columns = [
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
        {
            accessor: 'questionnaire',
            Header: 'Questionnaire',
            width: 3,
            Cell: ({ row }) => (
                <button onClick={downloadFile(row.original.questionnaire.Uid)} className='ong-openFileIcon'>
                    {row.original.questionnaire.Filename}
                    <DownloadIcon />
                </button>
            ),
        },
        {
            accessor: 'actions',
            Header: '',
            width: 0.5,
            Cell: ({ row }) => (
                <>
                    <button onClick={editRiskAssessment(row.original.id)} className='ong-openFileIcon'>
                        <EditIcon />
                    </button>
                    <button onClick={deleteRiskAssessment(row.original.id)} className='ong-openFileIcon'>
                        <DeleteIcon />
                    </button>
                </>
            ),
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
            completed:            Day(ra.Completed).format('DD-MM-YYYY'),
            questionnaire:        ra.Questionnaire,
        };
    }).sort((p,q) => (p.completed < q.completed) ? -1 : ((p.completed > q.completed) ? 1 : 0));

    return (
        <div className='ongoing-riskassessmentList'>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${state.ClientContext.Id}/risk-assessments/add` }}><Button>Add assessment</Button></Link>
            </Toolbar>

            <Table columns={columns} data={assessments} />
        </div>
    );
}

export default RiskAssessmentList;
