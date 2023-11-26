import { useCallback, useContext, useEffect } from 'react';

import { DownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';
import { Api, Context } from 'State';

const ModelList = () => {
    const [ state, dispatch ] = useContext(Context);

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
            cell: ({ row }) => (
                <DownloadChip
                    title  = {row.original.name}
                    fileId = {row.original.fileId}
                />
            ),
        }, {
            id: 'operator',
            header: 'Operator',
            width: 150,
        }, {
            id: 'weightedOcfFee',
            header: 'Weighted OCF Fee',
            width: 150,
        }, {
            id: 'weightedExAnteFee',
            header: 'Weighted Transactional Fee',
            width: 150,
        }, {
            id: 'modified',
            header: 'Last updated',
            width: 150,
            type: 'date',
        },
    ];

    let models = state.Resources.Models.map(m => {
        let op = state.Resources.Operators.find(o => o.Id === m.OperatorId).Name;
        return {
            id:                m.Id,
            name:              m.Name,
            operator:          op,
            weightedOcfFee:    `${m.WeightedOcfFee}%`,
            weightedExAnteFee: `${m.WeightedExAnteFee}%`,
            modified:          m.Modified,
            filename:          m.File?.Filename,
            fileId:            m.File?.Uid,
        };
    });

    return (
        <Table
            flexibleColumn = {1}
            columns        = {columns}
            data           = {models}
            resource       = 'models'
            label          = 'Model'
        />
    );
}

export default ModelList;
