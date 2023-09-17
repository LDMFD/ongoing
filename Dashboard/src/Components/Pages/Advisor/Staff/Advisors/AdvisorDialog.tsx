import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Button,
} from '@mui/material';

import SendSignInLink from 'Components/Library/Auth/AuthEmailer';
import Dialog from 'Components/Library/Dialog/Dialog';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';
import { TextInput } from 'Components/Library/FormControls/TextInput';
import { UniqueViolation } from 'Errors';
import { State } from 'Types/Types';

interface AdvisorFormInput {
    Name: string,
    Email: string,
    Type: string,
    Fee: string | number,
}

export const AdvisorDialog = (props: {
    state: State,
    advisor: AdvisorFormInput,
    submitLabel: string,
    submitHandler: (advisor: AdvisorFormInput) => void,
    error: string,
}) => {
    const { handleSubmit, control } = useForm<AdvisorFormInput>({
        defaultValues: props.advisor
    });

    const onSubmit = (advisor: AdvisorFormInput) => {
        props.submitHandler(advisor);
    };

    let submitRef = React.createRef();

    let roles = [{
        Id: 'administrator',
        Name: 'Administrator',
    }, {
        Id: 'advisor',
        Name: 'Advisor',
    }]

    return (
        <Dialog
            title       = {props.submitLabel + ' Staff Member'}
            intro       = 'Enter staff member details:'
            submitLabel = {props.submitLabel}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            error       = {props.error === UniqueViolation ?
                'A staff member with this email already exists.' : ''}
        content = {
                <>
                    <TextInput
                        name    = 'Email'
                        label   = 'Email'
                        type    = 'email'
                        control = {control}
                        required
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

                    <SelectControl
                        name    = 'Role'
                        options = {roles}
                        label   = 'Role'
                        control = {control}
                        required
                    />

                    {props.submitLabel === 'Update' &&
                        <Button onClick={SendSignInLink.bind(null, props.advisor.Email)}>
                            Send sign-in link
                        </Button>
                    }
                </>
            }
        />
    );
}

export default AdvisorDialog;
