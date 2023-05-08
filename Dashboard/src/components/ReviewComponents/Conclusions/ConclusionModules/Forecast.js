import Day from 'dayjs';
import React, { useCallback } from 'react';

import { DownloadChip } from 'Components/Library/FileHandling/FileDownloader';
import Panel from 'Components/Library/Panel/Panel';
import TabContent from 'Components/Library/TabContent/TabContent';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { ModuleTypeForecast } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';

const Forecast = () => {
    let report = GetReport();

    let forecast = report.Forecasts.map(ff => {
        return {
            id:        ff.Id,
            submitted: ff.Submitted,
            file:      ff.File,
        };
    }).sort((p,q) => (p.submitted > q.submitted) ? -1 : ((p.submitted < q.submitted) ? 1 : 0))[0];

    let date = Day(forecast.submitted).utc(false).format('DD-MM-YYYY');

    return (
        <TabContent>
            <Module module={ModuleTypeForecast} />

            {forecast &&
                <Panel>
                    Download fact find submitted {date}: <DownloadChip
                        title  = {forecast.file.Filename}
                        fileId = {forecast.file.Uid}
                    />
                </Panel>
            }
        </TabContent>
    );
}

export default Forecast;
