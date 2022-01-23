import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import Day from 'dayjs';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Paper,
    Select,
    TextField,
} from '@mui/material';

import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils';
import FileInput from 'components/Widgets/FileUploader';

export const ModelDialog = ({ model, setModel, submitLabel, submitHandler, includeFiles }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state ] = useContext(Context);

    const handlers = {
        EditName:        (event) => { setModel({ ...model, Name:        event.target.value }); },
        EditWeightedFee: (event) => { setModel({ ...model, WeightedFee: parseFloat(event.target.value) }); },
        EditExAnteFee:   (event) => { setModel({ ...model, ExAnteFee:   parseFloat(event.target.value) }); },
        SetOperatorId:   (event) => { setModel({ ...model, OperatorId:  parseInt(event.target.value), }); },
    };
    
    const download = (uid) => {
        window.ApiClient.get(`/download?Uid=${uid}`).then(res => {
            window.location = res.data.Url;
        })
    };

    const remove = () => {
        setModel({
            ...model,
            File: null,
        });
    };

    let fileUploaded = (fileSpec) => {
        setModel({
            ...model,
            File: fileSpec,
        });
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Model</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter model details
                    </DialogContentText>

                    <TextField value    = {model.Name}
                            onChange = {handlers.EditName}
                            margin   = "dense"
                            id       = "name"
                            label    = "Name"
                            type     = "text"
                            autoFocus fullWidth />

                    <Select value    = {model.OperatorId}
                            onChange = {handlers.SetOperatorId}
                            margin   = "dense"
                            id       = "type"
                            label    = "Operator"
                            type     = "text"
                            fullWidth>
                        <MenuItem value='select'>Select operator</MenuItem>
                        {state.Operators.map(t => (
                            <MenuItem value={t.Id} key={t.Id}>
                                {t.Name}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField value    = {model.WeightedFee}
                            onChange = {handlers.EditWeightedFee}
                            margin   = "dense"
                            id       = "weightedFee"
                            label    = "Weighted OCF"
                            type     = "number"
                            fullWidth />

                    <TextField value    = {model.ExAnteFee}
                            onChange = {handlers.EditExAnteFee}
                            margin   = "dense"
                            id       = "exAnteFee"
                            label    = "Ex Ante Fee"
                            type     = "number"
                            fullWidth />

                    <Paper elevation={2}>
                        {model.File ? (
                            <>
                                {model.File.Filename} (uploaded {`${Day(model.File.Date)}`})
                                <Button onClick={download.bind(null, model.File.Uid)}>Download</Button>
                                <Button onClick={remove}>Remove</Button>
                            </>
                        ) : <>No files</>}
            
                        <p>Upload new:</p>
                        <FileInput completionCallback={fileUploaded} />
                    </Paper>

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' onClick={submitHandler}>{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ModelDialog;
