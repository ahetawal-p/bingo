import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const withMediaQuery = (...args) => Component => props => {
    const mediaQuery = useMediaQuery('(prefers-color-scheme: dark)')
    return <Component isDarkMode={mediaQuery} {...props} />;
};

export default withMediaQuery;
