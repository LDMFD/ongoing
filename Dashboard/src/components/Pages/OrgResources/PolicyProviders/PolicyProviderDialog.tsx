import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";

import { State } from 'Types/Types';
import Dialog from 'Components/Library/Dialog/Dialog';
import { TextInput } from 'Components/Library/FormControls/TextInput';
import { RichTextEditor2 } from 'Components/Library/RichTextEditor/RichTextEditor2';
import { UniqueViolation } from 'Errors';

import './PolicyProviderDialog.css';

interface PolicyProviderFormInput {
    Name: string,
    Pricing: string,
    CustomPricing: string,
}

export const PolicyProviderDialog = (props: {
    state: State,
    provider: PolicyProviderFormInput,
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
                title       = {props.submitLabel + ' Policy Provider'}
                intro       = 'Enter policy provider details:'
                submitLabel = {props.submitLabel}
                submitRef   = {submitRef}
                onSubmit    = {handleSubmit(onSubmit)}
                error       = {props.error === UniqueViolation && 'A policy provider with this name already exists.'}
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
                            submitRef = {submitRef}
                        />
                        <small>Use <code>{'{ table }'}</code> to embed the charges table.</small>
                        <br /><br />

                        <RichTextEditor2
                            name      = 'CustomPricing'
                            label     = 'Custom Pricing'
                            control   = {control}
                            submitRef = {submitRef}
                        />
                        <small>Use <code>{'{ charge }'}</code> to embed the discount.</small>

                        {props.submitLabel === 'Add' ?
                            <p>Create provider first to edit charges</p>
                        :
                            <p>
                                Switch to <Link to={{ pathname: `/policy-providers/id/${props.provider.Id}/provider-charges` }}>Charges table</Link>.
                            </p>
                        }
                    </>
                }
            />
        </div>
    );
};
        
export default PolicyProviderDialog;
