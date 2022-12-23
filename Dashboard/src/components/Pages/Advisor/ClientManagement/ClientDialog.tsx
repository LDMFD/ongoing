import React from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import {
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import { GoBack } from 'Utils/Routing';
import { TextInput } from 'Components/Library/FormControls/TextInput';

import './ClientDialog.css';
import { Client } from 'Types/Types';

interface IFormInput {
    Surname: string,
    Forenames: string,
    Email: string,
    Fee: number,
}

const ClientDialog = (params: {
    client: Client,
    submitLabel: string,
    submitHandler: (client: Client) => void,
}) => {
    let { client, submitLabel, submitHandler } = params;
        
    let history = useHistory();
    let goBack = GoBack(history);

    const methods = useForm<IFormInput>({ defaultValues: {
        ...client.Identity,
        ...client,
    }});
    const { handleSubmit, control } = methods;

    const onSubmit = (data: IFormInput) => {
        submitHandler({
            ...client,
            Fee: parseFloat(data.Fee as unknown as string),
            Identity: {
                Forenames: data.Forenames,
                Surname: data.Surname,
                Email: data.Email,
            }
        });
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>{submitLabel} Client</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter new client details.
                    </DialogContentText>

                    <Box>
                        <TextInput name="Surname"   label="Surname"   control={control} required />
                        <TextInput name="Forenames" label="Forenames" control={control} required />
                        <TextInput name="Email"     label="Email"     control={control} required type='email' />
                        <TextInput name="Fee"       label="Fee"       control={control} required type='numeric' />
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit'>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default ClientDialog;
