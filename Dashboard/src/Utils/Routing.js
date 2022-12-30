import { matchPath } from 'react-router-dom';

export const GoBack = (history, depth) => (e) => {
    if (e) {
        e.stopPropagation();
    }
    if (!depth) {
        depth = 1;
    }
    let url = window.location.pathname;
    while (depth-- > 0) {
        url = url.substring(0, url.lastIndexOf('/'));
    }
    history.push(url);
};

export const RouteMatch = (pathname, patterns) => {
    for (let i = 0; i < patterns.length; i += 1) {
        const pattern = patterns[i];
        const possibleMatch = matchPath(pathname, pattern);  // swapped param order from example at https://mui.com/guides/routing/#tabs
        if (possibleMatch !== null) {
            return possibleMatch;
        }
    }

    return null;
}
