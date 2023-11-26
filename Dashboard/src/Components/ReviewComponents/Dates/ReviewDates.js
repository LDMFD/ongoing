import React, { useCallback, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import Panel from 'Components/Library/Panel/Panel';
import TabContent from 'Components/Library/TabContent/TabContent';
import { Api } from 'State';
import { Context } from 'State/StateProvider';
import { FromCanonical } from 'Utils/DateTime';
import PageTitle from 'Components/Library/PageTitle/PageTitle';

const Dates = () => {
    const [ state, dispatch ] = useContext(Context);

    let { clientId } = useParams();
    let client = state.Clients.find(c => c.Id === clientId);

    const sync = useCallback(() => {
        Api.Advisor.ClientDetail.Read(dispatch, clientId);
    }, [ dispatch, clientId ]);

    useEffect(() => {
        sync();
    }, [ sync ]);

    let draft = state.Draft;

    let startDate = FromCanonical(draft.StartDate);
    let endDate =   FromCanonical(draft.EndDate);

    return (
        <TabContent>
            <PageTitle title={`Edit review dates | ${client.Identity.Forenames} ${client.Identity.Surname} | Amplifa`} />

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
