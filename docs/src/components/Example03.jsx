import React from 'react';
import { ThemeProvider } from '@dr.pogodin/react-themes';

import BasicExample from './BasicExample';
import blueContextTheme from './BasicExample/blue-context.module.scss';

export default function Example02() {
  return (
    <ThemeProvider themes={{ BasicExample: blueContextTheme }}>
      <div style={{background: 'blue', padding: '1em 1em 0'}}>
        <BasicExample>Hello World!</BasicExample>
        <BasicExample>Hello World!</BasicExample>
        <BasicExample>Hello World!</BasicExample>
      </div>
    </ThemeProvider>
  );
}