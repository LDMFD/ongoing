import React, { useContext } from 'react';

import { Context } from 'State/StateProvider'
import Table from 'Components/Library/Table/Table';

const AdvisorList = () => {
    const [ state ] = useContext(Context);

    // TODO this is wrong - admins cannot administrate other admins, only other advisors
    // const canEditRole = (row) => (
    //     state.Session.Role === 'owner' ||
    //     (state.Session.Role === 'administrator' && row.original.role !== 'owner')
    // );

    const columns = [
        {
            id: 'email',
            header: 'Email',
        },
        {
            id: 'name',
            header: 'Name',
            width: 300,
        },
        {
            id: 'role',
            header: 'Role',
            width: 200,
        },
    ];

    let advisors = state.Advisors?.map(o => {
        return {
            id: o.Id,
            email: o.Email,
            name: `${o.Surname}, ${o.Forenames}`,
            role: o.Role,
        };
    }).sort((p,q) => (p.email < q.email) ? -1 : ((p.email > q.email) ? 1 : 0));

    return advisors && (
        <Table
            flexibleColumn = {1}
            columns        = {columns}
            data           = {advisors}
            resource       = 'staff'
            label          = 'Advisor'
        />
    );
}

export default AdvisorList;
