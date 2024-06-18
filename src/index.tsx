import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
} from 'react';

//------------------------------------------------------------------------------
// TypeScript interfaces & types.

// Note: Support of custom specifity-manipulation classes in TypeScript is too
// cumbersome, thus although it remains a functional feature for pure JavaScript,
// the TypeScript assumes these classes are always "ad", "hoc", and "context".
export interface ThemeI {
  ad: string;
  hoc: string;
  context: string;
}

// NOTE: KeyT should be a union of string literals - valid theme keys.
export type Theme<KeyT extends string> =
  // NOTE: Here if KeyT is a union of string literals (e.g. 'a' | 'b'),
  // it is not extendable by a string, thus the condition will enter its
  // second branch. Otherwise, the result will be `never` - this is our
  // safeguard against incorrect usage.
  string extends KeyT ? never : ThemeI & { [key in KeyT]?: string };

export interface ThemeMap { [key: string]: ThemeI | undefined }

export interface ThemeableComponentProps {
  theme: ThemeI;
}

export interface ThemePropsMapper<
  ComponentProps extends ThemeableComponentProps,
> {
  (
    props: ThemedComponentProps<ComponentProps>,
    theme: ComponentProps['theme'],
  ): ComponentProps;
}

export type ThemedOptions<
  ComponentProps extends ThemeableComponentProps,
> = {
  // As noted above, these options are not intended for TypeScript use case,
  // where they are assumed to be fixed at the values below; but their custom
  // values are still supported in plain JavaScript.
  adhocTag?: 'ad.hoc';
  contextTag?: 'context';

  composeAdhocTheme?: COMPOSE;
  composeContextTheme?: COMPOSE;
  mapThemeProps?: ThemePropsMapper<ComponentProps>,
  themePriority?: PRIORITY,
};

export type ThemedComponentProps<
  ComponentProps extends ThemeableComponentProps,
> = Omit<ComponentProps, 'theme'> & {
  children?: React.ReactNode;
  composeAdhocTheme?: COMPOSE;
  composeContextTheme?: COMPOSE;
  theme?: ComponentProps['theme'];
  themePriority?: PRIORITY;
  mapThemeProps?: ThemePropsMapper<ComponentProps>;
};

export type ThemedComponent<
  ComponentProps extends ThemeableComponentProps,
> = React.FunctionComponent<ThemedComponentProps<ComponentProps>>;

export type ThemedComponentFactory<ComponentProps extends ThemeableComponentProps> = (
  component: React.ComponentType<ComponentProps>,
) => ThemedComponent<ComponentProps>;

//------------------------------------------------------------------------------
// Constants.

/** Supported theme composition modes. */
export enum COMPOSE {
  DEEP = 'DEEP',
  SOFT = 'SOFT',
  SWAP = 'SWAP',
}

/** Supported theme priorities. */
export enum PRIORITY {
  ADHOC_CONTEXT_DEFAULT = 'ADHOC_CONTEXT_DEFAULT',
  ADHOC_DEFAULT_CONTEXT = 'ADHOC_DEFAULT_CONTEXT',
}

const INVALID_COMPOSE = 'Invalid composition mode';

const Context = createContext<ThemeMap | undefined>(undefined);

//------------------------------------------------------------------------------
// Here comes the logic.

export type ThemeProviderProp = {
  children?: React.ReactNode;
  themes?: ThemeMap;
};

/**
 * Theme provider defines style contexts. It accepts a single property
 * `themes` (`theme` in compatibility modes).
 *
 * In case of nested context, the context theme from the closest context takes
 * the effect on a component. If the context theme for a component is not set in
 * the closest context, but it is set in an outer context, the theme from outer
 * context will be applied.
 *
 * @param props.children React content to render in-place of
 * <ThemeProvider> component.
 *
 * @param props.themes The mapping of between themeable component names
 * (the first parameter passed into themed() function for such components
 * registration), and context themes to apply to them within the context.
 *
 * @param props.theme Fallback mapping for backward compatibility
 * with `react-css-themr` and `react-css-super-themr` libraries.
 */
export function ThemeProvider({ children, themes }: ThemeProviderProp) {
  const contextThemes = useContext(Context);

  // useMemo() ensures we don't generate a new "value" on each render when both
  // "contextThemes" and "themes" are defined.
  const value: ThemeMap = useMemo(() => (
    contextThemes && themes
      ? { ...contextThemes, ...themes }
      : (contextThemes || themes || {})
  ), [contextThemes, themes]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

/**
 * Composes two themes.
 * @param high High priorty theme.
 * @param low Low priority theme.
 * @param mode Composition mode.
 * @param tag Specifity tag(s).
 * @return Composed theme.
 */
function compose<CustomTheme extends ThemeI>(
  high: CustomTheme | undefined,
  low: CustomTheme | undefined,
  mode: COMPOSE,
  tag: 'context' | ['ad', 'hoc'],
): CustomTheme | undefined {
  if (high && low) {
    switch (mode) {
      case COMPOSE.DEEP: {
        const res = { ...low };
        const prefix = Array.isArray(tag)
          ? `${high[tag[0]] || ''} ${high[tag[1]] || ''}`
          : (high[tag] || '');
        /* eslint-disable no-restricted-syntax */
        for (const key in high) {
          if (res[key]) {
            res[key] = `${res[key]} ${prefix} ${high[key]}` as
              CustomTheme[Extract<keyof CustomTheme, string>];
          } else res[key] = high[key];
        }
        /* eslint-enable no-restricted-syntax */
        return res;
      }
      case COMPOSE.SOFT: return { ...low, ...high };
      case COMPOSE.SWAP: return high;
      default: throw new Error(INVALID_COMPOSE);
    }
  } else return high || low;
}

/**
 * Registers a themeable component under given name, and with an optional
 * default theme.
 * @param componentName Themed component name, which should be used to
 * provide its context theme via <ThemeProvider>.
 * @param [defaultTheme] Default theme, in form of theme key to
 * CSS class name mapping. If you have CSS modules and SCSS loader correctly
 * configured, the import `import theme from 'some.theme.scss';` will result
 * in `theme` object you can pass here. In some cases, it might be also legit
 * to construct theme object in a diffent way.
 * @param [options] Additional parameters.
 * @param [options.composeAdhocTheme=COMPOSE.DEEP] Composition type for
 * _ad hoc_ theme, which is merged into the result of composition of lower
 * priority themes. Must be one of COMPOSE values.
 * @param [options.composeContextTheme=COMPOSE.DEEP] Composition type
 * for context theme into default theme (or vice verca, if opted by
 * `themePriority` override). Must be one of COMPOSE values.
 * @param [options.themePriority=ADHOC_CONTEXT_DEFAULT] Theme
 * priorities. Must be one of PRIORITY values.
 * @param [options.mapThemeProps] By default, the themeable
 * component
 * created by `themed()` does not pass into the original wrapped component any
 * properties introduced by this library. It only passes down properties it
 * does not recognize, alongside the composed `theme`, and forwarded DOM `ref`.
 * In case a different behavior is needed, the property mapper can be
 * specified with this option. It should be a function with
 * ThemePropsMapper signature, and if present the result from this
 * function will be passed down the wrapped component as its props.
 * @param [options.contextTag=context] Override of `context` theme
 * key.
 * @param [options.adhocTag=ad.hoc] Override of `ad.hoc` theme key.
 * @param [options.composeTheme] Compatibility compose mode.
 * @param [options.mapThemrProps] Compatibility prop mapper.
 * @return Themeable component, registered under
 * given name.
 */
function themedImpl<ComponentProps extends ThemeableComponentProps>(
  componentName: string,
  defaultTheme?: ComponentProps['theme'],
  options: ThemedOptions<ComponentProps> = {},
) {
  const {
    adhocTag = 'ad.hoc',
    contextTag = 'context',
    composeAdhocTheme: oComposeAdhocTheme,
    composeContextTheme: oComposeContextTheme,
    mapThemeProps: oMapThemeProps,
    themePriority: oThemePriority,
  } = options;

  const aTag = adhocTag.split('.') as ['ad', 'hoc'];
  if (aTag.length !== 2 || !aTag[0] || !aTag[1]) {
    throw new Error('Invalid adhoc theme tag');
  }

  type ComponentTheme = ComponentProps['theme'];
  type CustomThemedComponentProps = ThemedComponentProps<ComponentProps>;
  type CustomThemedComponent = ThemedComponent<ComponentProps>;

  return (
    ThemeableComponent: React.ComponentType<ComponentProps>,
  ): CustomThemedComponent => {
    const component = forwardRef<unknown, CustomThemedComponentProps>(
      (properties, ref) => {
        const {
          children,
          composeAdhocTheme,
          composeContextTheme,
          theme,
          themePriority,
          mapThemeProps,
          ...rest
        } = properties;

        const context = useContext(Context) || {};
        const contextTheme = context[componentName] as ComponentTheme | undefined;

        /* Deduction of applicable theme composition and priority settings. */
        const mapper = mapThemeProps || oMapThemeProps;
        const priority = themePriority || oThemePriority
          || PRIORITY.ADHOC_CONTEXT_DEFAULT;
        const composeAdhoc: COMPOSE = composeAdhocTheme as COMPOSE
          || oComposeAdhocTheme || COMPOSE.DEEP;
        const composeContext: COMPOSE = composeContextTheme as COMPOSE
          || oComposeContextTheme || COMPOSE.DEEP;

        /* Theme composition. */
        let res: ComponentTheme | undefined = priority === PRIORITY.ADHOC_DEFAULT_CONTEXT
          ? compose<ComponentTheme>(
            defaultTheme,
            contextTheme,
            composeContext,
            contextTag,
          )
          : compose<ComponentTheme>(
            contextTheme,
            defaultTheme,
            composeContext,
            contextTag,
          );

        res = compose<ComponentTheme>(
          theme,
          res,
          composeAdhoc,
          aTag,
        ) || ({} as ComponentTheme);

        /* Props deduction. */
        const p: ComponentProps = mapper
          ? mapper({ ...properties, ref }, res) : {
            ...rest as ComponentProps,
            theme: res,
            ref,
          };

        /* eslint-disable react/jsx-props-no-spreading */
        return <ThemeableComponent {...p}>{children}</ThemeableComponent>;
        /* eslint-enable react/jsx-props-no-spreading */
      },
    );

    return (component as unknown) as CustomThemedComponent;
  };
}

function themed<ComponentProps extends ThemeableComponentProps>(
  componentName: string,

  defaultThemeOrOptions?: ComponentProps['theme']
  | ThemedOptions<ComponentProps>,

  options?: ThemedOptions<ComponentProps>,
): ThemedComponentFactory<ComponentProps>;

function themed<ComponentProps extends ThemeableComponentProps>(
  component: React.ComponentType<ComponentProps>,
  componentName: string,

  defaultThemeOrOptions?: ComponentProps['theme']
  | ThemedOptions<ComponentProps>,

  options?: ThemedOptions<ComponentProps>,
): ThemedComponent<ComponentProps>;

function themed<ComponentProps extends ThemeableComponentProps>(
  // 1st argument.
  componentOrComponentName: React.ComponentType<ComponentProps> | string,

  // 2nd argument.
  componentNameOrDefaultTheme?: string | ComponentProps['theme'],

  // 3rd argument.
  defaultThemeOrOptions?:
  | ComponentProps['theme']
  | ThemedOptions<ComponentProps>,

  // 4th argument.
  options?: ThemedOptions<ComponentProps>,
): ThemedComponentFactory<ComponentProps>
  | ThemedComponent<ComponentProps> {
  type OpsT = ThemedOptions<ComponentProps>;

  let component: React.ComponentType<ComponentProps> | undefined;
  let componentName: string;
  let defaultTheme: ComponentProps['theme'] | undefined;
  let ops: OpsT | undefined;

  if (typeof componentOrComponentName === 'string') {
    // 1st argument: component name.
    componentName = componentOrComponentName;

    // 2nd argument: default theme.
    if (typeof componentNameOrDefaultTheme === 'string') {
      throw Error('Second argument is not expected to be a string');
    }

    defaultTheme = componentNameOrDefaultTheme as ComponentProps['theme'];

    // 3rd argument: options.
    ops = defaultThemeOrOptions as OpsT;

    // 4th argument: none.
    if (options) throw Error('4th argument is not expected');
  } else {
    // 1st argument: component.
    component = componentOrComponentName;

    // 2nd argument: component name.
    if (typeof componentNameOrDefaultTheme !== 'string') {
      throw Error('Second argument is not a string');
    }

    componentName = componentNameOrDefaultTheme;

    // 3rd argument: default theme.
    defaultTheme = defaultThemeOrOptions as ComponentProps['theme'];

    // 4th argument: options.
    ops = options;
  }

  const impl = themedImpl<ComponentProps>(
    componentName,
    defaultTheme,
    ops,
  );

  return component ? impl(component) : impl;
}

export default themed;
