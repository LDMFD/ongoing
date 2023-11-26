import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { BuildDownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Context } from 'State/StateProvider';
import PageTitle from 'Components/Library/PageTitle/PageTitle';

const ForecastList = () => {
    const [ state ] = useContext(Context);

    let { clientId } = useParams();
    let client = state.Clients.find(c => c.Id === clientId);

    let report = GetReport();

    const columns = [{
        id: 'submitted',
        header: 'Submitted',
        type: 'date',
    }];

    let forecasts = report.Forecasts.map(ff => {
        return {
            id:        ff.Id,
            submitted: ff.Submitted,
            fileId:    ff.File.Uid,
        };
    }).sort((p,q) => (p.submitted < q.submitted) ? -1 : ((p.submitted > q.submitted) ? 1 : 0));

    return (
        <>
            <PageTitle title={`Forecasts | ${client.Identity.Forenames} ${client.Identity.Surname} | Amplifa`} />

            <Table
                flexibleColumn        = {2}
                columns               = {columns}
                data                  = {forecasts}
                resource              = {`clients/id/${state.Metadata.Id}/documents/forecasts`}
                label                 = 'Forecast'
                defaultActionHeader   = 'Download'
                defaultActionRenderer = {BuildDownloadChip('Forecast')}
            />
        </>
    );
}

export default ForecastList;
