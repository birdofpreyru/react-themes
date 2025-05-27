import type { FunctionComponent } from 'react';
import { ThemeProvider } from '@dr.pogodin/react-themes';

import BasicExample from '../BasicExample';
import blueContextTheme from '../BasicExample/blue-context.module.scss';

import adHocTheme from './style.module.scss';

const Example04: FunctionComponent = () => (
  <ThemeProvider themes={{ BasicExample: blueContextTheme }}>
    <div style={{ background: 'blue', padding: '1em 1em 0' }}>
      <BasicExample>Hello World!</BasicExample>
      <BasicExample theme={adHocTheme}>Hello World!</BasicExample>
      <BasicExample>Hello World!</BasicExample>
    </div>
  </ThemeProvider>
);

export default Example04;
