import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { GetReport } from 'Components/ReviewComponents/GetReport';
import Table from 'Components/Library/Table/Table';
import { Context } from 'State';
import PageTitle from 'Components/Library/PageTitle/PageTitle';

const PlatformDiscountList = () => {
    const [ state ] = useContext(Context);

    let { clientId } = useParams();
    let client = state.Clients.find(c => c.Id === clientId);

    let report = GetReport();

    const columns = [
        {
            id: 'provider',
            header: 'Platform',
            width: 300,
        }, {
            id: 'discount',
            header: 'Discounted platform fee',
        },
    ];

    let discounts = report.ProviderDiscounts.map(discount => {
        let provider = report.PolicyProviders.find(t => t.Id === discount.PolicyProviderId).Name;

        return {
            id:       discount.Id,
            discount: `${discount.Discount}%`,
            provider,
        };
    }).sort((p,q) => (p.provider < q.provider) ? -1 : ((p.provider > q.provider) ? 1 : 0));

    return (
        <>
            <PageTitle title={`Platform discounts | ${client.Identity.Forenames} ${client.Identity.Surname} | Amplifa`} />
            
            <div className='ong-platformDiscounts'>
                <Table
                    flexibleColumn = {2}
                    columns        = {columns}
                    data           = {discounts}
                    resource       = {`clients/id/${state.Metadata.Id}/holdings/platform-discounts`}
                    label          = 'Platform discount'
                />
            </div>
        </>
    );
}

export default PlatformDiscountList;
