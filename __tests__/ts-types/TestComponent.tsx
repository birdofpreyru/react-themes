import { expectError } from 'tsd-lite';

import { themedComponent } from '../../src';
import TestComponent from '../../jest/TestComponent';

expectError(<TestComponent />);

const Themed = themedComponent('Themed', TestComponent);

expectError(<Themed badKey="value" />);

  <Themed goodKey="good" />;
