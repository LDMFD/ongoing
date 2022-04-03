import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import PortfolioDialog from './PortfolioDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditPortfolio = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ portfolio, setPortfolio ] = useState(null);

    let { portfolioId } = useParams();

    let client = state.ClientContext;

    if (!portfolio) {
        setPortfolio(state.Report.Portfolios.find(h => h.Id === portfolioId))
        return;
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        if (portfolio.Proportion === '') {
            portfolio.Proportion = 1;
        }
        await Api.Clients.Portfolios.Update(client.Id, portfolio)
        await Api.Clients.ClientDetail.Read(dispatch, client.Id)
        goBack();
        return false;
    };

    return (
        <PortfolioDialog portfolio     = {portfolio}
                         setPortfolio  = {setPortfolio}
                         submitLabel   = 'Update'
                         submitHandler = {submitHandler}  />
    );
}

export default EditPortfolio;
