import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Context } from 'Store'
import { SET_PORTFOLIOS } from 'Reducer';
import PortfolioDialog, { GoBack } from './PortfolioDialog';

const EditPortfolio = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ portfolio, setPortfolio ] = useState(null);

    let { portfolioId } = useParams();
    portfolioId = parseInt(portfolioId);

    if (!portfolio) {
        setPortfolio(state.portfolios.find(p => p.Id === portfolioId))
        return;
    }

    const submitHandler = () => {
        window.ApiClient.put(`/portfolios/${portfolio.Id}`, {
            ...portfolio
        }).then(_ => {
            window.ApiClient.get("/portfolios").then(res => {
                dispatch({
                    type: SET_PORTFOLIOS,
                    payload: res.data,
                })
            }).then(goBack);;
        });
    };

    return (
        <PortfolioDialog portfolio     = {portfolio}
                         setPortfolio  = {setPortfolio}
                         submitLabel   = 'Update'
                         submitHandler = {submitHandler}  />
    );
}

export default EditPortfolio;
