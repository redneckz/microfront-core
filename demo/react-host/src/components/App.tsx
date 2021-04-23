/**
 * https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/blog
 */

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { register } from '@redneckz/microfront-core';
import { MicroFrontInShadow } from '@redneckz/microfront-core-react';

import { Layout } from './Layout';

const bootstrapHome = register(
    'reactHost', // remote module name according to Module Federation config
    () => import('reactHost/home') //  remote module
);

export const App: React.FC = () => {
    return (
        <Router>
            <Layout>
                <Switch>
                    <Route path="/science">TODO Micro Frontend #1</Route>
                    <Route path="/health">TODO Micro Frontend #2</Route>
                    <Route path="/travel">TODO Micro Frontend #3</Route>
                    <Route path="/">
                        <MicroFrontInShadow route="/" bootstrap={bootstrapHome}>
                            {mountingRootRef => <div ref={mountingRootRef}>Loading...</div>}
                        </MicroFrontInShadow>
                    </Route>
                </Switch>
            </Layout>
        </Router>
    );
};
