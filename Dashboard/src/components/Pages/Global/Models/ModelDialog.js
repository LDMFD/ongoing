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
import { GoBack } from 'Utils/Routing';
import FileInput from 'Components/Widgets/FileHandling/FileUploader';
import { Download } from 'Components/Widgets/FileHandling/FileDownloader';

export const ModelDialog = ({ model, setModel, submitLabel, submitHandler, includeFiles }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state ] = useContext(Context);

    const handlers = {
        EditName:              (event) => { setModel({ ...model, Name:              event.target.value }); },
        EditWeightedOcfFee:    (event) => { setModel({ ...model, WeightedOcfFee:    parseFloat(event.target.value) }); },
        EditWeightedExAnteFee: (event) => { setModel({ ...model, WeightedExAnteFee: parseFloat(event.target.value) }); },
        SetOperatorId:         (event) => { setModel({ ...model, OperatorId:        event.target.value, }); },
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

                    <TextField value = {model.Name}
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
                        {state.Entities.Operators.map(t => (
                            <MenuItem value={t.Id} key={t.Id}>
                                {t.Name}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField value = {model.WeightedOcfFee}
                            onChange = {handlers.EditWeightedOcfFee}
                            margin   = "dense"
                            id       = "ocfFee"
                            label    = "Weighted OCF Fee"
                            type     = "number"
                            fullWidth />

                    <TextField value = {model.WeightedExAnteFee}
                            onChange = {handlers.EditWeightedExAnteFee}
                            margin   = "dense"
                            id       = "exAnteFee"
                            label    = "Weighted Ex Ante Fee"
                            type     = "number"
                            fullWidth />

                    <Paper elevation={2}>
                        {model.File ? (
                            <>
                                {model.File.Filename} (uploaded {`${Day(model.File.Date)}`})
                                <Button onClick={Download.bind(null, model.File.Uid)}>Download</Button>
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
