import React, { useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { Context } from 'State/StateProvider'
import Table from 'Components/Library/Table/Table';
import { Api } from 'State';

const AdvisorList = () => {
    let history = useHistory();

    const [ state, dispatch ] = useContext(Context);

    const editAdvisor = useCallback(id => () => {
        history.push(`/staff/id/${id}/edit`);
    }, [ history ]);

    const deleteAdvisor = useCallback(id => async () => {
        if (window.confirm(`Delete advisor?`)) {
            await Api.Staff.Advisors.Delete(id);
            await Api.Staff.Advisors.Read(dispatch);
        }
    }, [ dispatch ]);

    // TODO this is wrong - admins cannot administrate other admins, only other advisors
    const canEditRole = (row) => (
        state.Session.Role === 'owner' ||
        (state.Session.Role === 'administrator' && row.original.role !== 'owner')
    );

    const columns = [
        {
            accessor: 'email',
            Header: 'Email',
            width: 1,
        },
        {
            accessor: 'name',
            Header: 'Name',
            width: 1,
        },
        {
            accessor: 'role',
            Header: 'Role',
            width: 1,
        },
        {
            accessor: 'actions',
            Header: '',
            width: 0.2,
            Cell: ({ row }) => canEditRole(row) ? (
                <>
                    <button onClick={editAdvisor(row.original.id)} className='ong-openFileIcon'>
                        <EditIcon />
                    </button>
                    <button onClick={deleteAdvisor(row.original.id)} className='ong-openFileIcon'>
                        <DeleteIcon />
                    </button>
                </>
            ) : null,
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

    return (
        <div>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/staff/add` }}><Button>Add advisor</Button></Link>
            </Toolbar>

            {advisors &&
                <Table columns={columns} data={advisors} />
            }
        </div>
    );
}

export default AdvisorList;
