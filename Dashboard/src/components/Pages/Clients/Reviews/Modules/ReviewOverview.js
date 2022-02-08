import React, {  } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

import './Review.css';
import { ModuleTypeSelectSpec } from 'State/ApiCommands/Global/Reviews/ModuleTypes';

const ReviewOverview = () => {
    let history = useHistory();

    let { clientId, reviewId, module } = useParams();
    clientId = parseInt(clientId);
    reviewId = parseInt(reviewId);

    const openReviewModule = (mod) => {
        history.push(`/clients/id/${clientId}/reviews/id/${reviewId}/modules/${mod}/edit`);
    };

    var width = ModuleTypeSelectSpec.map(t => t.label.length).reduce((a, b) => Math.max(a, b), -Infinity);

    return (
        <div className='review'>
            <FormControl sx={{ width: `${width}ch` }}>
                <InputLabel id='module-select'>Module</InputLabel>
                <Select labelId  = 'module-select'
                        value    = {module || ''}
                        onChange = {(e) => openReviewModule(e.target.value)}
                        margin   = "dense"
                        id       = "type"
                        label    = "Module"
                        type     = "text">
                            {ModuleTypeSelectSpec.map(m => (
                                <MenuItem value={m.id} key={m.id}>
                                    {m.label}
                                </MenuItem>
                            ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default ReviewOverview;
