import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import ConfirmationDialog from "./ConfirmationDialog"
import { GoBack } from 'Utils/Routing';

export interface Response {
    error: string,
    resources?: string[],
};

export const DeletionConfirmation = (props: {
    handler: (execute: boolean) => {
        error: string,
        resources: null,
    },
    dryRun?: boolean,
    label: string,
    warning: string,
    prompt: string,
    dependents: string,
}) => {
    let history = useHistory();
    let goBack = GoBack(history);

    let [ response, setResponse ] = useState(null as Response | null | boolean);

    let { handler } = props;

    let dryRun = useCallback(async () => {
        if (props.dryRun === false) {
            setResponse(true);
            return;
        }
        let res = await handler(false);
        // @ts-ignore
        setResponse(res.data ? res.data : true);  // res.data is a list of dependencies; true if no dependencies
    }, [ handler, props.dryRun ] );

    useEffect(() => {
        dryRun();
        // eslint-disable-next-line
    }, []);

    const onDelete = async (e: any) => {
        await props.handler(true);
        goBack();
        return false;
    };

    let ix = 0;
    let content = response ? (
        typeof response !== 'boolean' && response.resources ? (  // response is false if no dependencies (no API request)
            <>
                {props.warning}
                {response.error && response.resources && (
                    <ul>
                        {response?.resources?.map((e: string) => (
                            <li key={ix++}>
                                {e}
                            </li>
                        ))}
                    </ul>
                )}
                {props.prompt} {props.dependents}?
            </>
        ) : (  // no dependencies
            <>
                {props.prompt}?
            </>
        )
    ) : (
        <p><i>Loading...</i></p>
    );

    return (
        <ConfirmationDialog
            label      = {props.label}
            okCallback = {onDelete}
            content    = {content}
        />
    )
}
