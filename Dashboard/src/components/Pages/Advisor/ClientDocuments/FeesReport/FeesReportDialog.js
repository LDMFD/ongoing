import React from 'react';
import { useHistory } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material';
import Day from 'dayjs';

import { GoBack } from 'Utils/Routing';
import FileUploader from 'Components/Widgets/FileHandling/FileUploader';

export const FeesReportDialog = ({ feesReport, setFeesReport, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetSubmitted: (event) => { setFeesReport({ ...feesReport, Submitted: event.target.value, }); },
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Fees Report</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Upload Fees Report document
                    </DialogContentText>

                    <TextField value    = {Day(feesReport.Submitted).format('YYYY-MM-DD')}
                               onChange = {handlers.SetSubmitted}
                               margin   = "dense"
                               id       = "submitted"
                               label    = "Submitted"
                               type     = "date"
                               fullWidth />

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
