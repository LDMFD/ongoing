import { useCallback, useContext, useEffect } from 'react';

import Table from 'Components/Library/Table/Table';
import { Api, Context } from 'State';
import { FromCanonical } from 'Utils/DateTime';
import { DownloadChip } from 'Components/Library/FileHandling/FileDownloader';

const FundList = () => {
    const [ state, dispatch] = useContext(Context);

    const sync = useCallback(() => {
        Api.OrgResources.Entities.Read(dispatch)
    }, [ dispatch ]);

    useEffect(() => {
        sync();
    }, [ sync ]);
    
    const columns = [
        {
            id: 'name',
            header: 'Name',
            Cell: ({ row }) => (
                <DownloadChip
                    title  = {row.original.name}
                    fileId = {row.original.fileId}
                />
            ),
        }, {
            id: 'ocfFee',
            header: 'OCF Fee',
            width: 200,
        }, {
            id: 'exAnteFee',
            header: 'Transactional Fee',
            width: 200,
        }, {
            id: 'modified',
            header: 'Last updated',
            width: 200,
        },
    ];
    
    let funds = state.Resources.Funds.map(f => {
        return {
            id:        f.Id,
            name:      f.Name,
            ocfFee:    `${f.OcfFee}%`,
            exAnteFee: `${f.ExAnteFee}%`,
            modified:  FromCanonical(f.Modified)?.toLocaleDateString('en-GB'),
            filename:  f.File?.Filename,
            fileId:   f.File?.Uid,
        };
    });

    return (
        <Table
            flexibleColumn = {1}
            columns        = {columns}
            data           = {funds}
            resource       = 'funds'
            label          = 'Fund'
        />
    );
}

export default FundList;
