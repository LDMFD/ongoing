import React from 'react';
import { useForm } from 'react-hook-form';

import { DateSelector } from 'Components/Library/DateSelector/DateSelector';
import Dialog from 'Components/Library/Dialog/Dialog';
import FileUploader2 from 'Components/Library/FileHandling/FileUploader2';
import { Operator } from 'Types/OrgResources';
import { State } from 'Types/Types';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';
import { TextInput } from 'Components/Library/FormControls/TextInput';
import { UniqueViolation } from 'Errors';

interface ModelDialogFormInput {
    Name: string,
    OperatorId: string,
    WeightedOcfFee: number,
    WeightedExAnteFee: number,
    Modified: string,
    FileUid: string,
}

const ModelDialog = (props: {
    state: State,
    model: ModelDialogFormInput,
    submitLabel: string,
    submitHandler: (model: ModelDialogFormInput) => void,
    error: string,
}) => {
    const { handleSubmit, control } = useForm<ModelDialogFormInput>({
        defaultValues: props.model,
    });

    const onSubmit = (model: ModelDialogFormInput) => {
        props.submitHandler({
            ...model,
            WeightedOcfFee: parseFloat(model.WeightedOcfFee as unknown as string),
            WeightedExAnteFee: parseFloat(model.WeightedExAnteFee as unknown as string),    
        });
    };

    let operators = props.state.Resources.Operators.map((t: Operator) => ({
        Id: t.Id,
        Name: t.Name
    }));
    
    let submitRef = React.createRef();

    return (
        <Dialog
            title       = {props.submitLabel + ' Model'}
            intro       = 'Enter model details:'
            submitLabel = {props.submitLabel}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            error       = {props.error === UniqueViolation && 'A model with this name and operator already exists.'}
            content = {
                <>
                    <TextInput
                        name    = 'Name'
                        label   = 'Name'
                        control = {control}
                        required
                    />

                    <SelectControl
                        name    = 'OperatorId'
                        options = {operators}
                        label   = 'Operator'
                        control = {control}
                        required
                    />

                    <TextInput
                        type    = 'numeric'
                        name    = 'WeightedOcfFee'
                        label   = 'Weighted OCF Fee (%)'
                        control = {control}
                        required
                    />

                    <TextInput
                        type    = 'numeric'
                        name    = 'WeightedExAnteFee'
                        label   = 'Weighted Ex Ante Fee (%)'
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
                        label        = 'Model file'
                        name         = 'File'
                        control      = {control}
                        submitRef    = {submitRef} />

                    <br />
                </>
            }
        />
    );
}

export default ModelDialog;
