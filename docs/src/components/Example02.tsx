import type { FunctionComponent } from 'react';

import BasicExample from './BasicExample';

const Example02: FunctionComponent = () => (
  <div style={{ background: 'blue', padding: '1em 1em 0' }}>
    <BasicExample>Hello World!</BasicExample>
    <BasicExample>Hello World!</BasicExample>
    <BasicExample>Hello World!</BasicExample>
  </div>
);

export default Example02;
