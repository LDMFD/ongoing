import React, { useContext } from 'react';
import {
    Paper
} from '@mui/material';

import { Context } from 'State';

const Review = () => {
    const [ state, ] = useContext(Context);

    return (
        <Paper elevation={2}>
            review
            {state.Models.map(m => (
                <div key={m.Id}>
                    {m.Name}
                </div>
            ))}
        </Paper>
    );
}

export default Review;
