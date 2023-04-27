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

import { PolicyGroup } from 'Types/OrgResources';

interface PolicyGroupFormInput {
    Name: string,
}

export const PolicyGroupDialog = (props: {
    state: State,
    policyGroup: PolicyGroupFormInput,
    submitLabel: string,
    submitHandler: (policyGroup: PolicyGroup) => void,
}) => {
    const { handleSubmit, control } = useForm<PolicyGroupFormInput>({
        defaultValues: props.policyGroup
    });

    const onSubmit = (policyGroup: PolicyGroupFormInput) => {
        props.submitHandler({
            ...policyGroup,
            Name: policyGroup.Name,
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

export default PolicyGroupDialog;
