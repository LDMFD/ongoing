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

export const ConfirmationDialog = ({ label, okCallback }) => {
    let history = useHistory();
    let goBack = GoBack(history);

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={okCallback}>
                <DialogTitle>{label}</DialogTitle>
                <DialogContent>
                    Confirmation is required for this destructive action.
                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' onClick={okCallback}>Confirm</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ConfirmationDialog;
