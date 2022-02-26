import React, { useContext, useState } from 'react';
import { useParams,  } from 'react-router-dom';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
} from '@mui/material';

import RichTextEditor from 'components/Widgets/RichTextEditor';

import './EditModule.css';
import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { DefaultModule } from './DefaultModule';
import {
    ModuleTypeFundLevelFees,
    ModuleTypePortfolioLevelFees,
    ModuleTypePolicyValuations,
    ModuleTypeSelectSpec
} from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import PolicyValuations from './Implementations/PolicyValuations/PolicyValuations';
import PortfolioLevelFees from './Implementations/FundFees/PortfolioLevelFees';
import FundLevelFees from './Implementations/FundFees/FundLevelFees';

const EditModule = () => {
    let { clientId, reviewId, module } = useParams();
    clientId = parseInt(clientId);
    reviewId = parseInt(reviewId);

    return EditModuleComponent({
        clientId,
        reviewId,
        module,
    });
}

export const EditModuleComponent = ({ clientId, reviewId, module }) => {
    const [ state, dispatch ] = useContext(Context);

    let [ moduleState, setModuleState ] = useState(null);
    let preset;

    if (!moduleState || moduleState.Type !== module) {
        let client = state.Clients.find(c => c.Id === clientId);
        let review = client.Reviews.find(r => r.Id === reviewId);
        let draft = review.Modules?.find(m => m.Type === module);

        if (draft) {
            setModuleState(draft);
        } else {
            preset = state.ModulePresets.find(p => p.ModuleType === module);
            if (preset) {
                setModuleState({
                    Type: preset.ModuleType,
                    Intro: preset.Text,
                });
            } else {
                setModuleState({
                    ...DefaultModule,
                    Type: module,
                });
            }
        }
        return;
    }
    preset = state.ModulePresets.find(p => p.ModuleType === module);
    
    const handlers = {
        SetIntro: (html) => { setModuleState({ ...moduleState, Intro: html, }); },
        SetText:  (html) => { setModuleState({ ...moduleState, Text: html, }); },
    };

    let onSubmit = async () => {
        await Api.Clients.ReviewModules.Update(clientId, reviewId, module, moduleState);
        await Api.Clients.ClientDetail.Read(dispatch, clientId);
    };

    let onDelete = async () => {
        await Api.Clients.ReviewModules.Delete(clientId, reviewId, module);
        await Api.Clients.ClientDetail.Read(dispatch, clientId);
        setModuleState(preset ? {
            Type: preset.ModuleType,
            Intro: preset.Text,
        } : DefaultModule);
    }

    let deleteLabel = preset ? 'Reset to preset' : 'Delete'
    let deleteDisabled = preset === undefined && moduleState.Intro === '';  // TODO doesn't disable on first try for some reason..

    return (
        <div className='ong-EditModule'>
            {ModuleTypeSelectSpec[module]}

            {preset &&
                <Card variant='outlined'>
                    <CardHeader subheader="Module Preset" />
                    <CardContent>
                        <div dangerouslySetInnerHTML={{ __html: preset.Text }} />
                    </CardContent>
                </Card>
            }

            <Card variant='outlined'>
                <CardHeader subheader="Intro text" />
                <CardContent>
                    {/* <RichTextEditor initialValue = {moduleState.Intro}
                                    onChange     = {handlers.SetIntro} /> */}
                </CardContent>
            </Card>

            <Card variant='outlined'>
                <CardHeader subheader="Body text" />
                <CardContent>
                    {/* <RichTextEditor initialValue = {moduleState.Text}
                                    onChange     = {handlers.SetText} /> */}
                </CardContent>
            </Card>

            <div className='ong-buttonGroup'>
                <Button disabled={deleteDisabled} variant='outlined' onClick={onDelete}>{deleteLabel}</Button>
                <Button type='submit' variant='contained' onClick={onSubmit}>Update</Button>
            </div>

            {module === ModuleTypePolicyValuations   && <PolicyValuations />}
            {module === ModuleTypeFundLevelFees      && <FundLevelFees />}
            {module === ModuleTypePortfolioLevelFees && <PortfolioLevelFees />}
        </div>
    );
}

export default EditModule;
