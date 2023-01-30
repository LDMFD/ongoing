import React from 'react';
import { useForm } from 'react-hook-form';

import FileUploader2 from 'Components/Library/FileHandling/FileUploader2';

import Dialog from 'Components/Library/Dialog/Dialog';
import { File, State } from 'Types/Types';

import './FactFindDialog.css';
import { DateSelector } from 'Components/Library/DateSelector/DateSelector';

interface FactFindForm {
    File: File,
    Submitted: string,
}

const FactFindDialog = (props: {
    state: State,
    factFind: FactFindForm,
    submitLabel: string,
    submitHandler: (factFind: FactFindForm) => void,
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
                intro       = 'Upload fact find document:'
                submitLabel = {props.submitLabel}
                submitRef   = {submitRef}
                onSubmit    = {handleSubmit(onSubmit)}
                content = {
                    <>
                        <DateSelector
                            name     = 'Submitted'
                            label    = 'Date'
                            control  = {control}
                            required
                        />

                        <FileUploader2
                            label        = 'Fact find file'
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

export default FactFindDialog;
