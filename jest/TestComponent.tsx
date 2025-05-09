import type { FunctionComponent } from 'react';

import type { Theme } from '../src';

export type ComponentTheme = Theme<'container' | 'content'>;

export type ComponentProps = {
  children?: React.ReactNode;
  theme: ComponentTheme;
  goodKey?: string;
};

const Component: FunctionComponent<ComponentProps> = ({
  children,
  goodKey = '',
  theme,
}) => (
  <div className={theme.container}>
    <div className={theme.content}>
      { children }
      { goodKey }
    </div>
  </div>
);

export default Component;
