import React, { useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Toolbar,
} from '@mui/material';

import { Context } from 'State/StateProvider'
import Table from 'Components/Library/Table/Table';
import { Api } from 'State';

const OrgList = () => {
    let history = useHistory();

    const [ state, dispatch ] = useContext(Context);

    const editOrg = useCallback(id => () => {
        history.push(`/admin/organisations/id/${id}/edit`);
    }, [ history ]);

    const deleteOrg = useCallback(id => async () => {
        if (window.confirm(`Delete organisation?`)) {
            await Api.Superuser.Organisations.Delete(id);
            await Api.Superuser.Organisations.Read(dispatch);
        }
    }, [ dispatch ]);

    const columns = [
        {
            accessor: 'name',
            Header: 'Name',
            width: 1,
            Cell: ({ row }) => (
                <>
                    <Link to={{ pathname: `/admin/organisations/id/${row.original.id}/users`}}>
                        {row.original.name}
                    </Link>
                </>
            ),
        },
        {
            accessor: 'owner',
            Header: 'Owner',
            width: 1,
        },
        {
            accessor: 'creator',
            Header: 'Creator',
            width: 1,
        },
        {
            accessor: 'actions',
            Header: '',
            width: 0.2,
            Cell: ({ row }) => (
                <>
                    <button onClick={editOrg(row.original.id)} className='ong-openFileIcon'>
                        <EditIcon />
                    </button>
                    <button onClick={deleteOrg(row.original.id)} className='ong-openFileIcon'>
                        <DeleteIcon />
                    </button>
                </>
            ),
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
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/admin/organisations/add` }}><Button>Add organisation</Button></Link>
            </Toolbar>

            {orgs &&
                <Table columns={columns} data={orgs} />
            }
        </div>
    );
}

export default OrgList;
