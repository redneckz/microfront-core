/**
 * https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/blog
 */

 import React from 'react';
 import { makeStyles } from '@material-ui/core/styles';
 import CssBaseline from '@material-ui/core/CssBaseline';
 import Container from '@material-ui/core/Container';
 import Grid from '@material-ui/core/Grid';

 import { Header } from './Header';
 import { FeaturedPost, FeaturedPostModel } from './FeaturedPost';
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

 const featuredPosts: FeaturedPostModel[] = [
     {
         title: 'Featured post',
         date: 'Nov 12',
         description: 'This is a wider card with supporting text below as a natural lead-in to additional content.',
         image: 'https://source.unsplash.com/random',
         imageTitle: 'Image Text'
     },
     {
         title: 'Post title',
         date: 'Nov 11',
         description: 'This is a wider card with supporting text below as a natural lead-in to additional content.',
         image: 'https://source.unsplash.com/random',
         imageTitle: 'Image Text'
     }
 ];

 export const Layout: React.FC = ({ children }) => {
     const classes = useStyles();

     return (
         <>
             <CssBaseline />
             <Container maxWidth="lg">
                 <Header title="Micro Frontend Host Container" sections={sections} />
                 <main>
                     <Grid container spacing={4}>
                         {featuredPosts.map(post => (
                             <FeaturedPost key={post.title} post={post} />
                         ))}
                     </Grid>
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
