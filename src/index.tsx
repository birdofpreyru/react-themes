/**
 * Dr. Pogodin's React Themes.
 */

import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
} from 'react';

const INVALID_COMPOSE = 'Invalid composition mode';

export type ThemeT<
  AdHocTag1T extends string = 'ad',
  AdHocTag2T extends string = 'hoc',
  ContextTagT extends string = 'context',
> = {
  // A valid theme stylesheet must have three special classes (by default, named
  // "ad", "hoc", and "context"), which are used by the library to manage specifity
  // of (S)CSS rules from different merged themes. To work as intended, these
  // special classes should wrap all other classes in the theme, as shown in
  // the tutorial:
  //
  //  *,
  //  .ad.hoc,
  //  .context {
  //    .aThemeClass {}
  //  }
  [key in AdHocTag1T | AdHocTag2T | ContextTagT]: string;
} & {
  // This allows the theme to have any additional classes, wrapped inside our
  // three special classes (at the moment the library is not able to verify
  // whether they are wrapped correctly).
  [key: string]: string;
};

export interface ThemeMapT { [key: string]: ThemeT | undefined }

const Context = createContext<ThemeMapT | undefined>(undefined);

/**
 * Supported theme composition modes.
 */
export enum COMPOSE {
  DEEP = 'DEEP',
  SOFT = 'SOFT',
  SWAP = 'SWAP',
}

/**
 * Supported theme priorities.
 */
export enum PRIORITY {
  ADHOC_CONTEXT_DEFAULT = 'ADHOC_CONTEXT_DEFAULT',
  ADHOC_DEFAULT_CONTEXT = 'ADHOC_DEFAULT_CONTEXT',
}

export type ThemeProviderPropT = {
  children?: React.ReactNode;
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
  themes,
}: ThemeProviderPropT) {
  const contextThemes = useContext(Context);

  // useMemo() ensures we don't generate a new "value" on each render when both
  // "contextThemes" and "themes" are defined.
  const value: ThemeMapT = useMemo(() => (
    contextThemes && themes
      ? { ...contextThemes, ...themes }
      : (contextThemes || themes || {})
  ), [contextThemes, themes]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

ThemeProvider.defaultProps = {
  children: undefined,
  themes: undefined,
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
  ComponentPropsT extends ThemeableComponentPropsT,
> = (
  props: ThemedComponentPropsT<ComponentPropsT>,
  theme: ComponentPropsT['theme'],
) => ComponentPropsT;

export type ThemedOptionsT<
  ComponentPropsT extends ThemeableComponentPropsT,
> = {
  adhocTag?: string;
  contextTag?: string;
  composeAdhocTheme?: COMPOSE;
  composeContextTheme?: COMPOSE;
  mapThemeProps?: ThemePropsMapperT<ComponentPropsT>,
  themePriority?: PRIORITY,
};

export type ThemedComponentPropsT<
  ComponentPropsT extends ThemeableComponentPropsT,
> = Omit<ComponentPropsT, 'theme'> & {
  castTheme?: boolean;
  children?: React.ReactNode;
  composeAdhocTheme?: COMPOSE;
  composeContextTheme?: COMPOSE;
  theme?: ComponentPropsT['theme'];
  themePriority?: PRIORITY;
  mapThemeProps?: ThemePropsMapperT<ComponentPropsT>;
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

export type ThemeableComponentPropsT = {
  theme: ThemeT;
  [key: string]: any;
};

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
  ComponentPropsT extends ThemeableComponentPropsT,
>(
  componentName: string,
  themeSchema?: string[],
  defaultTheme?: ComponentPropsT['theme'],
  options: ThemedOptionsT<ComponentPropsT> = {},
) {
  const {
    adhocTag = 'ad.hoc',
    contextTag = 'context',
    composeAdhocTheme: oComposeAdhocTheme,
    composeContextTheme: oComposeContextTheme,
    mapThemeProps: oMapThemeProps,
    themePriority: oThemePriority,
  } = options;

  const aTag: string[] = adhocTag.split('.');
  if (aTag.length !== 2 || !aTag[0] || !aTag[1]) {
    throw new Error('Invalid adhoc theme tag');
  }

  const validThemeKeys = themeSchema ? [...themeSchema] : [];
  validThemeKeys.push(aTag[0], aTag[1], contextTag);
  const validThemeKeysSet = new Set(validThemeKeys);

  type SThemedComponentPT = ThemedComponentPropsT<ComponentPropsT>;

  type ThemedComponentT = React.FunctionComponent<SThemedComponentPT> & {
    themeType: RequireableValidator;
  };

  return (
    ThemeableComponent: React.ComponentType<ComponentPropsT>,
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

        const context = useContext(Context) || {};
        const contextTheme = context[componentName] as ComponentPropsT['theme'] | undefined;

        /* Deduction of applicable theme composition and priority settings. */
        const mapper = mapThemeProps || oMapThemeProps;
        const priority = themePriority || oThemePriority
          || PRIORITY.ADHOC_CONTEXT_DEFAULT;
        const composeAdhoc: COMPOSE = composeAdhocTheme as COMPOSE
          || oComposeAdhocTheme || COMPOSE.DEEP;
        const composeContext: COMPOSE = composeContextTheme as COMPOSE
          || oComposeContextTheme || COMPOSE.DEEP;

        /* Theme composition. */
        let res: ComponentPropsT['theme'] | undefined = priority === PRIORITY.ADHOC_DEFAULT_CONTEXT
          ? compose(defaultTheme, contextTheme, composeContext, contextTag)
          : compose(contextTheme, defaultTheme, composeContext, contextTag);

        let adhocTheme = theme;
        if (castTheme && theme) {
          const castedTheme: ThemeT = {} as ThemeT;
          validThemeKeys.forEach((key) => {
            const clazz = theme[key];
            if (clazz) castedTheme[key] = clazz;
          });
          adhocTheme = castedTheme as ComponentPropsT['theme'];
        }

        res = compose(adhocTheme, res, composeAdhoc, aTag) || ({} as ComponentPropsT['theme']);

        /* Props deduction. */
        const p: ComponentPropsT = mapper
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
  ComponentPropsT extends ThemeableComponentPropsT,
>(
  componentName: string,
  themeSchemaOrDefaultTheme?: string[] | ComponentPropsT['theme'],
  defaultThemeOrOptions?: ComponentPropsT['theme'] | ThemedOptionsT<ComponentPropsT>,
  options?: ThemedOptionsT<ComponentPropsT>,
) {
  return Array.isArray(themeSchemaOrDefaultTheme)
    ? themedImpl<ComponentPropsT>(
      componentName,
      themeSchemaOrDefaultTheme,
      defaultThemeOrOptions as ComponentPropsT['theme'] | undefined,
      options,
    )
    : themedImpl<ComponentPropsT>(
      componentName,
      undefined,
      themeSchemaOrDefaultTheme,
      defaultThemeOrOptions as ThemedOptionsT<ComponentPropsT>,
    );
}

export function themedComponent<
  ComponentPropsT extends ThemeableComponentPropsT,
>(
  componentName: string,
  component: React.ComponentType<ComponentPropsT>,
  defaultTheme?: ComponentPropsT['theme'],
  options?: ThemedOptionsT<ComponentPropsT>,
) {
  return themedImpl<ComponentPropsT>(
    componentName,
    undefined,
    defaultTheme,
    options,
  )(component);
}
