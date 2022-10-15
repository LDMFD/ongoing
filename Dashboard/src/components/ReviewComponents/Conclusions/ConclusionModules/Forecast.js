import React, { useCallback } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import Day from 'dayjs';

import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import { ModuleTypeForecast } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';

const Forecast = () => {
    let report = GetReport();

    const downloadFile = useCallback(fileUid => () => {
        Download(fileUid);
    }, []);

    let forecast = report.Forecasts.map(ff => {
        return {
            id:        ff.Id,
            submitted: Day(ff.Submitted).utc(false).format('DD-MM-YYYY'),
            file:      ff.File,
        };
    }).sort((p,q) => (p.submitted > q.submitted) ? -1 : ((p.submitted < q.submitted) ? 1 : 0))[0];

    return (
        <>
            <br />
            <Module module={ModuleTypeForecast} />

            {forecast &&
                <p>
                    Submitted: {Day(forecast.Submitted).utc(false).format('DD-MM-YYYY')}

                    <br />
                    <button onClick={downloadFile(forecast.file.Uid)} className='ong-openFileIcon'>
                        {forecast.file.Filename}
                        <DownloadIcon />
                    </button>
                </p>
            }
        </>
    );
}

export default Forecast;
