import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultFactFind } from './DefaultFactFind';
import FactFindDialog from './FactFindDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddFactFind = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);
    let [ factFind, setFactFind ] = useState(DefaultFactFind);

    let { clientId } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Advisor.FactFinds.Create(clientId, factFind);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
        return false;
    };
    
    return (
        <FactFindDialog factFind      = {factFind}
                        setFactFind   = {setFactFind}
                        submitLabel   = 'Add'
                        submitHandler = {submitHandler}  />
    );
}

export default AddFactFind;
