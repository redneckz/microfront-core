/**
 * https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/blog
 */

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { register } from '@redneckz/microfront-core';
import { MicroFrontContainer } from '@redneckz/microfront-core-react';

import { Layout } from './Layout';

/**
 * It would be nice to have the latest typings of micro frontends
 * on host container to fix integration problems ASAP at compile time.
 * But keep in mind that host <-> microfront contract should be as simple as possible.
 */
import type { HeaderProps } from './Header';

const bootstrapHeader = register<HeaderProps>(
    'reactHost', // remote module name according to Module Federation config
    () => import('reactHost/Header') //  remote module
);

const bootstrapAds = register(
    'reactHost', // remote module name according to Module Federation config
    () => import('reactHost/FeaturedPostsList') //  remote module
);

const bootstrapHome = register(
    'reactHost', // remote module name according to Module Federation config
    () => import('reactHost/Home') //  remote module
);

export const App: React.FC = () => (
    <Router>
        <Layout
            header={
                /* Typings are correctly seeped from "bootstrapHeader" to "MicroFrontInShadow" */
                <MicroFrontContainer bootstrap={bootstrapHeader} title="Micro Frontend Host Container">
                    {mountingRootRef => <div ref={mountingRootRef}>Loading...</div>}
                </MicroFrontContainer>
            }
            ads={
                <MicroFrontContainer bootstrap={bootstrapAds}>
                    {mountingRootRef => <div ref={mountingRootRef}>Loading...</div>}
                </MicroFrontContainer>
            }
        >
            <Switch>
                <Route path="/science">TODO Micro Frontend #1</Route>
                <Route path="/health">TODO Micro Frontend #2</Route>
                <Route path="/travel">TODO Micro Frontend #3</Route>
                <Route path="/">
                    <MicroFrontContainer bootstrap={bootstrapHome}>
                        {mountingRootRef => <div ref={mountingRootRef}>Loading...</div>}
                    </MicroFrontContainer>
                </Route>
            </Switch>
        </Layout>
    </Router>
);
