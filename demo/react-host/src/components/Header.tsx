/**
 * https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/blog
 */

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
    toolbar: {
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    toolbarTitle: {
        flex: 1
    },
    toolbarSecondary: {
        overflowX: 'auto'
    },
    toolbarLink: {
        padding: theme.spacing(1),
        flexShrink: 0
    }
}));

interface HeaderProps {
    title: string;
    sections: { title: string; url: string }[];
}

export const Header: React.FC<HeaderProps> = ({ title, sections }) => {
    const classes = useStyles();

    return (
        <>
            <Toolbar className={classes.toolbar}>
                <Typography
                    component="h2"
                    variant="h5"
                    color="inherit"
                    align="center"
                    noWrap
                    className={classes.toolbarTitle}
                >
                    {title}
                </Typography>
            </Toolbar>
            <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
                {sections.map(section => (
                    <Link
                        color="inherit"
                        noWrap
                        key={section.title}
                        variant="body2"
                        className={classes.toolbarLink}
                        component={RouterLink}
                        to={section.url}
                    >
                        {section.title}
                    </Link>
                ))}
            </Toolbar>
        </>
    );
};
