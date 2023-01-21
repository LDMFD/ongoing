import React from 'react';
import { useForm } from 'react-hook-form';

import { RichTextEditor2 } from 'Components/Library/RichTextEditor/RichTextEditor2';
import FileUploader2 from 'Components/Library/FileHandling/FileUploader2';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';
import { TextInput } from 'Components/Library/FormControls/TextInput';

import { File, State } from 'Types/Types';
import Dialog from 'Components/Library/Dialog/Dialog';
import { PolicyProvider, PolicyType } from 'Types/OrgResources';
import { CurrencyFromString, CurrencyToString } from 'Utils/Strings';

interface FormFile extends File {
    Uploading: boolean,
}

interface PolicyFormInput {
    EndValue: string,
    ExternalId: string,
    File?: FormFile,
    MonthlyContributions: string,
    Notes: string,
    PolicyProviderId: string,
    PolicyTypeId: string,
    StartValue: string,
}

const PolicyDialog = (props: {
    state: State,
    policy: PolicyFormInput,
    submitLabel: string,
    submitHandler: (policy: PolicyFormInput) => void,
}) => {
    let monthlyContributions = CurrencyToString(props.policy.MonthlyContributions);
    let startValue           = CurrencyToString(props.policy.StartValue);
    let endValue             = CurrencyToString(props.policy.EndValue);

    if (/\.\d$/.test(monthlyContributions)) { monthlyContributions += '0'; }
    if (/\.\d$/.test(startValue))           { startValue += '0'; }
    if (/\.\d$/.test(endValue))             { endValue += '0'; }

    const { handleSubmit, control } = useForm<PolicyFormInput>({
        defaultValues: {
            ...props.policy,
            MonthlyContributions: monthlyContributions,
            StartValue:           startValue,
            EndValue:             endValue,
        },
    });

    const onSubmit = (policy: PolicyFormInput) => {
        props.submitHandler({
            ...policy,
            MonthlyContributions: CurrencyFromString(policy.MonthlyContributions) as unknown as string,
            StartValue:           CurrencyFromString(policy.StartValue) as unknown as string,
            EndValue:             CurrencyFromString(policy.EndValue) as unknown as string,
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
            title       = {props.submitLabel + ' Policy'}
            intro       = 'Enter policy details:'
            submitLabel = {props.submitLabel}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            content = {
                <>
                    <TextInput name='ExternalId'           label='Policy number'            control={control} required />
                    <TextInput name='MonthlyContributions' label='Monthly Contribution (£)' control={control} required type='currency' />
                    <TextInput name='StartValue'           label='Start Value (£)'          control={control} required type='currency' />
                    <TextInput name='EndValue'             label='End Value (£)'            control={control} required type='currency' />

                    <SelectControl name='PolicyTypeId'     options={policyTypes}     label='Policy Type'     control={control} required />
                    <SelectControl name='PolicyProviderId' options={policyProviders} label='Policy Provider' control={control} required />

                    <RichTextEditor2 name    = 'Notes'
                                        label   = 'Notes'
                                        control = {control} />

                    <FileUploader2 label        = 'Policy file'
                                    name         = 'File'
                                    control      = {control}
                                    submitRef    = {submitRef} />
                </>
            }
        />
    );
}

export default PolicyDialog;
