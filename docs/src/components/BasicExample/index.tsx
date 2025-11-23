import type { FunctionComponent, ReactNode } from 'react';

import { type Theme, useTheme } from '@dr.pogodin/react-themes';

import defaultTheme from './default.module.scss';

// The base component.
type PropsT = {
  children?: ReactNode;
  theme?: Theme<'component'>;
};

const BasicExample: FunctionComponent<PropsT> = ({ children, theme }) => {
  const composed = useTheme('BasicExample', defaultTheme, theme);
  return <div className={composed.component}>{children}</div>;
};

// The component is wrapped by React Themes "themed" helper,
// which registers it under "BasicExample" name for theming purposes,
// and specifies its default theme.
export default BasicExample;
