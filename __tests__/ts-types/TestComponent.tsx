import { expect } from 'tstyche';

import themed from '../../src';
import TestComponent from '../../jest/TestComponent';

expect(<TestComponent />).type.toRaiseError(2741);

const Themed = themed(TestComponent, 'Themed');

expect(<Themed badKey="value" />).type.toRaiseError(2322);
expect(<Themed goodKey="good" />).type.not.toRaiseError();
