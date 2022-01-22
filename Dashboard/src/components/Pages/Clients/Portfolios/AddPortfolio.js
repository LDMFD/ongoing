import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'StateProvider'
import { POPULATE_CLIENT } from 'Reducer';
import { DefaultPortfolio } from './DefaultPortfolio';
import PortfolioDialog from './PortfolioDialog';
import { GoBack } from 'Utils';

const AddPortfolio = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    const [, dispatch] = useContext(Context);

    let [ portfolio, setPortfolio ] = useState(DefaultPortfolio);

    const submitHandler = (e) => {
        e.preventDefault();
        if (portfolio.Proportion === '') {
            portfolio.Proportion = 1;
        }
        window.ApiClient.post(`/clients/${clientId}/portfolios`, {
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
        <PortfolioDialog portfolio     = {portfolio}
                         setPortfolio  = {setPortfolio}
                         submitLabel   = 'Add'
                         submitHandler = {submitHandler}  />
    );
}

export default AddPortfolio;
