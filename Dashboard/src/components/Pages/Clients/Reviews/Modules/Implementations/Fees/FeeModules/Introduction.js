import React, {  } from 'react';
import { useParams,  } from 'react-router-dom';
import {
    // Paper,
} from '@mui/material';
import { ModuleTypeFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { ModuleEditor } from '../../../EditModule';

const Introduction = () => {
    let { clientId, reviewId } = useParams();
    clientId = parseInt(clientId);
    reviewId = parseInt(reviewId);

    return (
        <>
            <br />
            <ModuleEditor clientId = {clientId}
                          reviewId = {reviewId}
                          module   = {ModuleTypeFees} />
        </>
    );
}

export default Introduction;
