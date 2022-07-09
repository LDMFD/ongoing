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

import './FactFindDialog.css';

export const FactFindDialog = ({ factFind, setFactFind, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetSubmitDate: (event) => {
            setFactFind({
                ...factFind,
                Submitted: event,
            });
        },
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler} className='factfind-dialog'>
                <DialogTitle>{submitLabel} Fact Find</DialogTitle>
                <DialogContent>

                    <DateSelector label    = 'Submit date'
                                  selected = {factFind.Submitted}
                                  onChange = {handlers.SetSubmitDate} />

                    <FileUploader file         = {factFind.File}
                                  stateUpdater = {setFactFind}
                                  state        = {factFind} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit'>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default FactFindDialog;
