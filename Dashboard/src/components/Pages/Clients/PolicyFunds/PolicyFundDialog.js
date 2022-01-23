import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";
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
import { GoBack } from 'Utils';

export const PolicyFund = ({ policyFund, setPolicyFund, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    const [ state ] = useContext(Context);

    let client = state.Clients.find(c => c.Id === clientId);

    const handlers = {
        SetFundId:       (event) => { setPolicyFund({ ...policyFund, FundId:   parseInt(event.target.value), }); },
        SetPolicyId:     (event) => { setPolicyFund({ ...policyFund, PolicyId: parseInt(event.target.value), }); },
        EditProportion:  (event) => {
            let p = parseFloat(event.target.value);
            p = isNaN(p) ? '' : p;
            setPolicyFund({ ...policyFund, Proportion: p });
        },
    };
    
    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
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
                        <MenuItem value='select'>Select policy</MenuItem>
                        {client.Policies.map(t => (
                            <MenuItem value={t.Id} key={t.Id}>
                                {t.ExternalId}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select value    = {policyFund.FundId}
                            onChange = {handlers.SetFundId}
                            margin   = "dense"
                            id       = "type"
                            label    = "Fund"
                            type     = "text"
                            fullWidth>
                        <MenuItem value='select'>Select fund</MenuItem>
                        {state.Funds.map(t => (
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
                    <Button onClick={submitHandler}>{submitLabel}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PolicyFund;
