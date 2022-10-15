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
import Table from 'Components/Library/Table/Table';

const RiskLevelList = () => {
    let history = useHistory();
    let goBack = GoBack(history);
    const [ state, dispatch] = useContext(Context);

    let { riskProviderId } = useParams();

    const onDelete = useCallback(id => async () => {
        if (window.confirm(`Delete risk level?`)) {
            await Api.OrgResources.RiskLevels.Delete(id);
            await Api.OrgResources.Entities.Read(dispatch);
        }
    }, [ dispatch ]);

    const onEdit = useCallback(id => () => {
        history.push(`/risk-providers/id/${riskProviderId}/risk-levels/${id}/edit`);
    }, [ history, riskProviderId ]);

    const columns = [
        {
            accessor: 'level',
            Header: 'Level',
            width: 100,
        }, {
            accessor: 'label',
            Header: 'Label',
            width: 100,
        }, {
            accessor: 'desc',
            Header: 'Description',
            width: 400,
            Cell: ({ row }) => (
                <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.desc }} />
            ),
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
    
    let riskLevels = state.Resources.RiskLevels
        .filter(rl => rl.RiskProviderId === riskProviderId)
        .map(m => ({
                id:     m.Id,
                level:  m.Level,
                label:  m.Label,
                desc:   m.Desc,
            })
        ).sort((p, q) => (p.level < q.level) ? -1 : ((p.level > q.level) ? 1 : 0));

    return (
        <Dialog open={true} onClose={goBack} fullWidth={true} maxWidth='lg'>
            <DialogTitle>Provider risk levels</DialogTitle>
                <DialogContent>

                    <Toolbar className="breadcrumb-action">
                        <Link to={{ pathname: `/risk-providers/id/${riskProviderId}/risk-levels/add` }}><Button>Add new level</Button></Link>
                    </Toolbar>

                    <Table columns={columns} data={riskLevels} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Return to provider</Button>
                </DialogActions>
        </Dialog>
    );
}

export default RiskLevelList;
