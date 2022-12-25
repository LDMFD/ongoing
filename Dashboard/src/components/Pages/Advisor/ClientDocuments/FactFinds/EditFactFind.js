import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import FactFindDialog from './FactFindDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditFactFind = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { factFindId } = useParams();

    let client = state.Metadata;

    const submitHandler = async (factFind) => {
        await Api.Advisor.FactFinds.Update(client.Id, factFind)
        await Api.Advisor.ClientDetail.Read(dispatch, client.Id)
        goBack();
    };

    let factFind = state.Report.FactFinds.find(h => h.Id === factFindId);

    return (
        <FactFindDialog factFind      = {factFind}
                        state         = {state}
                        submitLabel   = 'Update'
                        submitHandler = {submitHandler}  />
    );
}

export default EditFactFind;
