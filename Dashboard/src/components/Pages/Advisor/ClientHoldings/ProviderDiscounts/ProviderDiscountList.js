import { useContext } from 'react';

import { GetReport } from 'Components/ReviewComponents/GetReport';
import Table from 'Components/Library/Table/Table';
import { Context } from 'State';

const PlatformDiscountList = () => {
    const [ state ] = useContext(Context);

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
        <div className='ong-platformDiscounts'>
            <Table
                flexibleColumn = {2}
                columns        = {columns}
                data           = {discounts}
                resource       = {`clients/id/${state.Metadata.Id}/holdings/platform-discounts`}
                label          = 'Platform discount'
            />
        </div>
    );
}

export default PlatformDiscountList;
