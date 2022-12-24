import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    DialogContent,
    DialogContentText,
} from '@mui/material';

import { SelectControl } from 'Components/Library/FormControls/SelectControl';
import { TextInput } from 'Components/Library/FormControls/TextInput';

import Dialog from 'Components/Library/Dialog/Dialog';
import { Fund, State } from 'Types/Types';

interface PolicyFundForm {
    PolicyId: string,
    FundId: string,
    Proportion: number
}

const PolicyFund = (props: {
    state: State,
    policyFund: PolicyFundForm,
    submitLabel: string,
    submitHandler: (policy: PolicyFundForm) => void,
}) => {
    const { handleSubmit, control } = useForm<PolicyFundForm>({
        defaultValues: {
            ...props.policyFund,
            Proportion: props.policyFund.Proportion * 100,
        },
    });

    const onSubmit = (policyFund: PolicyFundForm) => {
        props.submitHandler({
            ...policyFund,
            Proportion: parseFloat((policyFund.Proportion / 100) as unknown as string),
        });
    };

    let policies = props.state.Report.Policies.map(policy => {
        let provider = props.state.Resources.PolicyProviders.find(pp => pp.Id === policy.PolicyProviderId)!;
        let type = props.state.Resources.PolicyTypes.find(pt => pt.Id === policy.PolicyTypeId)!;
        return {
            Id: policy.Id,
            Name: `${policy.ExternalId} - ${provider.Name} ${type.Name}`,
        };
    });

    let funds = props.state.Resources.Funds.map((t: Fund) => ({
        Id: t.Id,
        Name: t.Name
    }));

    let submitRef = React.createRef();

    return (
        <Dialog
            title       = {`${props.submitLabel} Holding`}
            submitLabel = {props.submitLabel}
            submitRef   = {submitRef}
            onSubmit    = {handleSubmit(onSubmit)}
            content = {
                <DialogContent>
                    <DialogContentText>
                        Enter fund details:
                    </DialogContentText>

                    <Box>
                        <SelectControl name='PolicyId' options={policies} label='Policy' control={control} required />
                        <SelectControl name='FundId'   options={funds}    label='Fund'   control={control} required />

                        <TextInput name='Proportion' label='Proportion (%)' control={control} required type='numeric' />
                    </Box>

                </DialogContent>
            }
        />
    );
}

export default PolicyFund;
