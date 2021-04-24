/**
 * https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/blog
 */

import React from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const options = {
    overrides: {
        h1: { component: Typography, props: { gutterBottom: true, variant: 'h5' } },
        h2: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
        h3: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
        h4: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
        p: { component: Typography, props: { paragraph: true } },
        a: { component: Link },
        li: {
            component: (props: any) => (
                <li>
                    <Typography component="span" {...props} />
                </li>
            )
        }
    }
};

export const Markdown: typeof ReactMarkdown = props => <ReactMarkdown options={options} {...props} />;
