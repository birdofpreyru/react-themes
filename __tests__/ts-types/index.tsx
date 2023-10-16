import { expectError } from 'tsd-lite';

// import themed from '../../src';

// import TestComponent from '../../jest/TestComponent';

// const Themed = themed('Themed')(TestComponent);

// expectError(<Themed theme={{}} />);

expectError(() => {
  // eslint-disable-next-line
  const a: string = 5;
});
