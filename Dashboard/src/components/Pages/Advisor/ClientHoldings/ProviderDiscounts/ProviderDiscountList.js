import React, { useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Toolbar,
} from '@mui/material';

import { Api } from 'State';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Context } from 'State/StateProvider'
import Table from 'Components/Library/Table';

const ProviderDiscountList = () => {
    let history = useHistory();

    const [state, dispatch ] = useContext(Context);
    let {
        ClientContext: client,
    } = state;

    let report = GetReport();

    const deleteProviderDiscount = useCallback(id => async () => {
        if (window.confirm(`Delete provider discount?`)) {
            await Api.Advisor.ProviderDiscounts.Delete(client.Id, id);
            await Api.Advisor.ClientDetail.Read(dispatch, client.Id);
        }
    }, [ dispatch, client.Id ]);

    const editProviderDiscount = useCallback(id => () => {
        history.push(`/clients/id/${client.Id}/holdings/provider-discounts/id/${id}/edit`);
    }, [ history, client.Id ]);

    const columns = [
        {
            accessor: 'provider',
            Header: 'Provider',
            width: 1,
        }, {
            accessor: 'discount',
            Header: 'Discounted platform fee',
            width: 1,
        }, ];

    columns.push({
        accessor: 'actions',
        Header: '',
        width: 1,
        Cell: ({ row }) => (
            <>
                <button onClick={editProviderDiscount(row.original.id)} className='ong-openFileIcon'>
                    <EditIcon />
                </button>
                <button onClick={deleteProviderDiscount(row.original.id)} className='ong-openFileIcon'>
                    <DeleteIcon />
                </button>
            </>
        ),
    });

    let discounts = report.ProviderDiscounts.map(discount => {
        let provider = report.PolicyProviders.find(t => t.Id === discount.PolicyProviderId).Name;

        return {
            id:       discount.Id,
            discount: `${discount.Discount}%`,
            provider,
        };
    }).sort((p,q) => (p.provider < q.provider) ? -1 : ((p.provider > q.provider) ? 1 : 0));

    return (
        <div className='ongoing-providerDiscountList'>
            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${state.ClientContext.Id}/holdings/provider-discounts/add` }}><Button>Add Provider Discount</Button></Link>
            </Toolbar>

            <Table columns={columns} data={discounts} />
        </div>
    );
}

export default ProviderDiscountList;
