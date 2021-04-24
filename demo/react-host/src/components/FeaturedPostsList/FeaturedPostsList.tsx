/**
 * https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/blog
 */

import React from 'react';
import Grid from '@material-ui/core/Grid';

import { FeaturedPost, FeaturedPostModel } from './FeaturedPost';

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

export const FeaturedPostsList: React.FC = () => (
    <Grid container spacing={4}>
        {featuredPosts.map(post => (
            <FeaturedPost key={post.title} post={post} />
        ))}
    </Grid>
);
