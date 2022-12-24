import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    DialogContent,
    DialogContentText,
} from '@mui/material';

import { TextInput } from 'Components/Library/FormControls/TextInput';

import Dialog from 'Components/Library/Dialog/Dialog';
import { ProviderDiscount, State } from 'Types/Types';
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
            submitLabel = {props.submitLabel}
            title       = {`${props.submitLabel} Provider Discount`}
            onSubmit    = {handleSubmit(onSubmit)}
            content = {
                <DialogContent>
                    <DialogContentText>
                        Enter provider discount:
                    </DialogContentText>

                    <Box>
                        <SelectControl
                            name    = 'PolicyProviderId'
                            options = {policyProviders}
                            label   = 'Provider'
                            control = {control}
                            required
                        />
                        
                        <TextInput
                            name    = 'Discount'
                            label   = 'Discounted platform fee'
                            control = {control}
                            required
                            type    = 'numeric'
                        />
                    </Box>

                </DialogContent>
            }
        />
    );
}

export default ProviderDiscountDialog;
