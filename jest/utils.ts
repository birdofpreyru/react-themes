/**
 * A few utils for Jest testing.
 */

/* global expect */

/* eslint-disable import/no-extraneous-dependencies */
import Renderer from 'react-test-renderer';
/* eslint-enable import/no-extraneous-dependencies */

/**
 * Auxiliary wrapper around ReactJS Test Renderer.
 * @param {Object} component ReactJS component to render.
 * @return {Object} JSON representation of the rendered tree.
 */
function render(component: React.ReactElement) {
  return Renderer.create(component).toJSON();
}

/**
 * Renders provided ReactJS component with ReactJS Test Renderer,
 * creates/tests the snapshot, and returns the render.
 * @param {Object} component ReactJS component to render.
 * @return {Object} JSON render of the component.
 */
export function snapshot(component: React.ReactElement) {
  const res = render(component);
  expect(res).toMatchSnapshot();
  return res;
}

export default null;
