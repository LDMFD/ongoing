import React from 'react';
import { useForm } from 'react-hook-form';

import FileUploader2 from 'Components/Library/FileHandling/FileUploader2';
import { Api } from 'State';
import Dialog from 'Components/Library/Dialog/Dialog';
import { File } from 'Types/Types';
import { TextInput } from 'Components/Library/FormControls/TextInput';

interface ImportForm {
    File: File,
    Env: string,
}

const ImportDialog = () => {
    const { handleSubmit, control } = useForm<ImportForm>({
        defaultValues: {
            File: undefined,
        }
    });

    const onSubmit = async (form: ImportForm) => {
        // @ts-ignore
        if (form.Env !== window.Config.Env) {
            alert("env does not match and form validation failed");
            return;
        }
        await Api.Superuser.Import(form.File.Uid);
        // @ts-ignore
        window.location = '/admin/organisations';
    };

    let submitRef = React.createRef();

    // @ts-ignore
    let env = window.Config.Env;

    return (
        <div className   = 'import-dialog'>
            <Dialog
                title       = 'Import new database from JSON'
                intro       = 'Import database JSON:'
                submitLabel = 'Import'
                submitRef   = {submitRef}
                onSubmit    = {handleSubmit(onSubmit)}
                content = {
                    <>
                        <FileUploader2
                            label        = 'JSON'
                            name         = 'File'
                            control      = {control}
                            submitRef    = {submitRef}
                            required
                        />
                        <br />

                        Type the current environment ({env}) to confirm:
                        <br />
                        <br />

                        <TextInput
                            control = {control}
                            name    = 'Env'
                            label   = 'Environment name'
                            type    = 'text'
                            pattern = {{
                                value: new RegExp(`^${env}$`),
                                message: 'Type the current environment name to continue',
                            }}
                            required />
                    </>
                }
            />
        </div>
    );
}

export default ImportDialog;
