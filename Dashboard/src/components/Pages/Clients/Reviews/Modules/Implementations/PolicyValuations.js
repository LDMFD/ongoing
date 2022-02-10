import React, { useContext, useState } from 'react';
import {
    Paper
} from '@mui/material';

import { Context } from 'State';

const PolicyValuations = () => {
    const [ state ] = useContext(Context);

    return (
        <Paper>
            val
        </Paper>
    );
}

export default PolicyValuations;
