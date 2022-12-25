import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    DialogContent,
    DialogContentText,
} from '@mui/material';

import FileUploader2 from 'Components/Library/FileHandling/FileUploader2';

import Dialog from 'Components/Library/Dialog/Dialog';
import { File, State } from 'Types/Types';

import './FeesReportDialog.css';
import { DateSelector2 } from 'Components/Library/DateSelector/DateSelector';

interface FeesReportForm {
    File: File,
    Submitted: string,
}

const FeesReportDialog = (props: {
    state: State,
    feesReport: FeesReportForm,
    submitLabel: string,
    submitHandler: (policy: FeesReportForm) => void,
}) => {
    const { handleSubmit, control } = useForm<FeesReportForm>({
        defaultValues: props.feesReport },
    );

    const onSubmit = (feesReport: FeesReportForm) => {
        props.submitHandler(feesReport);
    };

    let submitRef = React.createRef();

    return (
        <div className   = 'feesreport-dialog'>
            <Dialog
                title       = {`${props.submitLabel} Fees Report`}
                submitLabel = {props.submitLabel}
                submitRef   = {submitRef}
                onSubmit    = {handleSubmit(onSubmit)}
                content = {
                    <DialogContent>
                        <DialogContentText>
                            Upload fees report document:
                        </DialogContentText>

                        <Box>
                            <DateSelector2
                                name     = 'Submitted'
                                label    = 'Submit date'
                                control  = {control}
                                required
                            />

                            <FileUploader2
                                label        = 'Fees report file'
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

export default FeesReportDialog;
