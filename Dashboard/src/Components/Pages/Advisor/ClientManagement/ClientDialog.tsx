import React from 'react';
import { useForm } from 'react-hook-form';

import { TextInput } from 'Components/Library/FormControls/TextInput';

import Dialog from 'Components/Library/Dialog/Dialog';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';
import { UniqueViolation } from 'Errors';
import { Client } from 'Types/ClientResources';
import { State } from 'Types/Types';
import PageTitle from 'Components/Library/PageTitle/PageTitle';

interface ClientFormInput {
    Surname: string,
    Forenames: string,
    Email: string,
    Fee: number,
    AdvisorId: string,
}

const ClientDialog = (props: {
    state: State,
    client: Client,
    submitLabel: string,
    submitHandler: (client: Client) => void,
    error: string,
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
            AdvisorId: data.AdvisorId,
            Fee: parseFloat(data.Fee as unknown as string),
            Identity: {
                Forenames: data.Forenames,
                Surname: data.Surname,
                Email: data.Email,
            }
        });
    };

    let advisors = props.state.Advisors.map(a => ({
        Id: a.Id,
        Name: `${a.Forenames} ${a.Surname}`,
    }));

    return (
        <>
            <PageTitle title={`Edit client: ${props.client.Identity.Forenames} ${props.client.Identity.Surname} | Amplifa`} />

            <Dialog
                title       = {`${props.submitLabel} Client`}
                intro       = 'Enter new client details:'
                submitLabel = {props.submitLabel}
                onSubmit    = {handleSubmit(onSubmit)}
                error       = {props.error === UniqueViolation ? 'A user with this email already exists.' : ''}
                content = {
                    <>
                        <TextInput
                            name    = 'Email'
                            label   = 'Email'
                            control = {control}
                            required
                            type    = 'email'
                        />

                        <TextInput
                            name    = 'Surname'
                            label   = 'Surname'
                            control = {control}
                            required
                        />

                        <TextInput
                            name    = 'Forenames'
                            label   = 'Forenames'
                            control = {control}
                            required
                        />

                        <TextInput
                            name    = 'Fee'
                            label   = 'Advice Fee (%)'
                            control = {control}
                            required
                            type    = 'numeric'
                        />

                        {props.submitLabel == 'Update' &&
                            <SelectControl
                                name     = 'AdvisorId'
                                label    = 'Advisor'
                                options  = {advisors}
                                control  = {control}
                                required
                            />
                        }
                    </>
                }
            />
        </>
    );
}

export default ClientDialog;
