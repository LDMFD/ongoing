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

    let { clientId, portfolioId } = useParams();
    clientId = parseInt(clientId);
    portfolioId = parseInt(portfolioId);

    if (!portfolio) {
        let client = state.Clients.find(c => c.Id === clientId);
        setPortfolio(client.Portfolios.find(h => h.Id === portfolioId))
        return;
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        if (portfolio.Proportion === '') {
            portfolio.Proportion = 1;
        }
        await Api.Clients.Portfolios.Update(clientId, portfolio)
        await Api.Clients.ClientDetail.Read(dispatch, clientId)
        goBack();
        return false;
    };

    return (
        <PortfolioDialog portfolio       = {portfolio}
                       setPortfolio    = {setPortfolio}
                       submitLabel   = 'Update'
                       submitHandler = {submitHandler}  />
    );
}

export default EditPortfolio;
