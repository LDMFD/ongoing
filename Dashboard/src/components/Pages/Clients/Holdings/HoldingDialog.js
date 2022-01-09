import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { Context } from 'Store'
import { GoBack } from 'Utils';

export const PortfolioDialog = ({ holding, setHolding, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    const [ state ] = useContext(Context);

    let client = state.clients.find(c => c.Id === clientId);

    const handlers = {
        SetPolicyId:     (event) => { setHolding({ ...holding, PolicyId:    parseInt(event.target.value), }); },
        SetPortfolioId:  (event) => { setHolding({ ...holding, PortfolioId: parseInt(event.target.value), }); },
        EditProportion:  (event) => {
            let p = parseFloat(event.target.value);
            p = isNaN(p) ? '' : p;
            setHolding({ ...holding, Proportion: p });
        },
    };
    
    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
                <DialogTitle>{submitLabel} Holding</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter holding details
                    </DialogContentText>

                    <Select value    = {holding.PolicyId}
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

                    <Select value    = {holding.PortfolioId}
                            onChange = {handlers.SetPortfolioId}
                            margin   = "dense"
                            id       = "type"
                            label    = "Portfolio"
                            type     = "text"
                            fullWidth>
                        <MenuItem value='select'>Select portfolio</MenuItem>
                        {state.portfolios.map(t => (
                            <MenuItem value={t.Id} key={t.Id}>
                                {t.Name}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField value = {holding.Proportion}
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

export default PortfolioDialog;
