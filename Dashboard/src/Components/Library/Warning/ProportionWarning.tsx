import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from '@mui/material';

import { FormatPercent } from 'Utils/Strings';
import { Context } from 'State';

 // EXPERIMENTAL
 const DISABLED = true; 

export const ProportionWarning = (props: {
    data: Array<any>,
    property: string,
}) => {
    // @ts-ignore
    const [ state, ] = useContext(Context);

    // @ts-ignore
    const { reviewId } = useParams();

    if (DISABLED)
        return null;

    if (state.Session.Role === 'client') {
        return null;
    }

    let sum = props.data.map((o: any) => o[props.property])
        .reduce((agg: number, a: number) => agg + (a || 0), 0) * 100;

    let warn = sum !== 100;
    return warn ? (
        <Alert severity="warning">
            {reviewId ? 'Advisor warning' : 'Warning'}
            : proportions add up to {FormatPercent(sum)}, not 100%.
        </Alert>
    ) : null;
};
