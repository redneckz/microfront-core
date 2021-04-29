import React, { createContext, useContext } from 'react';
import { MicroFrontParams, container, getMicroFrontParams } from '@redneckz/microfront-core';

type Container = ReturnType<typeof container>;

const IsolationContext = createContext<Container>(_ => _);

export const Container: React.FC<{ instance: Container }> = ({ instance, children }) => {
    return <IsolationContext.Provider value={instance}>{children}</IsolationContext.Provider>;
};

export const useContainer = () => useContext(IsolationContext);

export const useMicroFrontParams = (): MicroFrontParams | undefined => {
    const container = useContainer();
    try {
        return container(getMicroFrontParams)();
    } catch (err) {
        // Called outside of micro frontend context
        return undefined;
    }
};
