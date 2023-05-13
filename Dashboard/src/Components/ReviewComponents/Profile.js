import React, { useContext } from 'react';

import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { ModuleTypeProfile } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import { Context } from 'State';

const Profile = () => {
    const [state,  ] = useContext(Context);
    let client = state.Metadata;

    return (
        <div>
            <Module client = {client}
                    module = {ModuleTypeProfile} />
        </div>
    );
}

export default Profile;
