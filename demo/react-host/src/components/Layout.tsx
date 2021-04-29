/**
 * https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/blog
 */

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';

import { Main } from './Main';
import { Footer } from './Footer';

const useStyles = makeStyles(theme => ({
    mainGrid: {
        marginTop: theme.spacing(3)
    },
    toolbarSecondary: {
        overflowX: 'auto'
    },
    toolbarLink: {
        padding: theme.spacing(1),
        flexShrink: 0
    }
}));

const sections = [
    { title: 'Home', url: '/' },
    { title: 'Science', url: '/science' },
    { title: 'Health', url: '/health' },
    { title: 'Travel', url: '/travel' }
];

interface LayoutProps {
    header: React.ReactNode;
    ads?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ header, ads, children }) => {
    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <Container maxWidth="lg">
                {header}
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
                <main>
                    {ads}
                    <Grid container spacing={5} className={classes.mainGrid}>
                        <Main title="Micro Frontends">{children}</Main>
                    </Grid>
                </main>
            </Container>
            <Footer title="Footer" description="Something here to give the footer a purpose!" />
        </>
    );
};
