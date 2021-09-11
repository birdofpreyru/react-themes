import React from 'react';
import PT from 'prop-types';
import themed from '@dr.pogodin/react-themes';

import defaultTheme from './default.module.scss';

// The base component.
function BasicExample({ children, theme }) {
  return <div className={theme.component}>{children}</div>;
}

// The component is wrapped by React Themes "themed" helper,
// which registers it under "BasicExample" name for theming purposes,
// documents valid classnames, and specifies its default theme.
const ThemedBasicExample = themed('BasicExample', [
  'component',
], defaultTheme)(BasicExample);

// This is optional, if you use "propTypes" validation, React Themes helps
// to validate theme keys.
BasicExample.propTypes = {
  children: PT.string.isRequired,
  theme: ThemedBasicExample.themeType.isRequired,
};

export default ThemedBasicExample;