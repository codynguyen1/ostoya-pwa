import React from 'react';

import defaultClasses from './spinner.css';
import { useStyle } from '../../classify';
import { RotateCw as LoaderIcon } from 'react-feather';
import Icon from '../Icon';

const Spinner = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Icon
                src={LoaderIcon}
                size={24}
                classes={{ root: classes.indicator }}
            />
        </div>
    );
};

export default Spinner;
