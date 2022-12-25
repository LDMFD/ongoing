import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    DialogContent,
    DialogContentText,
} from '@mui/material';
import { RichTextEditor2 } from 'Components/Library/RichTextEditor/RichTextEditor';

import FileUploader from 'Components/Library/FileHandling/FileUploader';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';
import { TextInput } from 'Components/Library/FormControls/TextInput';

import { File, State } from 'Types/Types';
import Dialog from 'Components/Library/Dialog/Dialog';
import { PolicyProvider, PolicyType } from 'Types/OrgResources';

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

    let policyTypes = props.state.Resources.PolicyTypes.map((t: PolicyType) => ({
        Id: t.Id,
        Name: t.Name
    }));

    let policyProviders = props.state.Resources.PolicyProviders.map((t: PolicyProvider) => ({
        Id: t.Id,
        Name: t.Name
    }));

    let submitRef = React.createRef();

    return (
        <Dialog
            title       = {`${props.submitLabel} Policy`}
            submitLabel = {props.submitLabel}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            content = {
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

                        <RichTextEditor2 name    = 'Notes'
                                        label   = 'Notes'
                                        control = {control} />

                        <FileUploader label        = 'Policy file'
                                      name         = 'File'
                                      control      = {control}
                                      submitRef    = {submitRef} />
                    </Box>

                </DialogContent>
            }
        />
    );
}

export default PolicyDialog;
