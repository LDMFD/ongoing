import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';

import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';

export const PortfolioDialog = ({ portfolio, setPortfolio, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state ] = useContext(Context);

    const handlers = {
        SetPolicyId:     (event) => { setPortfolio({ ...portfolio, PolicyId: event.target.value, }); },
        SetModelId:      (event) => { setPortfolio({ ...portfolio, ModelId: event.target.value, }); },
        EditProportion:  (event) => {
            let p = parseFloat(event.target.value);
            p = isNaN(p) ? '' : p;
            setPortfolio({ ...portfolio, Proportion: p });
        },
    };
    
    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Portfolio</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter portfolio details
                    </DialogContentText>

                    <Select value    = {portfolio.PolicyId}
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

                    <Select value    = {portfolio.ModelId}
                            onChange = {handlers.SetModelId}
                            margin   = "dense"
                            id       = "type"
                            label    = "Model"
                            type     = "text"
                            fullWidth>
                        <MenuItem value='select'>Select model</MenuItem>
                        {state.Entities.Models.map(t => (
                            <MenuItem value={t.Id} key={t.Id}>
                                {t.Name}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField value    = {portfolio.Proportion}
                               onChange = {handlers.EditProportion}
                               margin   = "dense"
                               id       = "proportion"
                               label    = "Proportion"
                               type     = "number"
                               fullWidth autoFocus />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit'>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PortfolioDialog;
