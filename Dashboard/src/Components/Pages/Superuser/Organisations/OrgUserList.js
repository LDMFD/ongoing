import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import Dialog from 'Components/Library/Dialog/Dialog';
import { Context } from 'State/StateProvider';
import Table from 'Components/Library/Table/Table';

export const OrgUserList = () => {
    const [ state, ] = useContext(Context);
    let { orgId } = useParams();

    const columns = [
        {
            id: 'email',
            header: 'Email',
            width: 350,
        },
        {
            id: 'role',
            header: 'Role',
            width: 100,
        },
    ];

    let org = state.Organisations?.find(o => o.Id === orgId);

    let users = org.Members?.map(m => {
        let u = state.Users.find(u => u.Id === m.UserId);
        return {
            id: m.UserId,
            email: `${u.Forenames} ${u.Surname} <${u.Email}>`,
            role: m.Role,
        };
    }).sort((p,q) =>
        (p.role === 'owner') ? -1 : 
        (q.role === 'owner') ? 1 : 
        (p.role === 'advisor') ? -1 : 
        (q.role === 'advisor') ? 1 : 
        (p.email < q.email) ? -1 : ((p.email > q.email) ? 1 : 0)
    ) || [];

    return (
        <Dialog
            title     = {'Organisation members'}
            intro     = 'View as organisation member'
            fullWidth = {true}
            content = {(
                <Table
                    columns             = {columns}
                    data                = {users}
                    defaultAction       = {id => `/?view-as=${id}`}
                    defaultActionAsLink = {false}
                    enableRowActions    = {false}
                />
            )}
        />
    );
};

export default OrgUserList;
