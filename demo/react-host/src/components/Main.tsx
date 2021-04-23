/**
 * https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/blog
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
    children: {
        padding: theme.spacing(3, 0)
    }
}));

interface MainProps {
    title: string;
    children: React.ReactNode;
}

export const Main: React.FC<MainProps> = ({ title, children }) => {
    const classes = useStyles();

    return (
        <Grid item md={12}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Divider />
            <div className={classes.children}>{children}</div>
        </Grid>
    );
};
