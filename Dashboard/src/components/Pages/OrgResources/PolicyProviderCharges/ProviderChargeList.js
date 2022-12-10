import React, { useContext, useCallback } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
    Button,
    Toolbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { GoBack } from 'Utils/Routing';

import { Context, Api } from 'State'
import ReorderableTable from 'Components/Library/Table/SortableTable';
import { PROVIDER_CHARGE_REORDER } from 'State/Reducer';

const ProviderChargeList = () => {
    let history = useHistory();
    let goBack = GoBack(history);
    const [ state, dispatch] = useContext(Context);

    let { policyProviderId } = useParams();

    const onDelete = useCallback(id => async () => {
        if (window.confirm(`Delete charge?`)) {
            await Api.OrgResources.ProviderCharges.Delete(id);
            await Api.OrgResources.Entities.Read(dispatch);
        }
    }, [ dispatch ]);

    const onEdit = useCallback(id => () => {
        history.push(`/policy-providers/id/${policyProviderId}/provider-charges/${id}/edit`);
    }, [ history, policyProviderId ]);

    const columns = [
        {
            accessor: 'desc',
            Header: 'Tier (£)',
            width: 200,
        }, {
            accessor: 'charge',
            Header: 'Annual Fee (%)',
            width: 100,
        }, {
            accessor: 'actions',
            Header: '',
            width: 100,
            Cell: ({ row }) => (
                <>
                    <button onClick={onEdit(row.original.id)} className='ong-openFileIcon'>
                        <EditIcon />
                    </button>
                    <button onClick={onDelete(row.original.id)} className='ong-openFileIcon'>
                        <DeleteIcon />
                    </button>
                </>
            ),
        },
    ];
    
    let providerCharges = state.Resources.ProviderCharges
        .filter(pc => pc.ProviderId === policyProviderId)
        .map(m => ({
                id:     m.Id,
                desc:   m.Desc,
                charge: m.Charge,
                seq:    m.Sequence,
            })
        ).sort((a, b) => (
            a.seq > b.seq ? 1 : ((a.seq < b.seq) ? -1 : 0)
        ));

    let reorderCallback = async (from, to) => {
        dispatch({
            type: PROVIDER_CHARGE_REORDER,
            payload: {
                providerId: policyProviderId,
                from,
                to,
            },
        });

        await Api.OrgResources.ProviderCharges.Reorder(policyProviderId, from, to);
        await Api.OrgResources.Entities.Read(dispatch);
    };

    return (
        <Dialog open={true} onClose={goBack}>
            <DialogTitle>Provider charges</DialogTitle>
                <DialogContent>

                    {/* <DialogContentText> */}
                        
                    <Toolbar className="breadcrumb-action">
                        <Link to={{ pathname: `/policy-providers/id/${policyProviderId}/provider-charges/add` }}><Button>Add new charge</Button></Link>
                    </Toolbar>

                    <ReorderableTable columns   = {columns}
                                      data      = {providerCharges}
                                      reorderFn = {reorderCallback} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Return to provider</Button>
                </DialogActions>
        </Dialog>
    );
}

export default ProviderChargeList;
