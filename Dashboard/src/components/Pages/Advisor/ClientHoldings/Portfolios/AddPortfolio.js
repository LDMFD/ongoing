import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultPortfolio } from './DefaultPortfolio';
import PortfolioDialog from './PortfolioDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddPortfolio = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    let { clientId } = useParams();

    const [ state, dispatch ] = useContext(Context);

    const submitHandler = async (portfolio) => {
        await Api.Advisor.Portfolios.Create(clientId, portfolio);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
    };
    
    return (
        <PortfolioDialog portfolio     = {DefaultPortfolio}
                         state         = {state}
                         submitLabel   = 'Add'
                         submitHandler = {submitHandler}  />
    );
}

export default AddPortfolio;
