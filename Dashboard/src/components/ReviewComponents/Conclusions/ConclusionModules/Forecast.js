import React, { useCallback } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import Day from 'dayjs';

import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Download } from 'Components/Library/FileHandling/FileDownloader';
import { ModuleTypeForecast } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';

const Forecast = () => {
    let report = GetReport();

    const downloadFile = useCallback(fileUid => () => {
        Download(fileUid);
    }, []);

    let forecast = report.Forecasts.map(ff => {
        return {
            id:        ff.Id,
            submitted: Day(ff.Submitted).format('DD-MM-YYYY'),
            file:      ff.File,
        };
    }).sort((p,q) => (p.submitted > q.submitted) ? -1 : ((p.submitted < q.submitted) ? 1 : 0))[0];

    return (
        <>
            <br />
            <ModuleWrapper module={ModuleTypeForecast} />

            {forecast &&
                <p>
                    Submitted: {Day(forecast.Submitted).format('DD-MM-YYYY')}

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
