import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultFactFind } from './DefaultFactFind';
import FactFindDialog from './FactFindDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddFactFind = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);

    let { clientId } = useParams();
    
    const submitHandler = async (factFind) => {
        await Api.Advisor.FactFinds.Create(clientId, factFind);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
    };
    
    return (
        <FactFindDialog factFind      = {DefaultFactFind}
                        state         = {state}
                        submitLabel   = 'Add'
                        submitHandler = {submitHandler}  />
    );
}

export default AddFactFind;
