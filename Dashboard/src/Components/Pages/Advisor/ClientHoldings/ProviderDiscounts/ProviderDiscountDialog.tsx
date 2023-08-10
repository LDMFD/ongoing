import React from 'react';
import { useForm } from 'react-hook-form';

import { TextInput } from 'Components/Library/FormControls/TextInput';

import Dialog from 'Components/Library/Dialog/Dialog';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';
import { UniqueViolation } from 'Errors';
import { ProviderDiscount } from 'Types/OrgResources';
import { State } from 'Types/Types';

interface ProviderDiscountForm {
	PolicyProviderId: string,
	Discount: number,
}

const ProviderDiscountDialog = (props: {
    state: State,
    providerDiscount: ProviderDiscount,
    submitLabel: string,
    submitHandler: (providerDiscount: ProviderDiscountForm) => void,
    error: string,
}) => {
    const { handleSubmit, control } = useForm<ProviderDiscountForm>({
        defaultValues: props.providerDiscount,
    });

    const onSubmit = (discount: ProviderDiscountForm) => {
        props.submitHandler({
            ...discount,
            Discount: parseFloat(discount.Discount as unknown as string),
        });
    };

    let policyProviders = props.state.Resources.PolicyProviders.map(t => ({
        Id: t.Id,
        Name: t.Name
    }));

    return (
        <Dialog
            title       = {`${props.submitLabel} Platform Discount`}
            intro       = 'Enter platform discount:'
            onSubmit    = {handleSubmit(onSubmit)}
            submitLabel = {props.submitLabel}
            error       = {props.error === UniqueViolation ? 'This platform discount already exists.' : ''}
            content = {
                <>
                    <SelectControl
                        name    = 'PolicyProviderId'
                        options = {policyProviders}
                        label   = 'Provider'
                        control = {control}
                        required
                    />
                    
                    <TextInput
                        name    = 'Discount'
                        label   = 'Discounted platform fee (%)'
                        control = {control}
                        required
                        type    = 'numeric'
                        pattern = {{
                            value: /^[0-9]*[1-9][0-9]*$/,   // Must be a positive integer
                            message: 'Proportion must be a number greater than 0.'
                        }}
                    />
                </>
            }
        />
    );
}

export default ProviderDiscountDialog;
