import React from 'react';
import { useHistory } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import { GoBack } from 'Utils/Routing';
import FileUploader from 'Components/Library/FileHandling/FileUploader';
import { DateSelector } from 'Components/Library/DateSelector/DateSelector';

import './ForecastDialog.css';

export const ForecastDialog = ({ forecast, setForecast, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetSubmitted: (event) => {
            setForecast({
                ...forecast,
                Submitted: event,
            });
        },
    };

    return (
        <Dialog open={true} onClose={goBack} className='forecast-dialog'>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Forecast</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Upload Forecast document
                    </DialogContentText>

                    <DateSelector label    = 'Submit date'
                                  selected = {forecast.Submitted}
                                  onChange = {handlers.SetSubmitted} />

                    <FileUploader label        = 'Forecast file'
                                  stateUpdater = {setForecast}
                                  state        = {forecast} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' disabled={forecast.Uploading}>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ForecastDialog;
