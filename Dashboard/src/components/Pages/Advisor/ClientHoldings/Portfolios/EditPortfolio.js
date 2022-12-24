import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import PortfolioDialog from './PortfolioDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditPortfolio = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { portfolioId } = useParams();

    let client = state.Metadata;

    const submitHandler = async (portfolio) => {
        await Api.Advisor.Portfolios.Update(client.Id, portfolio)
        await Api.Advisor.ClientDetail.Read(dispatch, client.Id)
        goBack();
    };

    let portfolio = state.Report.Portfolios.find(h => h.Id === portfolioId);

    return (
        <PortfolioDialog portfolio     = {portfolio}
                         state         = {state}
                         submitLabel   = 'Update'
                         submitHandler = {submitHandler}  />
    );
}

export default EditPortfolio;
