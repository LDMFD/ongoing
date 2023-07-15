import React from 'react';
import { useForm } from 'react-hook-form';

import Dialog from 'Components/Library/Dialog/Dialog';
import { CheckboxControl } from 'Components/Library/FormControls/CheckboxControl';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';
import { TextInput } from 'Components/Library/FormControls/TextInput';
import { PolicyFund } from 'Types/ClientResources';
import { Fund } from 'Types/OrgResources';
import { State } from 'Types/Types';
import { PercentageFormatter } from 'Utils/Strings';

interface PolicyFundForm {
    Id: string,
    PolicyId: string,
    FundId: string,
    Proportion: string,
    IncludeInFee: boolean,
}

const PolicyFundDialog = (props: {
    state: State,
    policyFund: PolicyFund,
    submitLabel: string,
    submitHandler: (policy: PolicyFund) => void,
}) => {
    const { handleSubmit, control } = useForm<PolicyFundForm>({
        defaultValues: {
            ...props.policyFund,
            Proportion: PercentageFormatter.format(props.policyFund.Proportion * 100),
        },
    });

    const onSubmit = (policyFund: PolicyFundForm) => {
        props.submitHandler({
            ...policyFund,
            Proportion: parseFloat(policyFund.Proportion) / 100,
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

    return (
        <Dialog
            title       = {`${props.submitLabel} Holding`}
            intro       = 'Enter fund details:'
            submitLabel = {props.submitLabel}
            onSubmit    = {handleSubmit(onSubmit)}
            content = {
                <>
                    <SelectControl name='PolicyId' options={policies} label='Policy' control={control} required />
                    <SelectControl name='FundId'   options={funds}    label='Fund'   control={control} required />
                    
                    <TextInput name='Proportion' label='Proportion (%)' control={control} required type='numeric' />

                    <CheckboxControl name='IncludeInFee' label='Include in fee calculation?' control={control} />
                </>
            }
        />
    );
}

export default PolicyFundDialog;
