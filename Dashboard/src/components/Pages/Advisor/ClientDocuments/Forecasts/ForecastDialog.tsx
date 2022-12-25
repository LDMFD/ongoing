import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    DialogContent,
    DialogContentText,
} from '@mui/material';

import FileUploader from 'Components/Library/FileHandling/FileUploader';

import Dialog from 'Components/Library/Dialog/Dialog';
import { File, State } from 'Types/Types';

import './ForecastDialog.css';
import { DateSelector2 } from 'Components/Library/DateSelector/DateSelector';

interface ForecastForm {
    File: File,
    Submitted: string,
}

const ForecastDialog = (props: {
    state: State,
    forecast: ForecastForm,
    submitLabel: string,
    submitHandler: (policy: ForecastForm) => void,
}) => {
    const { handleSubmit, control } = useForm<ForecastForm>({
        defaultValues: props.forecast },
    );

    const onSubmit = (forecast: ForecastForm) => {
        props.submitHandler(forecast);
    };

    // let dialogRef = React.createRef();
    let submitRef = React.createRef();

    return (
        <div className   = 'forecost-dialog'>
            <Dialog
                title       = {`${props.submitLabel} Forecast`}
                submitLabel = {props.submitLabel}
                // ref         = {dialogRef}
                submitRef   = {submitRef}
                onSubmit    = {handleSubmit(onSubmit)}
                content = {
                    <DialogContent>
                        <DialogContentText>
                            Upload forecast document:
                        </DialogContentText>

                        <Box>
                            <DateSelector2
                                name      = 'Submitted'
                                label     = 'Submit date'
                                control   = {control}
                                // dialogRef = {dialogRef}
                                required
                            />

                            <FileUploader
                                label        = 'Forecast file'
                                name         = 'File'
                                control      = {control}
                                submitRef    = {submitRef}
                                required
                            />
                        </Box>

                    </DialogContent>
                }
            />
        </div>
    );
}

export default ForecastDialog;
