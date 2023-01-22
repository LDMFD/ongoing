import React, {  } from 'react';
import { useForm } from 'react-hook-form';

import { State } from 'Types/Types';
import { TextInput } from 'Components/Library/FormControls/TextInput';
import Dialog from 'Components/Library/Dialog/Dialog';

import { PolicyType } from 'Types/OrgResources';
import { UniqueViolation } from 'Errors';

interface PolicyTypeFormInput {
    Name: string,
}

export const PolicyTypeDialog = (props: {
    state: State,
    policyType: PolicyTypeFormInput,
    submitLabel: string,
    submitHandler: (policyType: PolicyType) => void,
    error: string,
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
            intro       = 'Enter policy type:'
            submitLabel = {props.submitLabel}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            error       = {props.error === UniqueViolation && 'This policy type already exists.'}
            content = {
                <TextInput
                    name    = 'Name'
                    label   = 'Name'
                    control = {control}
                    required
                />
            }
        />
    );
};

export default PolicyTypeDialog;
