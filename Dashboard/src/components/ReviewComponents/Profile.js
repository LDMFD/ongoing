import React, { useContext } from 'react';

import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { ModuleTypeProfile } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { Context } from 'State';

const Profile = () => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

    return (
        <div>
            <Module client = {client}
                    module = {ModuleTypeProfile} />
        </div>
    );
}

export default Profile;
