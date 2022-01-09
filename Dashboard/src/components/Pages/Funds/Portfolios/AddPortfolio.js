import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'Store'
import { SET_PORTFOLIOS } from 'Reducer';
import { DefaultPortfolio } from './Portfolio';
import PortfolioDialog from './PortfolioDialog';
import { GoBack } from 'Utils';

const AddPortfolio = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);

    let [ portfolio, setPortfolio ] = useState(DefaultPortfolio);

    const submitHandler = () => {
        window.ApiClient.post("/portfolios", {
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
                         submitLabel   = 'Add'
                         submitHandler = {submitHandler}  />
    );
}

export default AddPortfolio;
