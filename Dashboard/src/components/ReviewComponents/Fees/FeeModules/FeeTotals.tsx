import React, { useContext } from 'react';

import { GetReport } from 'Components/ReviewComponents/GetReport';
import { CalculatePlatformModel } from '../Model/FeeModel';
import { Context } from 'State';
import GrandTotals from './Totals/GrandTotals';
import PlatformTotals from './Totals/PlatformTotals';
import PolicyTotals from './Totals/PolicyTotals';
import { ModuleTypeFeeTotals } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import TabContent from 'Components/Library/TabContent/TabContent';

const FeeTotals = () => {
    const [ state ]: any = useContext(Context);    

    let report = GetReport();

    let view = CalculatePlatformModel(report, state);

    return (
        <TabContent>
            <Module module={ModuleTypeFeeTotals} client={null} />
        
            {report.Policies.length > 1 &&
                <>
                    <GrandTotals
                        report         = {report}
                        view           = {view}
                        weightedAvgFee = {view.WeightedFees * 100}
                        totalCharges   = {view.TotalPlatformCharge}
                    />
                    <br />
                </>
            }

            {view.Providers.length > 1 &&
                <>
                    <PlatformTotals
                        report = {report}
                        view   = {view}
                    />
                    <br />
                </>
            }

            {report.Policies.length > 0 &&
                <PolicyTotals
                    view   = {view}
                    report = {report}
                />
            }
        </TabContent>
    );
}

export default FeeTotals;
