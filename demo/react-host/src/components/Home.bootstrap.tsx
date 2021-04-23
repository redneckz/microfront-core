import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { MicroFrontModuleBootstrap } from '@redneckz/microfront-core';

export const bootstrap: MicroFrontModuleBootstrap = async () => {
    const { Home } = await import('./Home');

    return {
        mount: async mountingRoot => {
            render(
                <Home />,
                mountingRoot
            );
        },
        unmount: async mountingRoot => {
            unmountComponentAtNode(mountingRoot);
        }
    };
};
