import React from 'react';
import { useHistory } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

import { GoBack } from 'Utils/Routing';
import FileUploader from 'Components/Library/FileHandling/FileUploader';
import { DateSelector } from 'Components/Library/DateSelector/DateSelector';

import './FeesReportDialog.css';

export const FeesReportDialog = ({ feesReport, setFeesReport, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetSubmitted: (event) => {
            setFeesReport({
                ...feesReport,
                Submitted: event,
            });
        },
    };

    return (
        <Dialog open={true} onClose={goBack} className='feesreport-dialog'>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Fees Report</DialogTitle>
                <DialogContent>
                    
                    <DateSelector label    = 'Submit date'
                                  selected = {feesReport.Submitted}
                                  onChange = {handlers.SetSubmitted} />

                    <FileUploader file         = {feesReport.File}
                                  stateUpdater = {setFeesReport}
                                  state        = {feesReport} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' onClick={submitHandler}>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default FeesReportDialog;
