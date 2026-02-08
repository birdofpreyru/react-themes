/** @jest-environment jsdom */

import type { FunctionComponent, ReactNode } from 'react';

import TestComponent from '../../jest/TestComponent';

import { snapshot } from '../../jest/utils';

import {
  COMPOSE,
  PRIORITY,
  type ThemeI,
  ThemeProvider,
  useTheme,
} from '../../src';

import themeA from '../../jest/theme-a.scss';
import themeB from '../../jest/theme-b.scss';
import themeC from '../../jest/theme-c.scss';
import themeD from '../../jest/theme-d.scss';

describe('01 - No default theme.', () => {
  describe('01 - No options at registration.', () => {
    const Themed: FunctionComponent<{
      children?: ReactNode;
      composeAdhocTheme?: COMPOSE;
      goodKey?: string;
      theme?: ThemeI;
    }> = ({
      children,
      composeAdhocTheme,
      goodKey,
      theme,
    }) => {
      const t = useTheme('Themed', undefined, theme, {
        composeAdhocTheme,
      });

      return (
        <TestComponent goodKey={goodKey} theme={t}>
          {children}
        </TestComponent>
      );
    };

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
        const Themed2: FunctionComponent = () => {
          const composed = useTheme('Themed2');

          return <TestComponent theme={composed} />;
        };
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
    const Themed: FunctionComponent<{
      children?: ReactNode;
      composeAdhocTheme?: COMPOSE;
      composeContextTheme?: COMPOSE;
      goodKey?: string;
      theme?: ThemeI;
      themePriority?: PRIORITY;
    }> = ({
      children,
      composeAdhocTheme,
      composeContextTheme,
      goodKey,
      theme,
      themePriority,
    }) => {
      const composed = useTheme('Themed', themeA, theme, {
        composeAdhocTheme,
        composeContextTheme,
        themePriority,
      });

      return (
        <TestComponent goodKey={goodKey} theme={composed}>
          {children}
        </TestComponent>
      );
    };

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
  });

  describe('02 - Options at registration', () => {
    test('01 - composeContextTheme', () => {
      const Themed: FunctionComponent<{
        composeContextTheme?: COMPOSE;
        theme?: ThemeI;
      }> = ({
        composeContextTheme,
        theme,
      }) => {
        const t = useTheme('Themed', themeA, theme, {
          // eslint-disable-next-line jest/no-conditional-in-test
          composeContextTheme: composeContextTheme ?? COMPOSE.SWAP,
        });

        return <TestComponent theme={t} />;
      };

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
      const Themed: FunctionComponent<{
        composeAdhocTheme?: COMPOSE;
        theme?: ThemeI;
      }> = ({
        composeAdhocTheme,
        theme,
      }) => {
        const t = useTheme('Themed', themeA, theme, {
          // eslint-disable-next-line jest/no-conditional-in-test
          composeAdhocTheme: composeAdhocTheme ?? COMPOSE.SWAP,
        });

        return <TestComponent theme={t} />;
      };

      snapshot(
        <Themed theme={themeB} />,
      );
      snapshot(
        <Themed composeAdhocTheme={COMPOSE.SOFT} theme={themeB} />,
      );
    });

    test('03 - themePriority', () => {
      const Themed: FunctionComponent<{
        theme?: ThemeI;
        themePriority?: PRIORITY;
      }> = ({
        theme,
        themePriority,
      }) => {
        const t = useTheme('Themed', themeA, theme, {
          // eslint-disable-next-line jest/no-conditional-in-test
          themePriority: themePriority ?? PRIORITY.ADHOC_DEFAULT_CONTEXT,
        });

        return <TestComponent theme={t} />;
      };

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
  });
});
