import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'StateProvider'
import { POPULATE_CLIENT } from 'Reducer';
import PortfolioDialog from './PortfolioDialog';
import { GoBack } from 'Utils';

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
    const submitHandler = (e) => {
        e.preventDefault();
        if (portfolio.Proportion === '') {
            portfolio.Proportion = 1;
        }
        window.ApiClient.put(`/clients/${clientId}/portfolios/${portfolioId}`, {
            ...portfolio
        }).then(_ => {
            return window.ApiClient.get(`/clients/${clientId}`).then(res => {
                dispatch({
                    type: POPULATE_CLIENT,
                    payload: res.data,
                })
            }).then(goBack);;
        });
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
