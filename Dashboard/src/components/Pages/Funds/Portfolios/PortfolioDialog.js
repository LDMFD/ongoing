import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import Day from 'dayjs';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { Context } from 'Store'
import { GoBack } from 'Utils';
import FileInput from 'components/Widgets/FileUploader';

export const PortfolioDialog = ({ portfolio, setPortfolio, submitLabel, submitHandler, includeFiles }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state ] = useContext(Context);

    if (!state.operators?.length) {
        return (
            <Paper>
                No operators defined
            </Paper>
        );
    }

    const handlers = {
        EditName:        (event) => { setPortfolio({ ...portfolio, Name:        event.target.value }); },
        EditWeightedFee: (event) => { setPortfolio({ ...portfolio, WeightedFee: parseFloat(event.target.value) }); },
        EditExAnteFee:   (event) => { setPortfolio({ ...portfolio, ExAnteFee:   parseFloat(event.target.value) }); },
        SetOperatorId:   (event) => { setPortfolio({ ...portfolio, OperatorId:  parseInt(event.target.value), }); },
    };
    
    const download = (uid) => {
        window.ApiClient.get(`/download?Uid=${uid}`).then(res => {
            window.location = res.data.Url;
        })
    };

    const remove = () => {
        setPortfolio({
            ...portfolio,
            File: null,
        });
    };

    let fileUploaded = (fileSpec) => {
        setPortfolio({
            ...portfolio,
            File: fileSpec,
        });
    };

    return (
        <div className="modal" >
            <Dialog open={true} onClose={goBack}>
                <form onSubmit={submitHandler}>
                    <DialogTitle>{submitLabel} Portfolio</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter portfolio details
                        </DialogContentText>

                        <TextField value    = {portfolio.Name}
                                onChange = {handlers.EditName}
                                margin   = "dense"
                                id       = "name"
                                label    = "Name"
                                type     = "text"
                                autoFocus fullWidth />

                        <Select value    = {portfolio.OperatorId}
                                onChange = {handlers.SetOperatorId}
                                margin   = "dense"
                                id       = "type"
                                label    = "Operator"
                                type     = "text"
                                fullWidth>
                            <MenuItem value='select'>Select operator</MenuItem>
                            {state.operators.map(t => (
                                <MenuItem value={t.Id} key={t.Id}>
                                    {t.Name}
                                </MenuItem>
                            ))}
                        </Select>

                        <TextField value    = {portfolio.WeightedFee}
                                onChange = {handlers.EditWeightedFee}
                                margin   = "dense"
                                id       = "weightedFee"
                                label    = "Weighted OCF"
                                type     = "number"
                                fullWidth />

                        <TextField value    = {portfolio.ExAnteFee}
                                onChange = {handlers.EditExAnteFee}
                                margin   = "dense"
                                id       = "exAnteFee"
                                label    = "Ex Ante Fee"
                                type     = "number"
                                fullWidth />

                        <Paper elevation={2}>
                            {portfolio.File ? (
                                <>
                                    {portfolio.File.Filename} (uploaded {`${Day(portfolio.File.Date)}`})
                                    <Button onClick={download.bind(null, portfolio.File.Uid)}>Download</Button>
                                    <Button onClick={remove}>Remove</Button>
                                </>
                            ) : <>No files</>}
                
                            <p>Upload new:</p>
                            <FileInput completionCallback={fileUploaded} />
                        </Paper>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={goBack}>Cancel</Button>
                        <Button type="submit">{submitLabel}</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
};

export default PortfolioDialog;
