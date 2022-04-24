import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import FactFindDialog from './FactFindDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditFactFind = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ factFind, setFactFind ] = useState(null);

    let { factFindId } = useParams();

    let client = state.ClientContext;

    if (!factFind) {
        setFactFind(state.Report.FactFinds.find(h => h.Id === factFindId))
        return;
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Clients.FactFinds.Update(client.Id, factFind)
        await Api.Clients.ClientDetail.Read(dispatch, client.Id)
        goBack();
        return false;
    };

    return (
        <FactFindDialog factFind      = {factFind}
                        setFactFind   = {setFactFind}
                        submitLabel   = 'Update'
                        submitHandler = {submitHandler}  />
    );
}

export default EditFactFind;
