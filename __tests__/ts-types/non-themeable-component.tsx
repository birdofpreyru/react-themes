import type { FunctionComponent } from 'react';

import { expect } from 'tstyche';

import themed, { type ThemeableComponentProps } from '../../src';

// It is invalid theme, as it does not have special theme tags
// for specifity manipulations.
type BadThemeT = {
  container?: string;
};

type ComponentPropsT = {
  theme: BadThemeT;
};

const Component: FunctionComponent<ComponentPropsT> = ({ theme }) => (
  <div className={theme.container}>
    NON-THEMEABLE
  </div>
);

const props: ComponentPropsT = {
  theme: {},
};

expect<ThemeableComponentProps>().type.not.toBeAssignableWith(props);

expect(themed).type.not.toBeCallableWith(Component, 'Themed');
