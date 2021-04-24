/**
 * https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/blog
 */

 import React from 'react';
 import { makeStyles } from '@material-ui/core/styles';
 import CssBaseline from '@material-ui/core/CssBaseline';
 import Container from '@material-ui/core/Container';
 import Grid from '@material-ui/core/Grid';

 import { Header } from './Header';
 import { Main } from './Main';
 import { Footer } from './Footer';

 const useStyles = makeStyles(theme => ({
     mainGrid: {
         marginTop: theme.spacing(3)
     }
 }));

 const sections = [
     { title: 'Home', url: '/' },
     { title: 'Science', url: '/science' },
     { title: 'Health', url: '/health' },
     { title: 'Travel', url: '/travel' }
 ];

 interface LayoutProps {
    ads?: React.ReactNode,
    children: React.ReactNode,
 }

 export const Layout: React.FC<LayoutProps> = ({ ads, children }) => {
     const classes = useStyles();

     return (
         <>
             <CssBaseline />
             <Container maxWidth="lg">
                 <Header title="Micro Frontend Host Container" sections={sections} />
                 <main>
                     {ads}
                     <Grid container spacing={5} className={classes.mainGrid}>
                         <Main title="Micro Frontends">
                             {children}
                         </Main>
                     </Grid>
                 </main>
             </Container>
             <Footer title="Footer" description="Something here to give the footer a purpose!" />
         </>
     );
 };
