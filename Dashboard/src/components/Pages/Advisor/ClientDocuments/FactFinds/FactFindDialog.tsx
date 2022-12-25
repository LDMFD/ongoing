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

import './FactFindDialog.css';
import { DateSelector2 } from 'Components/Library/DateSelector/DateSelector';

interface FactFindForm {
    File: File,
    Submitted: string,
}

const FactFindDialog = (props: {
    state: State,
    factFind: FactFindForm,
    submitLabel: string,
    submitHandler: (policy: FactFindForm) => void,
}) => {
    const { handleSubmit, control } = useForm<FactFindForm>({
        defaultValues: props.factFind },
    );

    const onSubmit = (factFind: FactFindForm) => {
        props.submitHandler(factFind);
    };

    let submitRef = React.createRef();

    return (
        <div className   = 'factfind-dialog'>
            <Dialog
                title       = {`${props.submitLabel} Fact Find`}
                submitLabel = {props.submitLabel}
                submitRef   = {submitRef}
                onSubmit    = {handleSubmit(onSubmit)}
                content = {
                    <DialogContent>
                        <DialogContentText>
                            Upload fact find document:
                        </DialogContentText>

                        <Box>
                            <DateSelector2
                                name     = 'Submitted'
                                label    = 'Submit date'
                                control  = {control}
                                required
                            />

                            <FileUploader
                                label        = 'Fact find file'
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

export default FactFindDialog;
