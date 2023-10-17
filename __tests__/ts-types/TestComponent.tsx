import { expectError } from 'tsd-lite';

import { themedComponent } from '../../src';
import TestComponent from '../../jest/TestComponent';

import legacyTheme from '../../jest/theme-a-legacy.scss';

expectError(<TestComponent />);

const Themed = themedComponent('Themed', TestComponent);

expectError(<Themed badKey="value" />);

  <Themed goodKey="good" />;

expectError(<Themed theme={legacyTheme} />);
