import React from 'react';
import { useForm } from 'react-hook-form';

import { DateSelector } from 'Components/Library/DateSelector/DateSelector';
import Dialog from 'Components/Library/Dialog/Dialog';
import FileUploader2 from 'Components/Library/FileHandling/FileUploader2';
import { TextInput } from 'Components/Library/FormControls/TextInput';

import { UniqueViolation } from 'Errors';
import { State } from 'Types/Types';

interface FundFormInput {
    Name: string,
    OcfFee: number,
    ExAnteFee: number,
    Modified: string,
    FileUid: string,
}

export const FundDialog = (props: {
    state: State,
    fund: FundFormInput,
    submitLabel: string,
    submitHandler: (fund: FundFormInput) => void,
    error: string,
}) => {
    const { handleSubmit, control } = useForm<FundFormInput>({
        defaultValues: props.fund
    });

    const onSubmit = (fund: FundFormInput) => {
        props.submitHandler({
            ...fund,
            OcfFee: parseFloat(fund.OcfFee as unknown as string),
            ExAnteFee: parseFloat(fund.ExAnteFee as unknown as string),    
        });
    };
    
    let submitRef = React.createRef();

    return (
        <Dialog
            title       = {props.submitLabel + ' Fund'}
            intro       = 'Enter fund details:'
            submitLabel = {props.submitLabel}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            error       = {props.error === UniqueViolation ? 'A fund with this name already exists.' : ''}
            content = {
                <>
                    <TextInput
                        name    = 'Name'
                        label   = 'Name'
                        control = {control}
                        required
                    />

                    <TextInput
                        type    = 'numeric'
                        name    = 'OcfFee'
                        label   = 'OCF Fee'
                        control = {control}
                        required
                    />

                    <TextInput
                        type    = 'numeric'
                        name    = 'ExAnteFee'
                        label   = 'Ex Ante Fee'
                        control = {control}
                        required
                    />

                    <DateSelector
                        name     = 'Modified'
                        label    = 'Modification date (DD/MM/YYYY)'
                        control  = {control}
                        required
                    />

                    <FileUploader2
                        label        = 'Fund file'
                        name         = 'File'
                        control      = {control}
                        submitRef    = {submitRef} />

                    <br />
                </>
            }
        />
    );
};

export default FundDialog;
