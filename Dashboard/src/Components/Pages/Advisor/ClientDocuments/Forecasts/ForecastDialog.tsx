import React from 'react';
import { useForm } from 'react-hook-form';

import FileUploader2 from 'Components/Library/FileHandling/FileUploader2';

import Dialog from 'Components/Library/Dialog/Dialog';
import { File, State } from 'Types/Types';

import './ForecastDialog.css';
import { DateSelector } from 'Components/Library/DateSelector/DateSelector';

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
                intro       = 'Upload forecast document:'
                submitLabel = {props.submitLabel}
                // ref         = {dialogRef}
                submitRef   = {submitRef}
                onSubmit    = {handleSubmit(onSubmit)}
                content = {
                    <>
                        <DateSelector
                            name      = 'Submitted'
                            label     = 'Date'
                            control   = {control}
                            // dialogRef = {dialogRef}
                            required
                        />

                        <FileUploader2
                            label        = 'Forecast file'
                            name         = 'File'
                            control      = {control}
                            submitRef    = {submitRef}
                            required
                        />
                    </>
                }
            />
        </div>
    );
}

export default ForecastDialog;
