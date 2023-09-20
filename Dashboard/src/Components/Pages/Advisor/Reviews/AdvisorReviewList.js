import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import Table from 'Components/Library/Table/Table';
import { Api } from 'State';
import { Context } from 'State/StateProvider';
import { FromCanonical } from 'Utils/DateTime';
import TabContent from 'Components/Library/TabContent/TabContent';
import PageTitle from 'Components/Library/PageTitle/PageTitle';

const AdvisorReviewList = () => {
    const [ state, dispatch ] = useContext(Context);

    let { clientId } = useParams();
    let client = state.Clients.find(c => c.Id === clientId);

    const publishReview = async () => {
        await Api.Advisor.Reviews.Publish(clientId, state.Draft.Id);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
    };

    const columns = [{
        id: 'startDate',
        header: 'Review period start', 
        width: 300,
    }, {
        id: 'endDate',
        header: 'Review period end', 
        width: 300,
    }, {
        id: 'finalizedDate',
        header: 'Published', 
    }];

    let ix = 1;
    let reviews = state.Reviews.map(review => {
        return {
            id:            review.Id,
            ix:            ix++,
            idLabel:       `#${review.Id}`,
            date:          review.Meta.FinalizedDate,
            startDate:     FromCanonical(review.Meta.StartDate)?.toLocaleDateString('en-GB'),
            endDate:       FromCanonical(review.Meta.EndDate)?.toLocaleDateString('en-GB'),
            finalizedDate: FromCanonical(review.Meta.FinalizedDate)?.toLocaleString('en-GB'),
            // state:         review.Meta.State,
        };
    }).sort((p,q) => (p.ix < q.ix) ? 1 : ((p.ix > q.ix) ? -1 : 0));

    return (
        <>
            <PageTitle title={`Published reviews | ${client.Identity.Forenames} ${client.Identity.Surname} | Amplifa`} />
        
            <TabContent>
                <Table
                    flexibleColumn  = {3}
                    columns         = {columns}
                    data            = {reviews}
                    label           = 'Publish Draft'
                    enableEdit      = {false}
                    defaultAction   = {id => `/clients/id/${clientId}/reviews/id/${id}/modules/introduction`}
                    deleteAction    = {row => `/clients/id/${clientId}/reviews/delete/${row.id}`}
                    toolbarCallback = {publishReview}
                />
            </TabContent>
        </>
    );
}

export default AdvisorReviewList;
