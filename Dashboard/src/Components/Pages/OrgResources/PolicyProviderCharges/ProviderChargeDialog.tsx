import React from 'react';
import { useForm } from 'react-hook-form';

import { State } from 'Types/Types';
import { TextInput } from 'Components/Library/FormControls/TextInput';
import Dialog from 'Components/Library/Dialog/Dialog';
import { CurrencyFromString, CurrencyToString } from 'Utils/Strings';
import { UniqueViolation } from 'Errors';

interface ProviderChargeForm {
    Id: string,
    Boundary: string,  // currency
    Charge: number,    // percent
}

const ProviderChargeDialog = (props: {
    state: State,
    providerCharge: ProviderChargeForm,
    submitLabel: string,
    submitHandler: (providerCharge: ProviderChargeForm) => void,
    error: string,
}) => {
    let boundary = CurrencyToString(props.providerCharge.Boundary);
    if (/\.\d$/.test(boundary)) {
        boundary += '0';
    }

    const { handleSubmit, control } = useForm<ProviderChargeForm>({
        defaultValues: {
            ...props.providerCharge,
            Boundary: boundary,
            Charge: props.providerCharge.Charge,
        },
    });

    const onSubmit = (policy: ProviderChargeForm) => {
        props.submitHandler({
            ...policy,
            Boundary: CurrencyFromString(policy.Boundary) as unknown as string,
            Charge: (policy.Charge as number) * 1,  // Framework problem - DTO is not same as form
        });
    };

    let submitRef = React.createRef();

    return (
        <Dialog
            title       = {`${props.submitLabel} Provider Charge`}
            intro       = 'Enter provider charge details. Boundary is the lower side of the tier (the lesser amount):'
            submitLabel = {props.submitLabel}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            error       = {props.error === UniqueViolation ? 'This provider charge (range boundary and fee) already exists.' : ''}
            content = {
                <>
                    <TextInput
                        required
                        type='currency'
                        name='Boundary'
                        label='Lower tier boundary (£)'
                        control={control}
                    />

                    <TextInput
                        required
                        type='numeric'
                        name='Charge'
                        label='Annual Fee (%)'
                        control={control}
                    />
                </>
            }
        />
    );
}

export default ProviderChargeDialog;
