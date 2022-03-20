import React, { useContext } from 'react';

import ModuleWrapper from 'components/Pages/Clients/Reviews/Modules/ModuleWrapper';
import { ModuleTypeIntroduction } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { CurrencyFormatter } from 'Utils/Strings';
import { Context } from 'State';

const Introduction = () => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

    let totalStarting = client.Policies.map(p => p.StartValue).reduce((p, q) => p + q, 0);
    let totalEnding   = client.Policies.map(p => p.EndValue).reduce((p, q) => p + q, 0);

    return (
        <div>
            <ModuleWrapper client = {client}
                           module = {ModuleTypeIntroduction} />

            <p>
                Total start value: {CurrencyFormatter.format(totalStarting)}<br />
                Total end value: {CurrencyFormatter.format(totalEnding)}
            </p>

        </div>
    );
}
export default Introduction;
