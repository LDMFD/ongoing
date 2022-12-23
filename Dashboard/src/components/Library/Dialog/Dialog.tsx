import React from 'react';
import { useHistory } from 'react-router-dom';
import {
    Button,
    Dialog as MuiDialog,
    DialogActions,
    DialogTitle,
} from '@mui/material';

import { GoBack } from 'Utils/Routing';

import './Dialog.css';

const Dialog = (props: {
    title: string,
    onSubmit: any,
    submitLabel: string,
    submitRef: any,
    content: any,
}) => {
    let history = useHistory();
    let goBack = GoBack(history);

    let ref = props.submitRef as any;

    return (
        <MuiDialog open={true} onClose={goBack}>
            <div className='ong-dialog'>
                <form onSubmit={props.onSubmit}>
                    <DialogTitle>{props.title}</DialogTitle>
                    {props.content}
                    <DialogActions>
                        <Button onClick={goBack}>Cancel</Button>
                        <Button type='submit' ref={ref}>{props.submitLabel}</Button>
                    </DialogActions>
                </form>
            </div>
        </MuiDialog>
    );
}

export default Dialog;
