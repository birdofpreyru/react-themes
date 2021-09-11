import React from 'react';
import BasicExample from './BasicExample';

export default function Example02() {
  return (
    <div style={{background: 'blue', padding: '1em 1em 0'}}>
      <BasicExample>Hello World!</BasicExample>
      <BasicExample>Hello World!</BasicExample>
      <BasicExample>Hello World!</BasicExample>
    </div>
  );
}