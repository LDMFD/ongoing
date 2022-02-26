import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";
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

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    const [ state ] = useContext(Context);

    let client = state.Clients.find(c => c.Id === clientId);

    const handlers = {
        SetPolicyId:     (event) => { setPortfolio({ ...portfolio, PolicyId:    parseInt(event.target.value), }); },
        SetModelId:      (event) => { setPortfolio({ ...portfolio, ModelId: parseInt(event.target.value), }); },
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
                        <MenuItem value='select'>Select policy</MenuItem>
                        {client.Policies.map(t => (
                            <MenuItem value={t.Id} key={t.Id}>
                                {t.ExternalId}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select value    = {portfolio.ModelId}
                            onChange = {handlers.SetModelId}
                            margin   = "dense"
                            id       = "type"
                            label    = "Model"
                            type     = "text"
                            fullWidth>
                        <MenuItem value='select'>Select model</MenuItem>
                        {state.Models.map(t => (
                            <MenuItem value={t.Id} key={t.Id}>
                                {t.Name}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField value = {portfolio.Proportion}
                            onChange = {handlers.EditProportion}
                            margin   = "dense"
                            id       = "proportion"
                            label    = "Proportion"
                            type     = "number"
                            fullWidth autoFocus />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' onClick={submitHandler}>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PortfolioDialog;
