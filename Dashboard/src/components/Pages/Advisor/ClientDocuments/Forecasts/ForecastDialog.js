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

export const ForecastDialog = ({ forecast, setForecast, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetSubmitted: (event) => { setForecast({ ...forecast, Submitted: event.target.value, }); },
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Forecast</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Upload Forecast document
                    </DialogContentText>

                    <TextField value    = {Day(forecast.Submitted).format('YYYY-MM-DD')}
                               onChange = {handlers.SetSubmitted}
                               margin   = "dense"
                               id       = "submitted"
                               label    = "Submitted"
                               type     = "date"
                               fullWidth />

                    <FileUploader file         = {forecast.File}
                                  stateUpdater = {setForecast}
                                  state        = {forecast} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' onClick={submitHandler}>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ForecastDialog;
