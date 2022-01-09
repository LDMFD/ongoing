import { matchPath } from 'react-router-dom';

export const GoBack = history => e => {
    if (e) {
        e.stopPropagation();
    }
    history.goBack();
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
