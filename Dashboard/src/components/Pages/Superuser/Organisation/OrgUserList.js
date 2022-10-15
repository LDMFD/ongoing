import React, { useContext } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import Table from 'Components/Library/Table/Table';

export const OrgUserList = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, ] = useContext(Context);
    let { orgId } = useParams();

    const columns = [
        {
            accessor: 'email',
            Header: 'Email',
            width: 350,
        },
        {
            accessor: 'role',
            Header: 'Role',
            width: 100,
        },
        {
            accessor: 'actions',
            Header: 'View as...',
            width: 100,
            Cell: ({ row }) => (
                <a href={`/?view-as=${row.original.id}`}>
                    <OpenInNewIcon />
                </a>
            ),
        },
    ];

    let org = state.Organisations?.find(o => o.Id === orgId);

    let users = org.Members.map(m => {
        let u = state.Users.find(u => u.Id === m.UserId);
        return {
            id: m.UserId,
            email: `${u.Forenames} ${u.Surname} <${u.Email}>`,
            role: m.Role,
        };
    }).sort((p,q) => (p.email < q.email) ? -1 : ((p.email > q.email) ? 1 : 0));

    return (
        <Dialog open={true} onClose={goBack} fullWidth={true} >
            <DialogTitle>Organisation members</DialogTitle>
            <DialogContent>
            {users &&
                <Table columns={columns} data={users} />
            }
            </DialogContent>
        </Dialog>
    );
};

export default OrgUserList;
