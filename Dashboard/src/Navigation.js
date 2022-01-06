let back = e => {
    if (e) {
        // TODO either use location to see if we came from this site or not,
        // or just change strategy to strip last path element regardless.
        e.stopPropagation();
    }
    history.goBack();
};

export default back;
