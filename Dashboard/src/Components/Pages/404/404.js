import React from "react";
import { useLocation } from "react-router-dom";

const Landing = () => <></>;

function NoMatch() {
    let location = useLocation();

    return location.pathname === '/' ? <Landing /> :
        (
            <center>
                <h3>
                    Oh no! Page not found.
                </h3>
                {/* <code>{location.pathname}</code> */}
                <p><a href='/'>Back to the start</a>.</p>
            </center>
        );
}

export default NoMatch;
