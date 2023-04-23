import React from 'react';
import { useForm } from 'react-hook-form';

import { State } from 'Types/Types';
import Dialog from 'Components/Library/Dialog/Dialog';
import { TextInput } from 'Components/Library/FormControls/TextInput';
import { RichTextEditor2 } from 'Components/Library/RichTextEditor/RichTextEditor2';
import { UniqueViolation } from 'Errors';

import './Platforms.css';
import { PolicyProvider } from 'Types/OrgResources';

interface PolicyProviderFormInput {
    Name: string,
    Pricing: string,
    CustomPricing: string,
}

export const PolicyProviderDialog = (props: {
    state: State,
    provider: PolicyProvider,
    submitLabel: string,
    submitHandler: (policyProvider: PolicyProviderFormInput) => void,
    error: string,
}) => {
    const { handleSubmit, control } = useForm<PolicyProviderFormInput>({
        defaultValues: props.provider
    });

    const onSubmit = (provider: PolicyProviderFormInput) => {
        props.submitHandler(provider);
    };
    
    let submitRef = React.createRef();

    return (
        <div className="modal">
            <Dialog
                title       = {props.submitLabel + ' Platform'}
                intro       = 'Enter platform details:'
                submitLabel = {props.submitLabel}
                submitRef   = {submitRef}
                onSubmit    = {handleSubmit(onSubmit)}
                error       = {props.error === UniqueViolation ? 'A platform with this name already exists.' : ''}
                fullWidth   = {true}
                content = {
                    <>
                        <TextInput
                            name    = 'Name'
                            label   = 'Name'
                            control = {control}
                            required
                        />

                        <RichTextEditor2
                            name      = 'Pricing'
                            label     = 'Pricing'
                            control   = {control}
                        />
                        <small>Use <code>{'{ table }'}</code> to embed the charges table.</small>
                        <br /><br />

                        <RichTextEditor2
                            name      = 'CustomPricing'
                            label     = 'Custom Pricing'
                            control   = {control}
                        />
                        <small>Use <code>{'{ charge }'}</code> to embed the discount.</small>
                    </>
                }
            />
        </div>
    );
};
        
export default PolicyProviderDialog;
