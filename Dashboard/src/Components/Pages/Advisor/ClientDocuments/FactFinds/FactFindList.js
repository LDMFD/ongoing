import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import Day from 'dayjs';

import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Context } from 'State/StateProvider';
import Table from 'Components/Library/Table/Table';
import { BuildDownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import PageTitle from 'Components/Library/PageTitle/PageTitle';

const FactFindList = () => {
    const [ state ] = useContext(Context);

    let { clientId } = useParams();
    let client = state.Clients.find(c => c.Id === clientId);

    let report = GetReport();

    const columns = [{
        id: 'submitted',
        header: 'Submitted',
    }];

    let factFinds = report.FactFinds.map(ff => {
        return {
            id:        ff.Id,
            submitted: Day(ff.Submitted).utc(false).format('DD-MM-YYYY'),
            fileId:    ff.File.Uid,
        };
    }).sort((p,q) => (p.submitted < q.submitted) ? -1 : ((p.submitted > q.submitted) ? 1 : 0));

    return (
        <>
            <PageTitle title={`Fact finds | ${client.Identity.Forenames} ${client.Identity.Surname} | Amplifa`} />

            <Table
                flexibleColumn        = {2}
                columns               = {columns}
                data                  = {factFinds}
                resource              = {`clients/id/${state.Metadata.Id}/documents/fact-finds`}
                label                 = 'Fact Find'
                defaultActionHeader   = 'Download'
                defaultActionRenderer = {BuildDownloadChip('Fact Find')}
            />
        </>
    );
}

export default FactFindList;
