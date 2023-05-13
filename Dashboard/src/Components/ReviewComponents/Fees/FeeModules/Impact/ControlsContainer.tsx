import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Api } from 'State';
import { Button, Stack } from '@mui/material';
import { ChartControls, CheckboxControls } from './ImpactControls';

import { Context } from 'State';
import { ImpactForm } from './Form';
import { Limits } from './ImpactModel';

const ControlsContainer = (props: {
    options: any,
    control: any,
    input: ImpactForm,
    setValue: any,
    handleSubmit: any,
}) => {
    const [ state, dispatch ]: any = useContext(Context);
    let clientId = state.Metadata.Id;

    const { reviewId }: any = useParams();

    const submitHandler = async () => {
        await Api.Advisor.ClientOptions.Set(clientId, {
            InvestmentGrowthRate: props.input.InvestmentGrowthRate,
            CashGrowthRate:       props.input.CashGrowthRate,
            Inflation:            props.input.Inflation,
        });
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
    };

    const deleteHandler = async () => {
        if (window.confirm(`Remove stored configuration of slider positions for this client?`)) {
            await Api.Advisor.ClientOptions.Delete(clientId);
            props.setValue('InvestmentGrowthRate', Limits.InvestmentGrowthRate.default);
            props.setValue('CashGrowthRate', Limits.CashGrowthRate.default);
            props.setValue('Inflation', Limits.Inflation.default);
        }
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
    };

    const resetHandler = async () => {
        props.setValue('InvestmentGrowthRate', Limits.InvestmentGrowthRate.default);
        props.setValue('CashGrowthRate', Limits.CashGrowthRate.default);
        props.setValue('Inflation', Limits.Inflation.default);
    };

    let showPersistenceControls = state.Session.Role !== 'client' && !reviewId;

    return (
        <form onSubmit={props.handleSubmit(submitHandler)}>
            {showPersistenceControls &&
                <div className='ong-pageControls'>
                    <Stack spacing={2} direction="row">
                        <Button
                            variant = 'outlined'
                            onClick = {resetHandler}
                        >
                            Load system defaults
                        </Button>
                        <Button
                            variant  = 'outlined'
                            onClick  = {deleteHandler}
                            disabled = {!props.options}
                        >
                            Clear saved configuration
                        </Button>
                        <Button
                            variant = 'contained'
                            type    = 'submit'
                        >
                            Save configuration
                        </Button>
                    </Stack>
                </div>
            }

            <CheckboxControls
                control     = {props.control}
                includeFees = {props.input.IncludeFees}
            />
            <ChartControls
                control          = {props.control}
                inflation        = {props.input.Inflation}
                includeInflation = {props.input.IncludeInflation}
            />
        </form>
    );
}

export default ControlsContainer;
