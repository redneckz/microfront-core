import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { create } from 'jss';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';

import { MicroFrontModuleBootstrap } from '@redneckz/microfront-core';

export const bootstrap: MicroFrontModuleBootstrap = async () => {
    const { FeaturedPostsList } = await import('./FeaturedPostsList');

    return {
        mount: async mountingRoot => {
            const jss = create({
                plugins: jssPreset().plugins,
                // Isolation of styles behind Shadow DOM
                insertionPoint: mountingRoot as HTMLElement
            });
            render(
                <StylesProvider jss={jss}>
                    <FeaturedPostsList />
                </StylesProvider>,
                mountingRoot
            );
        },
        unmount: async mountingRoot => {
            unmountComponentAtNode(mountingRoot);
        }
    };
};
