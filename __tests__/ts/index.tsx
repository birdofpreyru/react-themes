/** @jest-environment jsdom */

import themed, {
  COMPOSE,
  PRIORITY,
  ThemeProvider,
} from '../../src';

import { snapshot } from '../../jest/utils';

import TestComponent, {
  type ComponentProps,
  type ComponentTheme,
} from '../../jest/TestComponent';

import themeA from '../../jest/theme-a.scss';
import themeB from '../../jest/theme-b.scss';
import themeC from '../../jest/theme-c.scss';
import themeD from '../../jest/theme-d.scss';

test('Decorator-style wrapping', () => {
  const factory = themed<ComponentProps>('Themed');
  const Themed = factory(TestComponent);
  snapshot(<Themed />);
});

describe('01 - No default theme.', () => {
  describe('01 - No options at registration.', () => {
    const Themed = themed(TestComponent, 'Themed');

    test('01 - No extra themes', () => {
      snapshot(<Themed />);
      snapshot(<Themed>Child</Themed>);
    });

    test('02 - Ad hoc theme', () => {
      snapshot(<Themed theme={themeA}>Child</Themed>);
    });

    test('03 - Context theme', () => {
      snapshot((
        <ThemeProvider themes={{}}>
          <Themed />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider themes={{ Themed: themeB }}>
          <Themed />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider themes={{ Themed: themeB }}>
          <Themed composeAdhocTheme={COMPOSE.SWAP} />
        </ThemeProvider>
      ));
    });

    test('04 - Context + ad hoc', () => {
      snapshot((
        <ThemeProvider themes={{}}>
          <Themed theme={themeC} />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider themes={{ Themed: themeB }}>
          <Themed theme={themeC} />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider themes={{ Themed: themeA }}>
          <Themed theme={themeC} />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider themes={{ Themed: themeA }}>
          <ThemeProvider themes={{ Themed: themeB }}>
            <Themed theme={themeC} />
          </ThemeProvider>
        </ThemeProvider>
      ));
    });

    test('05 - Context + ad hoc + composition modes', () => {
      snapshot((
        <ThemeProvider themes={{ Themed: themeA }}>
          <Themed composeAdhocTheme={COMPOSE.SOFT} theme={themeB} />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider themes={{ Themed: themeA }}>
          <Themed composeAdhocTheme={COMPOSE.SWAP} theme={themeB} />
        </ThemeProvider>
      ));
    });

    test(
      '06 - Nested ThemeProvider does not shadow parent themes it does not override',
      () => {
        const Themed2 = themed(TestComponent, 'Themed2');
        snapshot((
          <ThemeProvider themes={{ Themed: themeA, Themed2: themeA }}>
            <ThemeProvider themes={{ Themed2: themeB }}>
              <Themed />
              <Themed2 />
            </ThemeProvider>
          </ThemeProvider>
        ));
      },
    );
  });
});

describe('02 - With default theme', () => {
  describe('01 - No options at registration.', () => {
    const Themed = themed(TestComponent, 'Themed', themeA);

    test('01 - No extra themes', () => {
      snapshot(<Themed />);
      snapshot(<Themed>Child</Themed>);
    });

    test('02 - Ad hoc theme', () => {
      snapshot(<Themed theme={themeB}>Child</Themed>);
    });

    test('03 - Context theme', () => {
      snapshot((
        <ThemeProvider themes={{}}>
          <Themed />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider themes={{ Themed: themeB }}>
          <Themed />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider themes={{ Themed: themeB }}>
          <Themed composeContextTheme={COMPOSE.SWAP} />
        </ThemeProvider>
      ));
    });

    test('04 - Context + ad hoc', () => {
      snapshot((
        <ThemeProvider themes={{}}>
          <Themed theme={themeC} />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider themes={{ Themed: themeB }}>
          <Themed theme={themeC} />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider themes={{ Themed: themeC }}>
          <Themed theme={themeD} />
        </ThemeProvider>
      ));
    });

    test('05 - Context + ad hoc + composition modes', () => {
      snapshot((
        <ThemeProvider themes={{ Themed: themeC }}>
          <Themed
            theme={themeD}
            themePriority={PRIORITY.ADHOC_DEFAULT_CONTEXT}
          />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider themes={{ Themed: themeC }}>
          <Themed
            composeContextTheme={COMPOSE.SWAP}
            theme={themeD}
            themePriority={PRIORITY.ADHOC_DEFAULT_CONTEXT}
          />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider themes={{ Themed: themeC }}>
          <Themed
            composeContextTheme={COMPOSE.SWAP}
            theme={themeD}
          />
        </ThemeProvider>
      ));
    });

    test('06 - Theme props mapping', () => {
      let args;
      snapshot((
        <Themed
          mapThemeProps={(
            props,
            theme,
          ): {
            theme: ComponentTheme;
          } => {
            args = { props, theme };
            return {
              theme,
            };
          }}
        />
      ));
      expect(args).toMatchSnapshot();
    });
  });

  describe('02 - Options at registration', () => {
    test('01 - composeContextTheme', () => {
      const Themed = themed(TestComponent, 'Themed', themeA, {
        composeContextTheme: COMPOSE.SWAP,
      });
      snapshot((
        <ThemeProvider themes={{ Themed: themeB }}>
          <Themed />
        </ThemeProvider>
      ));
      snapshot((
        <ThemeProvider themes={{ Themed: themeB }}>
          <Themed composeContextTheme={COMPOSE.SOFT} />
        </ThemeProvider>
      ));
    });

    test('02 - composeAdhocTheme', () => {
      const Themed = themed(TestComponent, 'Themed', themeA, {
        composeAdhocTheme: COMPOSE.SWAP,
      });
      snapshot(
        <Themed theme={themeB} />,
      );
      snapshot(
        <Themed composeAdhocTheme={COMPOSE.SOFT} theme={themeB} />,
      );
    });

    test('03 - themePriority', () => {
      const Themed = themed(TestComponent, 'Themed', themeA, {
        themePriority: PRIORITY.ADHOC_DEFAULT_CONTEXT,
      });
      snapshot((
        <ThemeProvider themes={{ Themed: themeB }}>
          <Themed theme={themeC} />
          <Themed
            theme={themeC}
            themePriority={PRIORITY.ADHOC_CONTEXT_DEFAULT}
          />
        </ThemeProvider>
      ));
    });

    test('04 - Theme props mapping', () => {
      let args;
      const Themed = themed(TestComponent, 'Themed', themeA, {
        mapThemeProps: (props: object, theme: ComponentTheme) => {
          args = { props, theme };
          return { theme };
        },
      });
      snapshot(<Themed />);
      expect(args).toMatchSnapshot();
      snapshot((
        <Themed
          mapThemeProps={(
            props: Record<string, unknown>,
            theme: ComponentTheme,
          ) => {
            args = { props, theme };
            return { theme };
          }}
        />
      ));
      expect(args).toMatchSnapshot();
    });
  });
});
