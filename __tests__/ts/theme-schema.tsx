/**
 * Tests for theme schema verifier, and casting.
 */

import themed, { type ThemeT } from '../../src';

import { snapshot } from '../../jest/utils';

import themeA from '../../jest/theme-a.scss';
import invalidTheme from '../../jest/invalid-theme.scss';
import themeWithExtraStyles from '../../jest/theme-with-extra-styles.scss';

type ComponentPropsT = {
  theme: ThemeT;
};

function Component({ theme }: ComponentPropsT) {
  return JSON.stringify(theme, null, 2);
}

const ThemedComponent = themed('Component', [
  'container',
  'content',
])(Component);

describe('Theme verification', () => {
  test('No errors with the correct theme', () => {
    const res = ThemedComponent.themeType(
      { theme: themeA },
      'theme',
      'Component',
    );
    expect(res).toBe(null);
  });

  test('Theme is missing and not required', () => {
    const res = ThemedComponent.themeType(
      {},
      'theme',
      'Component',
    );
    expect(res).toBe(null);
  });

  test('Theme is missing and is required', () => {
    const res = ThemedComponent.themeType.isRequired(
      {},
      'theme',
      'Component',
    );
    expect(res?.message).toMatchSnapshot();
  });

  test('Reports correct errors with invalid theme', () => {
    const res = ThemedComponent.themeType(
      { theme: invalidTheme },
      'theme',
      'Component',
    );
    expect(res?.message).toMatchSnapshot();
  });

  test('Theme casting works', () => {
    snapshot((
      <ThemedComponent
        theme={themeWithExtraStyles}
        castTheme
      />
    ));
  });
});
