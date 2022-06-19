import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

import { GoBack } from 'Utils/Routing';
import { Context } from 'State/StateProvider'
import { Api } from 'State';
import { DateSelector } from 'Components/Library/DateSelector/DateSelector';

export const EditDatesDialog = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    let { clientId } = useParams();

    const [ state, dispatch ] = useContext(Context);

    let [ draft, setDraft ] = useState(null);

    if (!draft) {
        setDraft(state.Draft);
        return;
    }

    const okCallback = async (e) => {
        e.preventDefault();
        
        await Api.Advisor.Reviews.Update(clientId, draft);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);

        goBack();
        return false;
    };

    const handlers = {
        SetStartDate: (event) => {
            setDraft({
                ...draft,
                StartDate: event,
            });
        },
        SetEndDate: (event) => {
            setDraft({
                ...draft,
                EndDate: event,
            });
        },
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={okCallback}>
                <DialogTitle>Edit dates</DialogTitle>
                <DialogContent>
                    Enter new review start and end dates
                    <br />
                    <br />

                    <DateSelector label='Start date'
                                  selected = {draft.StartDate}
                                  onChange = {handlers.SetStartDate} />
                                  {/* </Box> */}

                    <DateSelector label='End date'
                                  selected = {draft.EndDate}
                                  onChange = {handlers.SetEndDate} />

                    <DialogActions>
                        <Button onClick={goBack}>Cancel</Button>
                        <Button type='submit' onClick={okCallback}>Confirm</Button>
                    </DialogActions>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default EditDatesDialog;
