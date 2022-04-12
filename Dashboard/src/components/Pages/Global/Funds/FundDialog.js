import React, {  } from 'react';
import { useHistory,  } from "react-router-dom";
import Day from 'dayjs';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    TextField,
} from '@mui/material';

import { GoBack } from 'Utils/Routing';
import FileInput from 'Components/Widgets/FileHandling/FileUploader';

export const FundDialog = ({ fund, setFund, submitLabel, submitHandler }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    const handlers = {
        SetName:         (event) => { setFund({ ...fund, Name:        event.target.value, }); },
        EditOcfFee:      (event) => { setFund({ ...fund, OcfFee:      parseFloat(event.target.value) }); },
        EditExAnteFee:   (event) => { setFund({ ...fund, ExAnteFee:   parseFloat(event.target.value) }); },
    };
    
    const download = (uid) => {
        window.ApiClient.get(`advisor/storage/download?Uid=${uid}`).then(res => {
            window.location = res.data.Url;
        })
    };

    const remove = () => {
        setFund({
            ...fund,
            File: null,
        });
    };

    let fileUploaded = (fileSpec) => {
        setFund({
            ...fund,
            File: fileSpec,
        });
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>{submitLabel} Holding</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter fund details
                    </DialogContentText>

                    <TextField value    = {fund.Name}
                               onChange = {handlers.SetName}
                               margin   = "dense"
                               id       = "name"
                               label    = "Name"
                               type     = "text"
                               variant  = "standard"
                               autoFocus
                               fullWidth />

                    <TextField value    = {fund.OcfFee}
                               onChange = {handlers.EditOcfFee}
                               margin   = "dense"
                               id       = "ocfFee"
                               label    = "OCF Fee"
                               type     = "number"
                               fullWidth />

                    <TextField value    = {fund.ExAnteFee}
                               onChange = {handlers.EditExAnteFee}
                               margin   = "dense"
                               id       = "exAnteFee"
                               label    = "Ex Ante Fee"
                               type     = "number"
                               fullWidth />

                    <Paper elevation={2}>
                        {fund.File ? (
                            <>
                                {fund.File.Filename} (uploaded {`${Day(fund.File.Date)}`})
                                <Button onClick={download.bind(null, fund.File.Uid)}>Download</Button>
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

export default FundDialog;
