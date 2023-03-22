import React, {  } from 'react';
import { useHistory,  } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

import { GoBack } from 'Utils/Routing';

export const ConfirmationDialog = (props: {
    label: string,
    okCallback: (e: any) => {},
    content?: any
}) => {
    let history = useHistory();
    let goBack = GoBack(history);

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={props.okCallback}>
                <DialogTitle>{props.label}</DialogTitle>
                <DialogContent>
                    {props.content ?? 'Confirmation is required for this destructive action.'}
                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' onClick={props.okCallback} autoFocus>Confirm</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ConfirmationDialog;
