import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import Day from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Context } from 'State/StateProvider'

const Dates = () => {
    Day.extend(utc);

    let { clientId } = useParams();

    const [ state ] = useContext(Context);

    let draft = state.Draft;

    let startDate = Day(draft.StartDate);
    let endDate = Day(draft.EndDate);

    if (!startDate.isValid()) {
        startDate = 'Not set';
    } else {
        startDate = startDate.utc(false).format('DD-MM-YYYY')
    }
    
    if (!endDate.isValid()) {
        endDate = 'Not set';
    } else {
        endDate = endDate.utc(false).format('DD-MM-YYYY')
    }

    return (
        <div>
            <br />
            <Link to={`/clients/id/${clientId}/modules/dates/edit`}>
                Edit dates
            </Link>

            <p>
                Start date: {startDate} <br />
                End date: {endDate} <br />
            </p>
        </div>
    );
}
export default Dates;
