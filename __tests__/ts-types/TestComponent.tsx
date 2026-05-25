import { expect } from 'tstyche';

import TestComponent from '../../jest/TestComponent';
import themed from '../../src';

expect(TestComponent).type.not.toAcceptProps({})

const Themed = themed(TestComponent, 'Themed');

expect(Themed).type.not.toAcceptProps({ badKey: "value "})
expect(Themed).type.toAcceptProps({ goodKey: "value" })
