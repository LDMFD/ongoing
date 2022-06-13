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
import FileUploader from 'Components/Library/FileHandling/FileUploader';

export const FactFindDialog = ({ factFind, setFactFind, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetSubmitted: (event) => { setFactFind({ ...factFind, Submitted: event.target.value, }); },
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Fact Find</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Upload Fact Find document
                    </DialogContentText>

                    <TextField value    = {Day(factFind.Submitted).utc(false).format('DD-MM-YYYY')}
                               onChange = {handlers.SetSubmitted}
                               margin   = "dense"
                               id       = "submitted"
                               label    = "Submitted"
                               type     = "date"
                               fullWidth />

                    <FileUploader file         = {factFind.File}
                                  stateUpdater = {setFactFind}
                                  state        = {factFind} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' onClick={submitHandler}>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default FactFindDialog;
