import React from 'react';
import { useForm } from 'react-hook-form';

import FileUploader2 from 'Components/Library/FileHandling/FileUploader2';

import Dialog from 'Components/Library/Dialog/Dialog';
import { File, State } from 'Types/Types';

import './FeesReportDialog.css';
import { DateSelector } from 'Components/Library/DateSelector/DateSelector';

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
                intro       = 'Upload fees report document:'
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
                            label        = 'Fees report file'
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

export default FeesReportDialog;
