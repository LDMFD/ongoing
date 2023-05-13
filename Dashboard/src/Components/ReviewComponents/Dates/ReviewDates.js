import React, { useCallback, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import Panel from 'Components/Library/Panel/Panel';
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
            <Panel>
                <p>
                    This review covers the period from {startDate} to {endDate}.
                </p>

                <Link to={`/clients/id/${clientId}/modules/dates/edit`}>
                    Edit
                </Link> the date range for this review.
            </Panel>
        </TabContent>
    );
}
export default Dates;
