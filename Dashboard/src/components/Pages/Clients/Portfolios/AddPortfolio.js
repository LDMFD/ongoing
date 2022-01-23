import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultPortfolio } from './DefaultPortfolio';
import PortfolioDialog from './PortfolioDialog';
import { GoBack } from 'Utils';
import { Client } from 'State';

const AddPortfolio = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    const [, dispatch] = useContext(Context);

    let [ portfolio, setPortfolio ] = useState(DefaultPortfolio);

    const submitHandler = (e) => {
        e.preventDefault();
        Client.Client.Portfolios.Create(clientId, portfolio)
            .then(() => {
                goBack();
            })
            .then(async () => {
                await Client.Client.ClientDetail.Read(dispatch, clientId);
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
