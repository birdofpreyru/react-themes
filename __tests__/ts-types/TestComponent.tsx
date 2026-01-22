import { expect } from 'tstyche';

import TestComponent from '../../jest/TestComponent';
import themed from '../../src';

expect(<TestComponent />).type.toRaiseError(2741);

const Themed = themed(TestComponent, 'Themed');

expect(<Themed badKey="value" />).type.toRaiseError(2322);
expect(<Themed goodKey="good" />).type.not.toRaiseError();
