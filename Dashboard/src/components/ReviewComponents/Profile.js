import React, { useContext } from 'react';

import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';
import { ModuleTypeProfile } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { Context } from 'State';

const Profile = () => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

    return (
        <div>
            <ModuleWrapper client = {client}
                           module = {ModuleTypeProfile} />
        </div>
    );
}

export default Profile;
