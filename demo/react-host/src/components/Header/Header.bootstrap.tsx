import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { create } from 'jss';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';

import { container, MicroFrontModuleBootstrap } from '@redneckz/microfront-core';
import { Container } from '@redneckz/microfront-core-react';

import type { HeaderProps } from './Header';

export const bootstrap: MicroFrontModuleBootstrap<HeaderProps> = async ({ title }) => {
    const { Header } = await import('./Header');

    return {
        mount: async mountingRoot => {
            const jss = create({
                plugins: jssPreset().plugins,
                // Isolation of styles behind Shadow DOM
                insertionPoint: mountingRoot as HTMLElement
            });
            render(
                <Container instance={container()}>
                    <StylesProvider jss={jss}>
                        <Header title={title} />
                    </StylesProvider>
                </Container>,
                mountingRoot
            );
        },
        unmount: async mountingRoot => {
            unmountComponentAtNode(mountingRoot);
        }
    };
};
