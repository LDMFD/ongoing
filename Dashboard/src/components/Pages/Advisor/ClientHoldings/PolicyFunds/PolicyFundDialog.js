import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    MenuItem,
    Select,
} from '@mui/material';

import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';

export const PolicyFund = ({ policyFund, setPolicyFund, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state ] = useContext(Context);

    const handlers = {
        SetFundId:       (event) => { setPolicyFund({ ...policyFund, FundId:   event.target.value, }); },
        SetPolicyId:     (event) => { setPolicyFund({ ...policyFund, PolicyId: event.target.value, }); },
        EditProportion:  (event) => {
            let p = parseFloat(event.target.value);
            p = isNaN(p) ? '' : p;
            setPolicyFund({ ...policyFund, Proportion: p });
        },
    };
    
    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Holding</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter fund details
                    </DialogContentText>

                    <Select value    = {policyFund.PolicyId}
                            onChange = {handlers.SetPolicyId}
                            margin   = "dense"
                            id       = "type"
                            label    = "Policy"
                            type     = "text"
                            fullWidth>
                        <MenuItem value='select'>
                            Select policy
                        </MenuItem>
                        {state.Report.Policies.map(policy => {
                            let provider = state.Entities.PolicyProviders.find(pp => pp.Id === policy.PolicyProviderId);
                            let type = state.Entities.PolicyTypes.find(pt => pt.Id === policy.PolicyTypeId);
                            return (
                                <MenuItem value={policy.Id} key={policy.Id}>
                                    {policy.ExternalId} - {provider.Name} {type.Name}
                                </MenuItem>
                            );
                        })}
                    </Select>

                    <Select value    = {policyFund.FundId}
                            onChange = {handlers.SetFundId}
                            margin   = "dense"
                            id       = "type"
                            label    = "Fund"
                            type     = "text"
                            fullWidth>
                        <MenuItem value='select'>Select fund</MenuItem>
                        {state.Entities.Funds.map(t => (
                            <MenuItem value={t.Id} key={t.Id}>
                                {t.Name}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField value    = {policyFund.Proportion}
                               onChange = {handlers.EditProportion}
                               margin   = "dense"
                               id       = "proportion"
                               label    = "Proportion"
                               type     = "number"
                               fullWidth />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit'>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PolicyFund;
