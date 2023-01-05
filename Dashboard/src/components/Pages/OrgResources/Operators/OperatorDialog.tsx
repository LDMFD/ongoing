import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    DialogContent,
    DialogContentText,
} from '@mui/material';

import { State } from 'Types/Types';
import { TextInput } from 'Components/Library/FormControls/TextInput';
import Dialog from 'Components/Library/Dialog/Dialog';

import { OPERATOR_TYPES } from './OperatorTypes';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';
import { Operator } from 'Types/OrgResources';

interface OperatorFormInput {
    Name: string,
    Type: string,
    Fee: string,
}

export const OperatorDialog = (props: {
    state: State,
    operator: OperatorFormInput,
    submitLabel: string,
    submitHandler: (operator: Operator) => void,
}) => {
    const { handleSubmit, control } = useForm<OperatorFormInput>({
        defaultValues: props.operator
    });

    const onSubmit = (operator: OperatorFormInput) => {
        props.submitHandler({
            ...operator,
            Fee: parseFloat(operator.Fee),
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
            submitLabel = {props.submitLabel}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            content = {
                <DialogContent>
                    <DialogContentText>
                        Enter model operator details:
                    </DialogContentText>

                    <Box>
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
                    </Box>

                </DialogContent>
            }
        />
    );
}

                    //                autoFocus fullWidth />

export default OperatorDialog;
