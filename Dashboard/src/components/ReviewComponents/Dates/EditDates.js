import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';

import Day from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { GoBack } from 'Utils/Routing';
import { Context } from 'State/StateProvider'
import { Api } from 'State';

export const EditDates = () => {
    Day.extend(utc);

    let history = useHistory();
    let goBack = GoBack(history);

    let { clientId } = useParams();

    const [state, dispatch ] = useContext(Context);

    let [ draft, setDraft ] = useState(null);

    if (!draft) {
        setDraft(state.Draft);
        return;
    }

    const okCallback = async (e) => {
        e.preventDefault();

        draft.StartDate = Day(draft.StartDate).format('YYYY-MM-DD');
        draft.EndDate = Day(draft.EndDate).format('YYYY-MM-DD');

        await Api.Advisor.Reviews.Update(clientId, draft);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);

        goBack();
        return false;
    };

    const handlers = {
        SetStartDate: (event) => { setDraft({ ...draft, StartDate: Day(event.target.value).format('YYYY-MM-DD') }); },
        SetEndDate:   (event) => { setDraft({ ...draft, EndDate:   Day(event.target.value).format('YYYY-MM-DD') }); },
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <form onSubmit={okCallback}>
                <DialogTitle>Edit dates</DialogTitle>
                <DialogContent>
                    Enter new review start and end dates
                </DialogContent>
                <DialogActions>
                    <TextField value    = {Day(draft.StartDate).utc(false).format('YYYY-MM-DD')}
                               onChange = {handlers.SetStartDate}
                               margin   = "dense"
                               id       = "startDate"
                               label    = "Start date"
                               type     = "date"
                               fullWidth />

                    <TextField value    = {Day(draft.EndDate).utc(false).format('YYYY-MM-DD')}
                               onChange = {handlers.SetEndDate}
                               margin   = "dense"
                               id       = "endDate"
                               label    = "End Date"
                               type     = "date"
                               fullWidth />

                    <Button onClick={goBack}>Cancel</Button>
                    <Button type='submit' onClick={okCallback}>Confirm</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditDates;
