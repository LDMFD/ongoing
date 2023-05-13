import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Table from 'Components/Library/Table/Table';
import { Context } from 'State';
import { GoBack } from 'Utils/Routing';
import { FormatCurrencyPence } from 'Utils/Strings';

const ProviderChargeList = () => {
    let history = useHistory();
    let goBack = GoBack(history, 3);
    const [ state ] = useContext(Context);

    let { policyProviderId } = useParams();

     const columns = [{
        id: 'boundary',
        header: 'Range',
    }, {
        id: 'charge',
        header: 'Annual Fee',
    }];
    
    let charges = state.Resources.ProviderCharges;

    charges = charges
        .filter(pc => pc.ProviderId === policyProviderId);

    charges = charges.map((m, ix) => {
        let lower = FormatCurrencyPence(m.Boundary);
        let upper = ix < charges.length-1
            ? FormatCurrencyPence(charges[ix+1].Boundary-1)
            : '';
        return {
            id:       m.Id,
            charge:   `${m.Charge}%`,
            boundary: upper ? `${lower} - ${upper}` : `> ${lower}`,
        };
    });

    return (
        <Dialog
            open      = {true}
            onClose   = {goBack}
            fullWidth = {true}
        >
            <DialogTitle>Provider charges</DialogTitle>
                <DialogContent>

                    <Table
                        columns  = {columns}
                        data     = {charges}
                        label    = "provider charge"
                        resource = {`platforms/id/${policyProviderId}/provider-charges`}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={goBack}>Close</Button>
                </DialogActions>
        </Dialog>
    );
}

export default ProviderChargeList;
