/**
 * Dr. Pogodin's React Themes.
 */

import { createContext, forwardRef, useContext } from 'react';

const INVALID_COMPOSE = 'Invalid composition mode';

export type ThemeT = { [key: string]: string };
export type ThemeMapT = { [key: string]: ThemeT };

const Context = createContext<ThemeMapT>({});

/**
 * Compatibility modes supported by setCompatibilityMode().
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export enum COMPATIBILITY_MODE {
  REACT_CSS_THEMR = 'REACT_CSS_THEMR',
  REACT_CSS_SUPER_THEMR = 'REACT_CSS_SUPER_THEMR',
}

let compatibilityMode: COMPATIBILITY_MODE | null = null;

const VALID_COMPATIBILITY_MODES = Object.values(COMPATIBILITY_MODE);

/**
 * Switches `react-themes` library into a compatibility mode,
 * where it emulates behavior of other similar theming libraries.
 * @param {string} mode COMPATIBILITY_MODE values.
 */
export function setCompatibilityMode(mode: COMPATIBILITY_MODE | null) {
  // This is a runtime safeguard for pure-JS use.
  if (mode && !VALID_COMPATIBILITY_MODES.includes(mode)) {
    throw new Error('Invalid compatibility mode');
  }

  compatibilityMode = mode || null;
}

/**
 * Supported theme composition modes.
 */
export enum COMPOSE {
  DEEP = 'DEEP',
  SOFT = 'SOFT',
  SWAP = 'SWAP',
}

type LegacyComposeT = 'deeply' | 'softly' | false;

/**
 * Maps an array of legacy compose modes to one of current compose modes.
 * @param args
 * @return
 */
function legacyCompose(...args: (COMPOSE | LegacyComposeT | undefined)[]): COMPOSE {
  for (let i = 0; i < args.length; i += 1) {
    switch (args[i]) {
      case COMPOSE.DEEP:
      case 'deeply':
        return COMPOSE.DEEP;
      case COMPOSE.SOFT:
      case 'softly':
        return COMPOSE.SOFT;
      case COMPOSE.SWAP:
      case false:
        return COMPOSE.SWAP;
      default:
    }
  }
  throw new Error(INVALID_COMPOSE);
}

/**
 * Supported theme priorities.
 */
export enum PRIORITY {
  ADHOC_CONTEXT_DEFAULT = 'ADHOC_CONTEXT_DEFAULT',
  ADHOC_DEFAULT_CONTEXT = 'ADHOC_DEFAULT_CONTEXT',
}

type LegacyPriorityT = 'adhoc-default-context' | 'adhoc-context-default';

/**
 * Maps legacy priority to the current one.
 * @param priority
 * @ignore
 */
function legacyPriority(priority: PRIORITY | LegacyPriorityT): PRIORITY {
  switch (priority) {
    case PRIORITY.ADHOC_CONTEXT_DEFAULT:
    case 'adhoc-context-default':
      return PRIORITY.ADHOC_CONTEXT_DEFAULT;
    case PRIORITY.ADHOC_DEFAULT_CONTEXT:
    case 'adhoc-default-context':
      return PRIORITY.ADHOC_DEFAULT_CONTEXT;
    default:
      throw new Error('Invalid priority');
  }
}

export type ThemeProviderPropT = {
  children?: React.ReactNode;
  theme?: ThemeMapT;
  themes?: ThemeMapT;
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
 * @prop {ReactNode} children React content to render in-place of
 * <ThemeProvider> component.
 * @prop {object} themes The mapping of between themeable component names
 * (the first parameter passed into themed() function for such components
 * registration), and context themes to apply to them within the context.
 * @prop {object} theme Fallback mapping for backward compatibility
 * with `react-css-themr` and `react-css-super-themr` libraries.
 */
export function ThemeProvider({
  children,
  theme: legacyThemes = {},
  themes = {},
}: ThemeProviderPropT) {
  const contextThemes = useContext(Context);
  let value = compatibilityMode ? legacyThemes : themes;
  if (contextThemes) value = { ...contextThemes, ...value };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

/*
ThemeProvider.propTypes = {
  children: PT.node,
  theme: PT.shape({}),
  themes: PT.shape({}),
};
*/

ThemeProvider.defaultProps = {
  children: null,
  theme: null,
  themes: null,
};

/**
 * Composes two themes.
 * @param high High priorty theme.
 * @param low Low priority theme.
 * @param mode Composition mode.
 * @param tag Specifity tag(s).
 * @return Composed theme.
 */
function compose<SpecificThemeT extends ThemeT>(
  high: SpecificThemeT | undefined,
  low: SpecificThemeT | undefined,
  mode: COMPOSE,
  tag: string | string[],
): SpecificThemeT | undefined {
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
              SpecificThemeT[Extract<keyof SpecificThemeT, string>];
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

export type ThemePropsMapperT<
  ComponentThemeT extends ThemeT,
  ComponentPropsT extends {},
> =
  (props: object, theme: ComponentThemeT) => ComponentPropsT & {
    theme: ComponentThemeT;
  };

export type ThemedOptionsT<
  ComponentThemeT extends ThemeT,
  ComponentPropsT extends {},
> = {
  adhocTag?: string;
  contextTag?: string;
  composeAdhocTheme?: COMPOSE | LegacyComposeT;
  composeContextTheme?: COMPOSE | LegacyComposeT;
  composeTheme?: LegacyComposeT;
  mapThemeProps?: ThemePropsMapperT<ComponentThemeT, ComponentPropsT>,
  mapThemrProps?: ThemePropsMapperT<ComponentThemeT, ComponentPropsT>,
  themePriority?: PRIORITY | LegacyPriorityT,
};

export type ThemedComponentPropsT<
  ComponentThemeT extends ThemeT,
  ComponentPropsT extends {},
> = Omit<ComponentPropsT, 'theme'> & {
  castTheme?: boolean;
  children?: React.ReactNode;
  composeAdhocTheme?: COMPOSE | LegacyComposeT;
  composeContextTheme?: COMPOSE | LegacyComposeT;
  theme?: ComponentThemeT;
  themePriority?: PRIORITY | LegacyPriorityT;
  mapThemeProps?: ThemePropsMapperT<ComponentThemeT, ComponentPropsT>;
};

// This is similar to validator from 'prop-types', just requires two arguments
// less.
type Validator = (
  props: { [key: string]: any },
  propName: string,
  componentName: string,
) => Error | null;

type RequireableValidator = Validator & {
  isRequired: Validator;
};

export type ThemeableComponentT<
  ComponentThemeT extends ThemeT,
  ComponentPropsT extends {},
> =
  React.ComponentType<ComponentPropsT & {
    children?: React.ReactNode;
    theme: ComponentThemeT;
  }>;

/**
 * Registers a themeable component under given name, and with an optional
 * default theme.
 * @param componentName Themed component name, which should be used to
 * provide its context theme via <ThemeProvider>.
 * @param themeSchema An array of valid theme keys
 * recognized by the wrapped component, beside the keys corresponding
 * to _ad hoc_ and context tags. It is used for theme validation, and
 * casting (if opted).
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
function themedImpl<
  ComponentThemeT extends ThemeT,
  ComponentPropsT extends {},
>(
  componentName: string,
  themeSchema?: string[],
  defaultTheme?: ComponentThemeT,
  options: ThemedOptionsT<ComponentThemeT, ComponentPropsT> = {},
) {
  const {
    adhocTag = 'ad.hoc',
    contextTag = 'context',
    composeAdhocTheme: oComposeAdhocTheme,
    composeContextTheme: oComposeContextTheme,
    composeTheme: oLegacyComposeTheme,
    mapThemeProps: oMapThemeProps,
    mapThemrProps: oLegacyMapThemeProps,
    themePriority: oThemePriority,
  } = options;

  const aTag: string[] = adhocTag.split('.');
  if (aTag.length !== 2 || !aTag[0] || !aTag[1]) {
    throw new Error('Invalid adhoc theme tag');
  }

  const validThemeKeys = themeSchema ? [...themeSchema] : [];
  validThemeKeys.push(aTag[0], aTag[1], contextTag);
  const validThemeKeysSet = new Set(validThemeKeys);

  type SThemedComponentPT = ThemedComponentPropsT<ComponentThemeT, ComponentPropsT>;

  type ThemedComponentT = React.FunctionComponent<SThemedComponentPT> & {
    themeType: RequireableValidator;
  };

  return (
    ThemeableComponent: ThemeableComponentT<ComponentThemeT, ComponentPropsT>,
  ): ThemedComponentT => {
    const WrappedComponentBuffer = forwardRef<unknown, SThemedComponentPT>(
      (properties, ref) => {
        const {
          castTheme,
          children,
          composeAdhocTheme,
          composeContextTheme,
          theme,
          themePriority,
          mapThemeProps,
          ...rest
        } = properties;
        const contextTheme = useContext(Context)[componentName] as ComponentThemeT;

        /* Deduction of applicable theme composition and priority settings. */
        let mapper;
        let priority;
        let composeAdhoc: COMPOSE;
        let composeContext: COMPOSE;
        switch (compatibilityMode) {
          case COMPATIBILITY_MODE.REACT_CSS_THEMR:
            mapper = oLegacyMapThemeProps;
            priority = PRIORITY.ADHOC_DEFAULT_CONTEXT;
            composeAdhoc = legacyCompose(
              oLegacyComposeTheme,
              COMPOSE.DEEP,
            );
            composeContext = composeAdhoc;
            break;
          case COMPATIBILITY_MODE.REACT_CSS_SUPER_THEMR:
            mapper = oLegacyMapThemeProps;
            priority = legacyPriority(
              themePriority
              || oThemePriority
              || PRIORITY.ADHOC_CONTEXT_DEFAULT,
            );
            composeAdhoc = legacyCompose(
              composeAdhocTheme,
              oComposeAdhocTheme,
              COMPOSE.DEEP,
            );
            composeContext = legacyCompose(
              composeContextTheme,
              oComposeContextTheme,
              COMPOSE.SOFT,
            );
            break;
          default:
            mapper = mapThemeProps || oMapThemeProps;
            priority = themePriority || oThemePriority
            || PRIORITY.ADHOC_CONTEXT_DEFAULT;
            composeAdhoc = composeAdhocTheme as COMPOSE
            || oComposeAdhocTheme || COMPOSE.DEEP;
            composeContext = composeContextTheme as COMPOSE
            || oComposeContextTheme || COMPOSE.DEEP;
        }

        /* Theme composition. */
        let res: ComponentThemeT | undefined = priority === PRIORITY.ADHOC_DEFAULT_CONTEXT
          ? compose(defaultTheme, contextTheme, composeContext, contextTag)
          : compose(contextTheme, defaultTheme, composeContext, contextTag);

        let adhocTheme = theme;
        if (castTheme && theme) {
          const castedTheme: ThemeT = {};
          validThemeKeys.forEach((key) => {
            const clazz = theme[key];
            if (clazz) castedTheme[key] = clazz;
          });
          adhocTheme = castedTheme as ComponentThemeT;
        }

        res = compose(adhocTheme, res, composeAdhoc, aTag) || ({} as ComponentThemeT);

        /* Props deduction. */
        const p: ComponentPropsT & {
          theme: ComponentThemeT,
        } = mapper
          ? mapper({ ...properties, ref }, res) : {
            ...rest as ComponentPropsT,
            theme: res,
            ref,
          };

        /* eslint-disable react/jsx-props-no-spreading */
        return <ThemeableComponent {...p}>{children}</ThemeableComponent>;
        /* eslint-enable react/jsx-props-no-spreading */
      },
    );

    const WrappedComponent: ThemedComponentT = (
      WrappedComponentBuffer as unknown) as ThemedComponentT;

    /**
     * `prop-types` compatible prop checker for `theme` prop.
     */
    const validator = (
      props: { [key: string]: any },
      propName: string,
      name: string,
    ) => {
      const theme: ThemeT = props[propName];
      if (!theme) return null;

      const errors: string[] = [];
      if (typeof theme[aTag[0]] !== 'string'
      || typeof theme[aTag[1]] !== 'string') {
        errors.push('- Misses adhoc tag classes');
      }
      if (typeof theme[contextTag] !== 'string') {
        errors.push('- Misses context tag class');
      }
      Object.keys(theme).forEach((key) => {
        if (!validThemeKeysSet.has(key)) {
          errors.push(`- Unexpected theme key ${key}`);
        }
      });
      validThemeKeys.forEach((key) => {
        const type = typeof theme[key];
        if (type !== 'undefined' && type !== 'string') {
          errors.push(`- ${key} class is defined, but not a string`);
        }
      });
      if (errors.length) {
        const errorString: string = errors.join('\n');
        return new Error(
          `Theme given to ${name} has multiple issues:\n${errorString}`,
        );
      }
      return null;
    };

    validator.isRequired = (
      props: { [key: string]: any },
      propName: string,
      name: string,
    ) => (
      props[propName] ? validator(props, propName, name)
        : Error(`Theme is not provided to ${name} component`)
    );

    WrappedComponent.themeType = validator;

    return WrappedComponent;
  };
}

/**
 * Exposes `themed()` as a function of either 3 or 4 arguments. In the first
 * case it is:
 * `themed(componentName, defaultTheme, options)`,
 * in the second (recommended) case it is:
 * `themed(componentName, themeSchema, defaultTheme, options)`
 *
 * In case of TypeScript it has an optional generic argument, allowing
 * to enforce a specific theme layout, beyond the default lax
 * `{ [key: string]: string }`.
 *
 * @param args
 * @return
 */
export default function themedWrapper<
  ComponentThemeT extends ThemeT = ThemeT,
  ComponentPropsT extends {} = {},
>(
  componentName: string,
  themeSchemaOrDefaultTheme?: string[] | ComponentThemeT,
  defaultThemeOrOptions?: ComponentThemeT | ThemedOptionsT<ComponentThemeT, ComponentPropsT>,
  options?: ThemedOptionsT<ComponentThemeT, ComponentPropsT>,
) {
  return Array.isArray(themeSchemaOrDefaultTheme)
    ? themedImpl<ComponentThemeT, ComponentPropsT>(
      componentName,
      themeSchemaOrDefaultTheme,
      defaultThemeOrOptions as ComponentThemeT | undefined,
      options,
    )
    : themedImpl<ComponentThemeT, ComponentPropsT>(
      componentName,
      undefined,
      themeSchemaOrDefaultTheme,
      defaultThemeOrOptions,
    );
}

export function themedComponent<
  ComponentThemeT extends ThemeT,
  ComponentPropsT extends {},
  DefaultThemeT extends ComponentThemeT,
>(
  componentName: string,
  component: ThemeableComponentT<ComponentThemeT, ComponentPropsT>,
  defaultTheme?: DefaultThemeT,
  options?: ThemedOptionsT<ComponentThemeT, ComponentPropsT>,
) {
  return themedImpl<ComponentThemeT, ComponentPropsT>(
    componentName,
    undefined,
    defaultTheme,
    options,
  )(component);
}
