import { useContext } from 'react';

import { Context } from 'State/StateProvider';
import Table from 'Components/Library/Table/Table';

const OrgList = () => {
    const [ state ] = useContext(Context);

    const columns = [
        {
            id: 'name',
            header: 'Name',
            width: 300,
        },
        {
            id: 'owner',
            header: 'Owner',
            width: 300,
        },
        {
            id: 'creator',
            header: 'Creator',
            width: 300,
        },
    ];

    let orgs = state.Organisations?.map(o => {
        let creator = state.Users.find(p => p.Id === o.CreatorId);
        let owner = state.Users.find(p => p.Id === o.OwnerId);
        return {
            id: o.Id,
            name: o.Name,
            owner: `${owner.Forenames} ${owner.Surname} <${owner.Email}>`,
            creator: creator.Email,
        };
    }).sort((p,q) => (p.name < q.name) ? -1 : ((p.name > q.name) ? 1 : 0));

    return (
        <div className='ongoing-orgList'>
            {orgs &&
                <Table
                    columns       = {columns}
                    data          = {orgs}
                    resource      = 'admin/organisations'
                    label         = 'Organisation'
                    defaultAction = {id => `/admin/organisations/id/${id}/users`}
                />
            }
        </div>
    );
}

export default OrgList;
