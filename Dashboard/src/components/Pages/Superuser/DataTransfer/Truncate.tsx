import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    DialogContent,
    DialogContentText,
} from '@mui/material';

import { Api } from 'State';
import Dialog from 'Components/Library/Dialog/Dialog';
import { TextInput } from 'Components/Library/FormControls/TextInput';

interface TruncateForm {
    Env: string,
}

const TruncateDialog = () => {
    const { handleSubmit, control } = useForm<TruncateForm>({
        defaultValues: {
            Env: '',
        }
    });

    const onSubmit = async (form: TruncateForm) => {
        // @ts-ignore
        if (form.Env !== window.Config.Env) {
            alert("env does not match and form validation failed");
            return;
        }
        await Api.Superuser.Truncate(form.Env);
        alert("Database contents deleted, page will reload.");
        window.location.reload();
    };

    let submitRef = React.createRef();

    // @ts-ignore
    let env = window.Config.Env;

    return (
        <div className   = 'truncate-dialog'>
            <Dialog
                title       = 'Delete database contents'
                submitLabel = 'Delete'
                submitRef   = {submitRef}
                onSubmit    = {handleSubmit(onSubmit)}
                content = {
                    <DialogContent>
                        <DialogContentText>
                            Type the current environment ({env}) to confirm:
                        </DialogContentText>

                        <Box>
                            <TextInput
                                control = {control}
                                name    = 'Env'
                                label   = 'Delete which environment?'
                                type    = 'text'
                                pattern = {{
                                    value: new RegExp(`^${env}$`),
                                    message: 'Type the current environment name to continue',
                                }}
                                required />
                        </Box>

                    </DialogContent>
                }
            />
        </div>
    );
}

export default TruncateDialog;
