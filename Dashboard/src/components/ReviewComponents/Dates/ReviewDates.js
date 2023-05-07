import React, { useCallback, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import TabContent from 'Components/Library/TabContent/TabContent';
import { Api } from 'State';
import { Context } from 'State/StateProvider';
import { FromCanonical } from 'Utils/DateTime';

const Dates = () => {
    let { clientId } = useParams();

    const [ state, dispatch ] = useContext(Context);

    const sync = useCallback(() => {
        Api.Advisor.ClientDetail.Read(dispatch, clientId);
    }, [ dispatch, clientId ]);

    useEffect(() => {
        sync();
    }, [ sync ]);

    let draft = state.Draft;

    let startDate = FromCanonical(draft.StartDate)?.toLocaleDateString('en-GB');
    let endDate =   FromCanonical(draft.EndDate)?.toLocaleDateString('en-GB');

    return (
        <TabContent>
            <Link to={`/clients/id/${clientId}/modules/dates/edit`}>
                Edit dates
            </Link>

            <p>
                Start date: {startDate} <br />
                End date: {endDate} <br />
            </p>
        </TabContent>
    );
}
export default Dates;
