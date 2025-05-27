import type { FunctionComponent, ReactNode } from 'react';

import themed, { type Theme } from '@dr.pogodin/react-themes';

import defaultTheme from './default.module.scss';

// The base component.
type PropsT = {
  children?: ReactNode;
  theme: Theme<'component'>;
};

const BasicExample: FunctionComponent<PropsT>
  = ({ children, theme }) => <div className={theme.component}>{children}</div>;

// The component is wrapped by React Themes "themed" helper,
// which registers it under "BasicExample" name for theming purposes,
// and specifies its default theme.
export default themed(BasicExample, 'BasicExample', defaultTheme);
