import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Context } from 'Store'
import { SET_PORTFOLIOS } from 'Reducer';
import PortfolioDialog from './PortfolioDialog';
import { GoBack } from 'Utils';

const EditPortfolio = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ portfolio, setPortfolio ] = useState(null);

    let { portfolioId } = useParams();
    portfolioId = parseInt(portfolioId);

    if (!portfolio) {
        let p = state.portfolios.find(p => p.Id === portfolioId);
        if (!p) {
            return <>Portfolio not found</>;
        }
        setPortfolio(p)
        return;
    }

    const submitHandler = (e) => {
        e.preventDefault();
        window.ApiClient.put(`/portfolios/${portfolio.Id}`, {
            ...portfolio,
            FileUid: portfolio?.File?.Uid,
        })
        .then(() => {
            goBack();
        })
        .then(_ => {
            window.ApiClient.get("/portfolios").then(res => {
                dispatch({
                    type: SET_PORTFOLIOS,
                    payload: res.data,
                })
            })
        });
        return false;
    };

    return (
        <PortfolioDialog portfolio     = {portfolio}
                         setPortfolio  = {setPortfolio}
                         submitLabel   = 'Update'
                         submitHandler = {submitHandler} />
    );
}

export default EditPortfolio;
