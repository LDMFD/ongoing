import { useContext, useCallback, useEffect } from 'react';

import { Context, Api } from 'State';
import Table from 'Components/Library/Table/Table';
import PageTitle from 'Components/Library/PageTitle/PageTitle';

const ClientList = () => {
    const [ state, dispatch ] = useContext(Context);

    const sync = useCallback(() => {
        Api.Advisor.Clients.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        sync();
    }, [ sync ]);

    const columns = [
        {
            id: 'name',
            header: 'Name',
        }, {
            id: 'email',
            header: 'Email',
            width: 300,
        }, {
            id: 'advisor',
            header: 'Advisor',
            width: 300,
        }, {
            id: 'fee',
            header: 'Fee',
            width: 100,
        },
    ];

    let clients = state.Clients.map(c => {
        let advisor = state.Advisors && state.Advisors.find(a => a.Id === c.AdvisorId);
        return {
            id:       c.Id,
            idLabel:  `#${c.Id}`,
            name:     `${c.Identity.Surname}, ${c.Identity.Forenames}`,
            email:    c.Identity.Email,
            fee:      `${c.Fee}%`,
            advisor:  advisor ? `${advisor.Forenames} ${advisor.Surname}` : <tt>(missing)</tt>,
        };
    });

    return (
        <div className='ong-clientList'>
            <PageTitle title='Clients | Amplifa' />
            
            <Table
                columns          = {columns}
                data             = {clients}
                resource         = 'clients'
                label            = 'Client'
                defaultAction    = {id => `/clients/id/${id}`}
                enableRowActions = {false}
            />
        </div>
    );
}

export default ClientList;
