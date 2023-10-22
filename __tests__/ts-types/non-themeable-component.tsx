import { expectError, expectNotAssignable } from 'tsd-lite';

import themed, { type ThemeableComponentProps } from '../../src';

// It is invalid theme, as it does not have special theme tags
// for specifity manipulations.
type BadThemeT = {
  container?: string;
};

type ComponentPropsT = {
  theme: BadThemeT;
};

function Component({ theme }: ComponentPropsT) {
  return (
    <div className={theme.container}>
      NON-THEMEABLE
    </div>
  );
}

const props: ComponentPropsT = {
  theme: {},
};

expectNotAssignable<ThemeableComponentProps>(props);

expectError(themed(Component, 'Themed'));
