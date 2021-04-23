import React from 'react';
import { createPortal } from 'react-dom';
import TestRenderer from 'react-test-renderer';
import { MicroFrontInShadow } from './microfront-in-shadow';
import { useShadow } from './use-shadow';
import { useBootstrap } from './use-bootstrap';
import { useMount } from './use-mount';

jest.mock('react-dom', () => ({
    createPortal: jest.fn(children => children)
}));
jest.mock('./use-shadow', () => ({
    useShadow: jest.fn(() => [null, jest.fn()])
}));
jest.mock('./use-bootstrap', () => ({
    useBootstrap: jest.fn(() => [null, null])
}));
jest.mock('./use-mount', () => ({
    useMount: jest.fn(() => jest.fn())
}));

describe('MicroFrontInShadow', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render empty root if no shadow DOM has been attached', () => {
        const testRenderer = TestRenderer.create(
            <MicroFrontInShadow bootstrap={() => Promise.resolve({} as any)}>{() => null}</MicroFrontInShadow>
        );

        expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
<div
  aria-atomic="true"
  role="document"
/>
`);
    });

    it('should render children (render props) into shadow root while bootstrapping remote module', () => {
        expect.assertions(2);

        const shadowRoot = {} as ShadowRoot;
        (useShadow as jest.Mock).mockReturnValueOnce([shadowRoot, { current: null }]);
        const children = () => <div>children</div>;

        const testRenderer = TestRenderer.create(
            <MicroFrontInShadow bootstrap={() => Promise.resolve({} as any)}>{children}</MicroFrontInShadow>
        );

        expect(createPortal).toBeCalledWith(expect.anything(), shadowRoot);
        expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
<div
  aria-atomic="true"
  role="document"
>
  <div>
    children
  </div>
</div>
`);
    });

    it('should render error by means of "renderError" in case of bootstrapping error', () => {
        (useBootstrap as jest.Mock).mockReturnValueOnce([null, new Error('Module bootstrapping has failed')]);
        const renderError = ({ message }: Error) => message;

        const testRenderer = TestRenderer.create(
            <MicroFrontInShadow renderError={renderError} bootstrap={() => Promise.resolve({} as any)}>{() => null}</MicroFrontInShadow>
        );

        expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
<div
  aria-atomic="true"
  role="document"
>
  Module bootstrapping has failed
</div>
`);
    });

    it('should pass mounting root reference to children (render props) in order to prepare layout for remote module mounting', () => {
        expect.assertions(2);

        const mountingRootRef = { current: { nodeName: 'mountingRootRef' } as Element };
        (useMount as jest.Mock).mockReturnValueOnce(mountingRootRef);
        const children = jest.fn((ref: React.RefCallback<any>) => <div ref={ref}>children</div>);

        const testRenderer = TestRenderer.create(
            <MicroFrontInShadow bootstrap={() => Promise.resolve({} as any)}>{children}</MicroFrontInShadow>
        );

        expect(children).toBeCalledWith(mountingRootRef);
        expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
<div
  aria-atomic="true"
  role="document"
>
  <div>
    children
  </div>
</div>
`);
    });
});
