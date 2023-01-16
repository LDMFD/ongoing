import React, {  } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    DialogContent,
    DialogContentText,
} from '@mui/material';

import { State } from 'Types/Types';
import { TextInput } from 'Components/Library/FormControls/TextInput';
import Dialog from 'Components/Library/Dialog/Dialog';

import { PolicyType } from 'Types/OrgResources';

interface PolicyTypeFormInput {
    Name: string,
}

export const PolicyTypeDialog = (props: {
    state: State,
    policyType: PolicyTypeFormInput,
    submitLabel: string,
    submitHandler: (policyType: PolicyType) => void,
}) => {
    const { handleSubmit, control } = useForm<PolicyTypeFormInput>({
        defaultValues: props.policyType
    });

    const onSubmit = (policyType: PolicyTypeFormInput) => {
        props.submitHandler({
            ...policyType,
            Name: policyType.Name,
        });
    };
    
    let submitRef = React.createRef();

    return (
        <Dialog
            title       = {props.submitLabel + ' Policy Type'}
            submitLabel = {props.submitLabel}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            content = {
                <DialogContent>
                    <DialogContentText>
                            Enter policy type
                    </DialogContentText>

                    <Box>
                        <TextInput
                            name='Name'
                            label='Name'
                            control={control}
                            required
                        />
                    </Box>
                </DialogContent>
            }
        />
    );
};

export default PolicyTypeDialog;
