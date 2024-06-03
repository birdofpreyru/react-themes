/**
 * A few utils for Jest testing.
 */

/* global expect */

import { act } from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { type RenderResult, render } from '@testing-library/react';
/* eslint-enable import/no-extraneous-dependencies */

/**
 * Renders provided ReactJS component with ReactJS Test Renderer,
 * creates/tests the snapshot, and returns the render.
 * @param {Object} component ReactJS component to render.
 * @return {Object} JSON render of the component.
 */
export function snapshot(element: React.ReactElement) {
  let res: RenderResult | undefined;
  act(() => {
    res = render(element);
  });
  if (res === undefined) throw Error('Render failed');

  const nodes = res.asFragment().childNodes;
  expect(nodes.length > 1 ? [...nodes] : nodes[0]).toMatchSnapshot();
  return res;
}

export default null;
