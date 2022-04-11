import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

export const EditReviewStateDialog = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);

    let client = state.ClientContext;

    let { reviewId } = useParams();
   
    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Clients.Reviews.Publish(client.Id, reviewId);
        await Api.Clients.ClientDetail.Read(dispatch, client.Id);
        goBack();
        return false;
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={submitHandler}>
                <DialogTitle>Publish Review</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Update Review State
                    </DialogContentText>

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' onClick={submitHandler}>Publish</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditReviewStateDialog;
