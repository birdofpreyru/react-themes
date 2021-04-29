/**
 * Dr. Pogodin's React Themes.
 */

import { createContext, forwardRef, useContext } from 'react';
import PT from 'prop-types';

const INVALID_COMPOSE = 'Invalid composition mode';

const context = createContext({});

let compatibilityMode = null;

/**
 * Compatibility modes supported by {@link setCompatibilityMode}.
 * @prop {string} REACT_CSS_THEMR Equals `REACT_CSS_THEMR`.
 * In this mode `react-themes` library emulates
 * [`react-css-themr`](https://www.npmjs.com/package/react-css-themr):
 * it will accept the same parameters, and use different default settings
 * to mimic `react-css-themr` behavior.
 * @prop {string} REACT_CSS_SUPER_THEMR Equals `REACT_CSS_SUPER_THEMR`.
 * In this mode `react-themes` library emulates
 * [`react-css-super-themr`](https://www.npmjs.com/package/react-css-super-themr):
 * it will accept the same parameters, and use different default settings
 * to mimic `react-css-themr` behavior.
 */
export const COMPATIBILITY_MODE = {
  REACT_CSS_THEMR: 'REACT_CSS_THEMR',
  REACT_CSS_SUPER_THEMR: 'REACT_CSS_SUPER_THEMR',
};

const VALID_COMPATIBILITY_MODES = Object.values(COMPATIBILITY_MODE);

/**
 * Switches `react-themes` library into a compatibility mode,
 * where it emulates behavior of other similar theming libraries.
 * @param {string} mode Compatibility mode, one of {@link COMPATIBILITY_MODE}
 * values.
 */
export function setCompatibilityMode(mode) {
  if (mode && !VALID_COMPATIBILITY_MODES.includes(mode)) {
    throw new Error('Invalid compatibility mode');
  }
  compatibilityMode = mode || null;
}

/**
 * Supported theme composition modes. Two component themes with lower (`L`),
 * and higher (`H`) priorities can be merged in the following way:
 * @prop {string} DEEP Equals `DEEP`. In deep composition mode all classes from
 * `H` are applied with higher specifity, on top of all classes from `L`,
 * which are applied with lower specifity. Thus, in case of conflicting rules,
 * theme `H` overrides `L`, but otherwise rules from `L` are used as defaults.
 * It is default composition mode.
 * @prop {string} SOFT Equals `SOFT`. In soft composition mode all classes from
 * `H` are applied, and while classes from theme `L` are applied only if they
 * are absent in theme `H`. Thus, any classes defined in `H` completely override
 * corresponding classes from `L`.`
 * @prop {string} SWAP Equals `SWAP`. In swap mode only classes from theme `H`
 * are applied, thus theme `H` completely overrides `L`.
 */
export const COMPOSE = {
  DEEP: 'DEEP',
  SOFT: 'SOFT',
  SWAP: 'SWAP',
};

const LEGACY_COMPOSE = {
  DEEP: 'deeply',
  SOFT: 'softly',
  SWAP: false,
};

/**
 * Maps an array of legacy compose modes to one of current compose modes.
 * @param  {...any} args
 * @return {String}
 * @ignore
 */
function legacyCompose(...args) {
  for (let i = 0; i < args.length; i += 1) {
    switch (args[i]) {
      case COMPOSE.DEEP:
      case LEGACY_COMPOSE.DEEP:
        return COMPOSE.DEEP;
      case COMPOSE.SOFT:
      case LEGACY_COMPOSE.SOFT:
        return COMPOSE.SOFT;
      case COMPOSE.SWAP:
      case LEGACY_COMPOSE.SWAP:
        return COMPOSE.SWAP;
      default:
    }
  }
  throw new Error(INVALID_COMPOSE);
}

/**
 * Supported theme priorities.
 * @prop {string} ADHOC_CONTEXT_DEFAULT Equals `ADHOC_CONTEXT_DEFAULT`.
 * In this mode _ad hoc_ theme has the highest priority, followed by context,
 * then by default theme. This is default prioty mode.
 * @prop {string} ADHOC_DEFAULT_CONTEXT Equals `ADHOC_DEFAULT_CONTEXT`.
 * In this mode _ad hoc_ theme has the highest priority, followed by default
 * theme, then by context theme.
 */
export const PRIORITY = {
  ADHOC_CONTEXT_DEFAULT: 'ADHOC_CONTEXT_DEFAULT',
  ADHOC_DEFAULT_CONTEXT: 'ADHOC_DEFAULT_CONTEXT',
};

const LEGACY_PRIORITY = {
  ADHOC_CONTEXT_DEFAULT: 'adhoc-context-default',
  ADHOC_DEFAULT_CONTEXT: 'adhoc-default-context',
};

/**
 * Maps legacy priority to the current one.
 * @param {String} priority
 * @ignore
 */
function legacyPriority(priority) {
  switch (priority) {
    case PRIORITY.ADHOC_CONTEXT_DEFAULT:
    case LEGACY_PRIORITY.ADHOC_CONTEXT_DEFAULT:
      return PRIORITY.ADHOC_CONTEXT_DEFAULT;
    case PRIORITY.ADHOC_DEFAULT_CONTEXT:
    case LEGACY_PRIORITY.ADHOC_DEFAULT_CONTEXT:
      return PRIORITY.ADHOC_DEFAULT_CONTEXT;
    default:
      throw new Error('Invalid priority');
  }
}

/**
 * @category Components
 * @desc Theme provider defines style contexts. It accepts a single property
 * `themes` (`theme` in compatibility modes).
 *
 * In case of nested context, the context theme from the closest context takes
 * the effect on a component. If the context theme for a component is not set in
 * the closest context, but it is set in an outer context, the theme from outer
 * context will be applied.
 *
 * @prop {ReactNode} children React content to render in-place of
 * `<ThemeProvider>` component.
 * @prop {object} themes The mapping of between themeable component names
 * (the first parameter passed into {@link themed} function for such components
 * registration), and context themes to apply to them within the context.
 * @prop {object} theme Fallback mapping for backward compatibility
 * with `react-css-themr` and `react-css-super-themr` libraries.
 */
export function ThemeProvider({
  children,
  theme: legacyThemes,
  themes,
}) {
  const contextThemes = useContext(context);
  let value = compatibilityMode ? legacyThemes : themes;
  if (contextThemes) value = { ...contextThemes, ...value };
  return <context.Provider value={value}>{children}</context.Provider>;
}

ThemeProvider.propTypes = {
  children: PT.node,
  theme: PT.shape({}),
  themes: PT.shape({}),
};

ThemeProvider.defaultProps = {
  children: null,
  theme: null,
  themes: null,
};

/**
 * Composes two themes.
 * @param {Object} high High priorty theme.
 * @param {Object} low Low priority theme.
 * @param {String} mode Composition mode.
 * @param {String|String[]} tag Specifity tag(s).
 * @return {Object} Composed theme.
 * @ignore
 */
function compose(high, low, mode, tag) {
  if (high && low) {
    switch (mode) {
      case COMPOSE.DEEP: {
        const res = { ...low };
        const prefix = Array.isArray(tag)
          ? `${high[tag[0]] || ''} ${high[tag[1]] || ''}`
          : (high[tag] || '');
        /* eslint-disable no-restricted-syntax */
        for (const key in high) {
          if (res[key]) res[key] = `${res[key]} ${prefix} ${high[key]}`;
          else res[key] = high[key];
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
 * @typedef {object} &lt;ThemeableComponent&gt; Themeable components created
 * by {@link themed} function.
 *
 * If `themeSchema` was provided to {@link themed}, the component function will
 * have `.themeType` field (function) attached, which can be passed into React's
 * `propTypes` to check _ad hoc_ theme passed into the component (without
 * `themeSchema` provided, it will expect empty `theme`).
 *
 * Here is an example of `theme` prop check:
 * ```jsx
 * import themed from '@dr.pogodin/react-themes';
 *
 * function Component({ theme }) {
 *   return <div className={theme.container} />;
 * }
 *
 * const ThemedComponent = themed('Component', [
 *   'container',
 * ])(Component);
 *
 * Component.propTypes = {
 *   theme: ThemedComponent.themeType.isRequired,
 * };
 *
 * export default ThemedComponent;
 * ```
 * &uArr; This will warn you if theme is missing, contains unexpected fields,
 * or misses _ad hoc_, or context tag keys. In the case of _ad hoc_ styling you
 * may want to not have a dedicated stylesheet for the _ad hoc_ theme, and it
 * will be seen as an issue by this check. In such case the
 * [`castTheme`](#cast-theme) option comes handly.
 *
 * `<ThemeableComponent>` instances accept the following properties,
 * in addition to any props accepted by the original wrapped components.
 * These properties allow override theming settings for individual instances of
 * themeable components. Any props unrecognized by `react-themes` library are
 * forwared down the original wrapped component.
 *
 * @prop {boolean} [castTheme] If `true`, the component will rely on
 * `themeSchema` provided to {@link themed} function upon the component
 * creation, to pick up from _ad hoc_ theme and pass down only expected
 * theme key/values.
 * @prop {object} [theme] _Ad hoc_ theme to apply to the component instance.
 * @prop {string} [composeAdhocTheme] Allows to override composition mode of
 * _ad hoc_ theme, specified via {@link themed} function. Must be one of
 * {@link COMPOSE} values.
 * @prop {string} [composeContextTheme] Allows to override composition mode of
 * context theme, specified via {@link themed} function. Must be one of
 * {@link COMPOSE} values.
 * @prop {string} [themePriority] Allows to override theme priorities, specified
 * via {@link themed} function. It must be one of {@link PRIORITY} values.
 * @prop {ThemePropsMapper} [mapThemeProps] Allows to verride the props mapper
 * specified via {@link themed}.
 */

/**
 * @typedef {function} ThemePropsMapper
 * @desc Function signature accepted by `mapThemeProps` option of
 * {@link themed} function.
 * @param {object} props All props received by
 * {@link &lt;ThemeableComponent&gt;}.
 * @param {object} theme Composed theme.
 * @return {object} A map of properties to pass down the original component
 * wrapped into {@link &lt;ThemeableComponent&gt;}.
 */

/**
 * Registers a themeable component under given name, and with an optional
 * default theme.
 *
 * The second argument (`themeSchema`) can be omitted, thus you can call this
 * function either as
 * `themed(componentName, [themeSchema], [defaultTheme], [options])`, or as
 * `themed(componentName, [defaultTheme], [options])`. The library distinguish
 * these two variants by the type of second argument: if an array, the form
 * with `themeSchema` is assumed; otherwise the second variant with three
 * arguments (two of which are optional). The first syntax is recommended,
 * while the second one is implemented mostly for compatibility with older
 * similar libraries.
 *
 * `themed()` can be used as a decorator, or in the following (recommended) way:
 * ```jsx
 * import themed from '@dr.pogodin/react-themes';
 * import defaultTheme from './default.scss';
 *
 * function Component() { ... }
 *
 * export default themed('ThemedComponent', [...], defaultTheme)(Component);
 * ```
 *
 *  When rendered, your component will receive the composed theme via its
 *  `theme` prop. You will just need to pass the values from `theme` into
 *  the `className` attributes of your component elements, as shown in
 *  the [Getting Started](#getting-started) example.
 *
 * @param {string} componentName Themed component name, which should be used to
 * provide its context theme via {@link &lt;ThemeProvider&gt;}.
 * @param {string[]} themeSchema An array of valid theme keys
 * recognized by the wrapped component, beside the keys corresponding
 * to _ad hoc_ and context tags. It is used for theme validation, and
 * casting (if opted). See `.themeType` and `castTheme` in
 * {@link &lt;ThemeableComponent&gt;} documentation.
 * @param {object} [defaultTheme] Default theme, in form of theme key to
 * CSS class name mapping. If you have CSS modules and SCSS loader correctly
 * configured, the import `import theme from 'some.theme.scss';` will result
 * in `theme` object you can pass here. In some cases, it might be also legit
 * to construct theme object in a diffent way.
 * @param {object} [options] Additional parameters.
 * @param {string} [options.composeAdhocTheme=COMPOSE.DEEP] Composition type for
 * _ad hoc_ theme, which is merged into the result of composition of lower
 * priority themes. Must be one of {@link COMPOSE} values.
 * @param {string} [options.composeContextTheme=COMPOSE.DEEP] Composition type
 * for context theme into default theme (or vice verca, if opted by
 * `themePriority` override). Must be one of {@link COMPOSE} values.
 * @param {string} [options.themePriority=ADHOC_CONTEXT_DEFAULT] Theme
 * priorities. Must be one of {@link PRIORITY} values.
 * @param {ThemePropsMapper} [options.mapThemeProps] By default, the themeable
 * component
 * created by `themed()` does not pass into the original wrapped component any
 * properties introduced by this library. It only passes down properties it
 * does not recognize, alongside the composed `theme`, and forwarded DOM `ref`.
 * In case a different behavior is needed, the property mapper can be
 * specified with this option. It should be a function with
 * {@link ThemePropsMapper} signature, and if present the result from this
 * function will be passed down the wrapped component as its props.
 * @param {string} [options.contextTag=context] Override of `context` theme
 * key.
 * @param {string} [options.adhocTag=ad.hoc] Override of `ad.hoc` theme key.
 * @param {string} [options.composeTheme] Compatibility compose mode.
 * @param {function} [options.mapThemrProps] Compatibility prop mapper.
 * @return {function} Themeable component, registered under
 * given name. See {@link &lt;ThemeableComponent&gt;} for theming related
 * properties
 * it will accept, on top of any other properties of the original component
 * wrapped by `themed()`.
 */
function themed(
  componentName,
  themeSchema,
  defaultTheme,
  options,
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
  } = options || {};

  const aTag = adhocTag.split('.');
  if (aTag.length !== 2 || !aTag[0] || !aTag[1]) {
    throw new Error('Invalid adhoc theme tag');
  }

  const validThemeKeys = themeSchema ? [...themeSchema] : [];
  validThemeKeys.push(aTag[0], aTag[1], contextTag);
  const validThemeKeysSet = new Set(validThemeKeys);

  return (Component) => {
    const WrappedComponent = forwardRef(
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
        const contextThemes = useContext(context);

        /* Deduction of applicable theme composition and priority settings. */
        let mapper;
        let priority;
        let composeAdhoc;
        let composeContext;
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
              composeContext,
              oComposeContextTheme,
              COMPOSE.SOFT,
            );
            break;
          default:
            mapper = mapThemeProps || oMapThemeProps;
            priority = themePriority || oThemePriority
            || PRIORITY.ADHOC_CONTEXT_DEFAULT;
            composeAdhoc = composeAdhocTheme
            || oComposeAdhocTheme || COMPOSE.DEEP;
            composeContext = composeContextTheme
            || oComposeContextTheme || COMPOSE.DEEP;
        }

        /* Theme composition. */
        const contextTheme = contextThemes[componentName];
        let res = priority === PRIORITY.ADHOC_DEFAULT_CONTEXT
          ? compose(defaultTheme, contextTheme, composeContext, contextTag)
          : compose(contextTheme, defaultTheme, composeContext, contextTag);

        let adhocTheme = theme;
        if (castTheme && theme) {
          adhocTheme = {};
          validThemeKeys.forEach((key) => {
            const clazz = theme[key];
            if (clazz) adhocTheme[key] = clazz;
          });
        }

        res = compose(adhocTheme, res, composeAdhoc, aTag) || {};

        /* Props deduction. */
        const p = mapper ? mapper({ ...properties, ref }, res) : {
          ...rest,
          theme: res,
          ref,
        };

        /* eslint-disable react/jsx-props-no-spreading */
        return <Component {...p}>{children}</Component>;
        /* eslint-enable react/jsx-props-no-spreading */
      },
    );

    /**
     * `prop-types` compatible prop checker for `theme` prop.
     */
    WrappedComponent.themeType = (props, propName, name) => {
      const theme = props[propName];
      if (!theme) return undefined;
      let errors = [];
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
        errors = errors.join('\n');
        return new Error(
          `Theme given to ${name} has multiple issues:\n${errors}`,
        );
      }
      return undefined;
    };

    WrappedComponent.themeType.isRequired = (props, propName, name) => (
      props[propName] ? WrappedComponent.themeType(props, propName, name)
        : Error(`Theme is not provided to ${name} component`)
    );

    return WrappedComponent;
  };
}

/**
 * Exposes `themed(..)` as a function of either 3 or 4 arguments. In the first
 * case it is:
 * `themed(componentName, defaultTheme, options)`,
 * in the second (recommended) case it is:
 * `themed(componentName, themeSchema, defaultTheme, options)`
 * @param  {...any} args
 * @return {react.ElementType}
 */
export default function themedWrapper(
  componentName,
  themeSchemaOrdefaultTheme,
  defaultThemeOrOptions,
  options,
) {
  return Array.isArray(themeSchemaOrdefaultTheme)
    ? themed(
      componentName,
      themeSchemaOrdefaultTheme,
      defaultThemeOrOptions,
      options,
    )
    : themed(
      componentName,
      null,
      themeSchemaOrdefaultTheme,
      defaultThemeOrOptions,
    );
}
