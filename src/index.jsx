/**
 * Dr. Pogodin's React Themes.
 */

import { createContext, forwardRef, useContext } from 'react';
import PT from 'prop-types';

const INVALID_COMPOSE = 'Invalid composition mode';

const context = createContext({});

let compatibilityMode = null;

/**
 * Supported compatibility modes.
 */
export const COMPATIBILITY_MODE = {
  REACT_CSS_THEMR: 'REACT_CSS_THEMR',
  REACT_CSS_SUPER_THEMR: 'REACT_CSS_SUPER_THEMR',
};

const VALID_COMPATIBILITY_MODES = Object.values(COMPATIBILITY_MODE);

/**
 * Sets the specified compatibility mode.
 * @param {String} mode Compatibility mode.
 */
export function setCompatibilityMode(mode) {
  if (mode && !VALID_COMPATIBILITY_MODES.includes(mode)) {
    throw new Error('Invalid compatibility mode');
  }
  compatibilityMode = mode || null;
}

/**
 * Supported composition types.
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
 * Theme provider.
 * @param {Any} param0.children Component children.
 * @param {Object} param0.themes Mapping of themes to apply inside the context.
 * @param {Object} param0.theme Fallback mapping for backward compatibility
 *  with `react-css-themr` and `react-css-super-themr`.
 * @return {Element} React element.
 */
export function ThemeProvider({
  children,
  theme: legacyThemes,
  themes,
}) {
  const value = compatibilityMode ? legacyThemes : themes;
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
 * Themed object decorator.
 * @param {String} componentName Themed component name.
 * @param {Array|Object} themeSchema_or_defaultTheme
 * @param {Object} [defaultTheme] Optional default theme.
 * @param {Object} [options] Optional parameters.
 * @param {String} [options.composeAdhocTheme] Optional. Composition type for
 *  the ad hoc theme.
 * @param {String} [options.composeContextTheme] Optional. Composition type for
 *  the context theme.
 * @param {String} [options.themePriority] Optional. Theme priority.
 * @param {Function} [options.mapThemeProps] Optional. Property mapper.
 * @param {String} [options.composeTheme] Optional. Compatibility compose mode.
 * @param {Function} [options.mapThemrProps] Optional. Compatibility prop
 *  mapper.
 * @return {ElementType} React element type.
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
export default function (
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
