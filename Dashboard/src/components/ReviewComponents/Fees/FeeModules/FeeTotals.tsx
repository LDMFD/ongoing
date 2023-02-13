import React, { useContext } from 'react';

import { GetReport } from 'Components/ReviewComponents/GetReport';
import { CalculatePlatformModel } from '../Model/FeeModel';
import { Context } from 'State';

import GrandTotals from './Totals/GrandTotals';
import PlatformTotals from './Totals/PlatformTotals';
import PolicyTotals from './Totals/PolicyTotals';

const FeeTotals = () => {
    const [ state ]: any = useContext(Context);    

    let report = GetReport();

    let view = CalculatePlatformModel(report, state);

    return (
        <>
            {report.Policies.length > 1 &&
                <GrandTotals
                    report         = {report}
                    view           = {view}
                    weightedAvgFee = {view.WeightedFees * 100}
                    totalCharges   = {view.TotalPlatformCharge}
                />
            }

            {view.Providers.length > 1 &&
                <PlatformTotals
                    report = {report}
                    view   = {view}
                />
            }

            {report.Policies.length > 0 &&
                <PolicyTotals
                    view   = {view}
                    report = {report}
                />
            }
        </>
    );
}

export default FeeTotals;
