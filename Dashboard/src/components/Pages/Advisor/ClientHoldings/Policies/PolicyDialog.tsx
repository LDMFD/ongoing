import React from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import RichTextEditor from 'Components/Library/RichTextEditor/RichTextEditor';

import { GoBack } from 'Utils/Routing';
import FileUploader from 'Components/Library/FileHandling/FileUploader';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';
import { TextInput } from 'Components/Library/FormControls/TextInput';

import { File, State } from 'Types/Types';

interface FormFile extends File {
    Uploading: boolean,
}

interface PolicyFormInput {
    EndValue: number,
    ExternalId: string,
    File?: FormFile,
    MonthlyContributions: number,
    Notes: string,
    PolicyProviderId: string,
    PolicyTypeId: string,
    StartValue: number,
}

const PolicyDialog = (props: {
    state: State,
    policy: PolicyFormInput,
    submitLabel: string,
    submitHandler: (policy: PolicyFormInput) => void,
}) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const { handleSubmit, control } = useForm<PolicyFormInput>({
        defaultValues: props.policy
    });

    const onSubmit = (policy: PolicyFormInput) => {
        props.submitHandler({
            ...policy,
            MonthlyContributions: parseInt(policy.MonthlyContributions as unknown as string),
            StartValue: parseInt(policy.StartValue as unknown as string),
            EndValue: parseInt(policy.EndValue as unknown as string),
        });
    };

    let policyTypes = props.state.Resources.PolicyTypes.map(t => ({
        Id: t.Id,
        Name: t.Name
    }));

    let policyProviders = props.state.Resources.PolicyProviders.map(t => ({
        Id: t.Id,
        Name: t.Name
    }));

    let submitRef = React.createRef();

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>{props.submitLabel} Policy</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter policy details:
                    </DialogContentText>

                    <Box>
                        <TextInput name='ExternalId'           label='Policy number'            control={control} required />
                        <TextInput name='MonthlyContributions' label='Monthly Contribution (£)' control={control} required type='numeric' />
                        <TextInput name='StartValue'           label='Start Value (£)'          control={control} required type='numeric' />
                        <TextInput name='EndValue'             label='End Value (£)'            control={control} required type='numeric' />

                        <SelectControl name='PolicyTypeId'     options={policyTypes}     label='Policy Type'     control={control} required />
                        <SelectControl name='PolicyProviderId' options={policyProviders} label='Policy Provider' control={control} required />

                        <RichTextEditor name    = 'Notes'
                                        label   = 'Notes'
                                        control = {control} />

                        <FileUploader label        = 'Policy file'
                                      name         = 'File'
                                      control      = {control}
                                      submitRef    = {submitRef} />
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' ref={submitRef as any}>{props.submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default PolicyDialog;
