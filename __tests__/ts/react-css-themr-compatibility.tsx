import themed, {
  type ThemeT,
  COMPATIBILITY_MODE,
  ThemeProvider,
  setCompatibilityMode,
} from '../../src';

import { snapshot } from '../../jest/utils';
import TestComponent from '../../jest/TestComponent';

import themeA from '../../jest/theme-a-legacy.scss';
import themeB from '../../jest/theme-b-legacy.scss';
import themeC from '../../jest/theme-c-legacy.scss';
import themeD from '../../jest/theme-d-legacy.scss';

setCompatibilityMode(COMPATIBILITY_MODE.REACT_CSS_THEMR);

describe('01 - No default theme.', () => {
  describe('01 - No options at registration.', () => {
    const Themed = themed('Themed')(TestComponent);

    test('01 - No extra themes', () => {
      snapshot(<Themed />);
      snapshot(<Themed>Child</Themed>);
    });

    test('02 - Ad hoc theme', () => {
      snapshot(<Themed theme={themeA}>Child</Themed>);
    });

    test('03 - Context theme', () => {
      snapshot((
        <ThemeProvider theme={{}}>
          <Themed />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider theme={{ Themed: themeB }}>
          <Themed />
        </ThemeProvider>
      ));
    });

    test('04 - Context + ad hoc', () => {
      snapshot((
        <ThemeProvider theme={{}}>
          <Themed theme={themeC} />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider theme={{ Themed: themeB }}>
          <Themed theme={themeC} />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider theme={{ Themed: themeA }}>
          <Themed theme={themeC} />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider theme={{ Themed: themeA }}>
          <ThemeProvider theme={{ Themed: themeB }}>
            <Themed theme={themeC} />
          </ThemeProvider>
        </ThemeProvider>
      ));
    });
  });
});

describe('02 - With default theme', () => {
  describe('01 - No options at registration.', () => {
    const Themed = themed('Themed', themeA)(TestComponent);

    test('01 - No extra themes', () => {
      snapshot(<Themed />);
      snapshot(<Themed>Child</Themed>);
    });

    test('02 - Ad hoc theme', () => {
      snapshot(<Themed theme={themeB}>Child</Themed>);
    });

    test('03 - Context theme', () => {
      snapshot((
        <ThemeProvider theme={{}}>
          <Themed />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider theme={{ Themed: themeB }}>
          <Themed />
        </ThemeProvider>
      ));
    });

    test('04 - Context + ad hoc', () => {
      snapshot((
        <ThemeProvider theme={{}}>
          <Themed theme={themeC} />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider theme={{ Themed: themeB }}>
          <Themed theme={themeC} />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider theme={{ Themed: themeC }}>
          <Themed theme={themeD} />
        </ThemeProvider>
      ));
    });
  });

  describe('02 - Options at registration', () => {
    test('01 - composeTheme', () => {
      const Themed = themed('Themed', themeA, {
        composeTheme: false,
      })(TestComponent);
      snapshot((
        <ThemeProvider theme={{ Themed: themeB }}>
          <Themed />
        </ThemeProvider>
      ));
    });

    test('04 - Theme props mapping', () => {
      let args;
      const Themed = themed('Themed', themeA, {
        mapThemrProps: (props: object, theme: ThemeT) => {
          args = { props, theme };
          return { theme: {} };
        },
      })(TestComponent);
      snapshot(<Themed />);
      expect(args).toMatchSnapshot();
    });
  });
});
