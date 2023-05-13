import React from 'react';
import { useForm } from 'react-hook-form';

import { TextInput } from 'Components/Library/FormControls/TextInput';

import Dialog from 'Components/Library/Dialog/Dialog';
import { State } from 'Types/Types';
import { ProviderDiscount } from 'Types/OrgResources';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';

interface ProviderDiscountForm {
	PolicyProviderId: string,
	Discount: number,
}

const ProviderDiscountDialog = (props: {
    state: State,
    providerDiscount: ProviderDiscount,
    submitLabel: string,
    submitHandler: (providerDiscount: ProviderDiscountForm) => void,
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
            title       = {`${props.submitLabel} Provider Discount`}
            intro       = 'Enter provider discount:'
            onSubmit    = {handleSubmit(onSubmit)}
            submitLabel = {props.submitLabel}
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
                    />
                </>
            }
        />
    );
}

export default ProviderDiscountDialog;
