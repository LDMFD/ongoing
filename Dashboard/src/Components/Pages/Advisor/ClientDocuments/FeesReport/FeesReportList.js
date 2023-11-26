import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { BuildDownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import Table from 'Components/Library/Table/Table';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Context } from 'State/StateProvider';
import PageTitle from 'Components/Library/PageTitle/PageTitle';

const FeesReportList = () => {
    const [ state ] = useContext(Context);

    let { clientId } = useParams();
    let client = state.Clients.find(c => c.Id === clientId);

    let report = GetReport();

    const columns = [{
        id: 'submitted',
        header: 'Submitted',
        type: 'date',
    }];

    let feesReports = report.FeesReports.map(ff => {
        return {
            id:        ff.Id,
            submitted: ff.Submitted,
            fileId:    ff.File.Uid,
        };
    }).sort((p,q) => (p.submitted < q.submitted) ? -1 : ((p.submitted > q.submitted) ? 1 : 0));

    return (
        <>
            <PageTitle title={`Fees | ${client.Identity.Forenames} ${client.Identity.Surname} | Amplifa`} />

            <Table
                flexibleColumn        = {2}
                columns               = {columns}
                data                  = {feesReports}
                resource              = {`clients/id/${state.Metadata.Id}/documents/fees-reports`}
                label                 = 'Fee Report'
                defaultActionHeader   = 'Download'
                defaultActionRenderer = {BuildDownloadChip('Fee Report')}
            />
        </>
    );
}

export default FeesReportList;
