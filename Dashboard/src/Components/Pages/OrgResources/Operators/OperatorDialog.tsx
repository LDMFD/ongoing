import React from 'react';
import { useForm } from 'react-hook-form';

import Dialog from 'Components/Library/Dialog/Dialog';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';
import { TextInput } from 'Components/Library/FormControls/TextInput';
import { UniqueViolation } from 'Errors';
import { State } from 'Types/Types';
import { OPERATOR_TYPES } from './OperatorTypes';

interface OperatorFormInput {
    Name: string,
    Type: string,
    Fee: string | number,
}

export const OperatorDialog = (props: {
    state: State,
    operator: OperatorFormInput,
    submitLabel: string,
    submitHandler: (operator: OperatorFormInput) => void,
    error: string,
}) => {
    const { handleSubmit, control } = useForm<OperatorFormInput>({
        defaultValues: props.operator
    });

    const onSubmit = (operator: OperatorFormInput) => {
        props.submitHandler({
            ...operator,
            Fee: parseFloat(operator.Fee as string) as number,
        });
    };

    let types = Object.entries(OPERATOR_TYPES).map(([ id, label ]) => ({
        Id: id,
        Name: label,
    }));

    let submitRef = React.createRef();

    return (
        <Dialog
            title       = {props.submitLabel + ' Model Operator'}
            intro       = 'Enter model operator details:'
            submitLabel = {props.submitLabel}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            error       = {props.error === UniqueViolation ?
                'An operator with this name already exists.' : ''}
        content = {
                <>
                    <TextInput
                        name='Name'
                        label='Name'
                        control={control}
                        required
                    />

                    <SelectControl
                        name='Type'
                        options={types}
                        label='Type'
                        control={control}
                        required
                    />

                    <TextInput
                        type='numeric'
                        name='Fee'
                        label='Fee (%)'
                        control={control}
                        required
                    />
                </>
            }
        />
    );
}

                    //                autoFocus fullWidth />

export default OperatorDialog;
