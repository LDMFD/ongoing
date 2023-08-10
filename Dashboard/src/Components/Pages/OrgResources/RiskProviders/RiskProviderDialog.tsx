import React from 'react';
import { useForm } from 'react-hook-form';

import Dialog from 'Components/Library/Dialog/Dialog';
import { TextInput } from 'Components/Library/FormControls/TextInput';
import { State } from 'Types/Types';

import { UniqueViolation } from 'Errors';

interface RiskProviderFormInput {
    Name: string,
}

export const RiskProviderDialog = (props: {
    state: State,
    riskProvider: RiskProviderFormInput,
    submitLabel: string,
    submitHandler: (riskProvider: RiskProviderFormInput) => void,
    error: string,
}) => {
    const { handleSubmit, control } = useForm<RiskProviderFormInput>({
        defaultValues: props.riskProvider,
    });
    
    const onSubmit = (riskProvider: RiskProviderFormInput) => {
        props.submitHandler({
            ...riskProvider,
            Name: riskProvider.Name,
        });
    };
    
    let submitRef = React.createRef();

    return (
        <Dialog
            title       = {props.submitLabel + ' Risk Provider'}
            intro       = 'Enter risk provider name:'
            submitLabel = {props.submitLabel}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            error       = {props.error === UniqueViolation ? 'This risk provider already exists.' : ''}
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

export default RiskProviderDialog;
