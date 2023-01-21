import React from 'react';
import { useForm } from 'react-hook-form';

import { TextInput } from 'Components/Library/FormControls/TextInput';

import { Client } from 'Types/ClientResources';
import Dialog from 'Components/Library/Dialog/Dialog';

interface ClientFormInput {
    Surname: string,
    Forenames: string,
    Email: string,
    Fee: number,
}

const ClientDialog = (props: {
    client: Client,
    submitLabel: string,
    submitHandler: (client: Client) => void,
}) => {
    const { handleSubmit, control } = useForm<ClientFormInput>({
        defaultValues: {
            ...props.client.Identity,
            ...props.client,
        }
    });

    const onSubmit = (data: ClientFormInput) => {
        props.submitHandler({
            ...props.client,
            Fee: parseFloat(data.Fee as unknown as string),
            Identity: {
                Forenames: data.Forenames,
                Surname: data.Surname,
                Email: data.Email,
            }
        });
    };

    return (
        <Dialog
            title       = {`${props.submitLabel} Client`}
            intro       = 'Enter new client details:'
            submitLabel = {props.submitLabel}
            onSubmit    = {handleSubmit(onSubmit)}
            content = {
                <>
                    <TextInput name='Email'     label='Email'          control={control} required type='email' />
                    <TextInput name='Surname'   label='Surname'        control={control} required />
                    <TextInput name='Forenames' label='Forenames'      control={control} required />
                    <TextInput name='Fee'       label='Advice Fee (%)' control={control} required type='numeric' />
                </>
            }
        />
    );
}

export default ClientDialog;
