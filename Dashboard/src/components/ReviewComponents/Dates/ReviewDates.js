import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Context } from 'State/StateProvider'
import { FromCanonical } from 'Utils/DateTime';

const Dates = () => {
    let { clientId } = useParams();

    const [ state ] = useContext(Context);

    let draft = state.Draft;

    let startDate = FromCanonical(draft.StartDate)?.toLocaleDateString('en-GB');
    let endDate =   FromCanonical(draft.EndDate)?.toLocaleDateString('en-GB');

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
