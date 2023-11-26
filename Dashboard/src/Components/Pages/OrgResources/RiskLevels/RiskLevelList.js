import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { GoBack } from 'Utils/Routing';

import { Context } from 'State'
import Table from 'Components/Library/Table/Table';

const RiskLevelList = () => {
    let history = useHistory();
    let goBack = GoBack(history, 3);
    const [ state ] = useContext(Context);

    let { riskProviderId } = useParams();

    const columns = [
        {
            id: 'level',
            header: 'Level',
            width: 100,
        }, {
            id: 'label',
            header: 'Label',
            width: 220,
        }, {
            id: 'desc',
            header: 'Description',
            cell: ({ row }) => (
                <div className='ong-notes' dangerouslySetInnerHTML={{ __html: row.original.desc }} />
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
        <div className='ong-riskLevels'>
            <Dialog open={true} onClose={goBack} fullWidth={true} maxWidth='lg'>
                <DialogTitle>Provider risk levels</DialogTitle>
                    <DialogContent>

                            <Table
                                flexibleColumn = {3}
                                columns        = {columns}
                                data           = {riskLevels}
                                resource       = {`risk-providers/id/${riskProviderId}/risk-levels`}
                                label          = 'Risk Level'
                            />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={goBack}>Return to provider</Button>
                    </DialogActions>
            </Dialog>
        </div>
    );
}

export default RiskLevelList;
