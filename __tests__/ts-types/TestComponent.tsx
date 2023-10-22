import { expectError } from 'tsd-lite';

import themed from '../../src';
import TestComponent from '../../jest/TestComponent';

expectError(<TestComponent />);

const Themed = themed(TestComponent, 'Themed');

expectError(<Themed badKey="value" />);

  <Themed goodKey="good" />;
