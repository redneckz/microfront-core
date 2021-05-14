import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { create } from 'jss';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';

import { container, MicroFrontModuleBootstrap } from '@redneckz/microfront-core';
import { Container } from '@redneckz/microfront-core-react';

import type { HeaderProps } from './Header';

export const bootstrap: MicroFrontModuleBootstrap<HeaderProps> = async ({ title }) => {
    const { Header } = await import('./Header');

    /* Google Tag Manager */
    (() => {
        const id = 'GTM-WQN7FF2';
        // Host container name with suffix "DL"
        const dataLayer = 'reactHostDL';
        // Skip insert of GTM if it was already inserted
        if ((globalThis as any)[dataLayer]) return;
        (globalThis as any)[dataLayer] = [{ 'gtm.start': new Date().getTime(), event: 'gtm.js' }];
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${id}&l=${dataLayer}`;
        document.body.appendChild(script);
    })();
    /* End Google Tag Manager */

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
