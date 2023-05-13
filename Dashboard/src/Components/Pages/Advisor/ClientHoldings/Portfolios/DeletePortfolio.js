import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider';

const DeletePortfolio = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ portfolio, setPortfolio ] = useState(null);

    let { clientId, portfolioId } = useParams();

    const onDelete = async (e) => {
        let res = await Api.Advisor.Portfolios.Delete(clientId, portfolioId);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        return res;
    };

    if (!portfolio) {
        let p = state.Report.Portfolios.find(p => p.Id === portfolioId);
        setPortfolio(p)
        return;
    }

    return (
        <ConfirmationDialog label      = 'Delete portfolio?'
                            okCallback = {onDelete}  />
    );
}

export default DeletePortfolio;
