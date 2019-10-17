# Dr. Pogodin's React Themes

UI style themes for React components with CSS modules and theme composition.

Allows to easily reuse the same core component inside different applications and
contexts, modifying its look via default, context, and _ad hoc_ themes. Powered by
CSS modules and core HTML/CSS mechanics: no unstable dependencies, no restriction
on usage of your other tools of choice.

![Library Purpose Illustration](illustration.svg)

### Content
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
  - [Theme Anatomy](#theme-anatomy)
  - [`COMPOSE` &ndash; composition modes](#compose-composition-modes)
  - [`PRIORITY` &ndash; theme priority modes](#priority-theme-priority-modes)
  - [`themed(componentName, [defaultTheme], [options])` &rArr; `WrapperFunction`
    (_default export_)](#themedcomponentname-defaulttheme-options-wrapperfunction-default-export)
  - [`<ThemeProvider themes={...}>{children}</ThemeProvider>`](#themeprovider-themeschildrenthemeprovider)
  - [`COMPATIBILITY_MODES` &ndash; emulate behavior of older libraries](#compatibility-modes-emulate-behavior-of-older-libraries)
  - [`setCompatibilityMode(mode)`](#setcompatibilitymodemode)
- [Migration from other libraries](#migration)

### Getting Started
```bash
npm install --save @dr.pogodin/react-themes
```

This library relies on CSS modules and SCSS. To install and configure them,
follow instructions in
[babel-plugin-react-css-modules](https://github.com/gajus/babel-plugin-react-css-modules), and
[node-sass](https://www.npmjs.com/package/node-sass).

Here is the minimal example from the illustration above:

- `default.scss`

  ```scss
  /* Default component theme. The outer class selectors: *, .ad.hoc, .context,
  * as well as prefixing of the next-level selectors with & are necessary for
  * deep theme merging, as explained below. Beside that, this is a regular SCSS
  * stylesheet. */

  *,
  .ad.hoc,
  .context {
    &.component {
      background: #4169e1;
      border-radius: 20px;
      color: #f5f5f5;
      height: 40px;
      padding: 0 20px;
    }
  }
  ```

- `white.scss`

  ```scss
  /* White button theme. Thanks to deep theme merging, we only need to specify
  * the styles that are different from the base default theme. */

  *,
  .ad.hoc,
  .context {
    &.component {
      background: #f5f5f5;
      color: #4169e1;
    }
  }
  ```

- `dark-blue.scss`

  ```scss
  /* Dark blue theme. */

  *,
  .ad.hoc,
  .context {
    &.component {
      background: #273f87;
      border-radius: 0;
      color: #f5f5f5;
    }
  }
  ```

- `ThemedComponent.jsx`

  ```jsx
  /* Themed component, wrapped into the default theme. */

  import React from 'react';

  import themed from '@dr.pogodin/react-themes';

  import defaultTheme from './default.scss';

  function Component({ children, theme }) {
    return <div className={theme.component}>{children}</div>;
  }

  export themed('ThemedComponent', defaultTheme)(Component);
  ```

- `Demo.jsx`

  ```jsx
  /* Showcases component looks from the bottom row of the illustration. */

  import React from 'react';
  import { ThemeProvider } from '@dr.pogodin/react-themes';
  import ThemedComponent from './ThemedComponent.jsx';

  /* We intentionally import all themes here (default.scss is not really needed
   * at this point), and reverse their order. When SCSS is compiled and bundled
   * by Wepback or another bundler of your choice, the content of these stylesheets
   * will be present in this very order in the resulting bundle. This would break
   * deep theme merging in many existing libraries of the same purpose, but it
   * is handled correctly in our case. */
  import adhocTheme from './dark-blue.scss';
  import contextTheme from './white.scss';
  import defaultTheme from './default.scss';

  export default function Demo() {
    return (
      <div>
        <ThemedComponent>Blue Component<ThemedComponent>

        <ThemeProvider themes={{ ThemedComponent: contextTheme }}>
          <ThemedComponent>White Component</ThemedComponent>
          <ThemedComponent theme={adhocTheme}>
            Dark Blue Component
          </ThemedComponent>
        </ThemeProvider>
      </div>
    );
  }
  ```

### API Reference

- #### Theme Anatomy

  Each theme is a regular SCSS style sheet with rules to apply to elements of
  your themed component. The only rule is: the top level selectors in theme
  stylesheet should be wrapped by a few extra selectors:
  ```scss
  // Style theme inside SCSS code

  *,
  .ad.hoc,
  .context {
    &.yourClass1 { ... }
    &.yourClass2 { ... }
  }
  ```
  When such stylesheet is imported into JSX, your React CSS Modules setup
  transforms it into:
  ```jsx
  // Style theme imported into JSX

  {
    ad: '<Transformed name of `ad` class>',
    hoc: '<Transformed name of `hoc` class>',
    context: '<Transformed name of `context` class>',
    yourClass1: '<Transformed name of `yourClass1`>',
    yourClass2: '<Transformed name of `yourClass2`>',
  }
  ```
  To ensure the correct rule priority, without depending on CSS rules ordering
  in the compiled CSS bundle, this library will add `ad`, `hoc`, and `context`
  classes to elements of themed components if necessary to ensure the priority
  via CSS specifity rules. The SCSS wrapper suggested above ensures that, for
  example your rules for `yourClass1` are applied with three alternative
  selectors of different specifities (for clarity, the classes below are
  named by their original names, rather the transformed out):
  - `.yourClass1` - base specifity;
  - `.context.yourClass1` - higher specifity;
  - `.ad.hoc.yourClass1` - the highest specifity.

  `themed(...)` decorator supports options to override the exact key names for
  auxiliary `ad.hoc` and `context` selectors.

- #### `COMPOSE` &ndash; composition modes

  There are three theme sources for your themed components: default theme, set
  upon the component registration, context theme, coming from the hierarchy of
  `<ThemeProvider>` components, and the _ad hoc_ theme specified for each instance
  of the themed component. Any of these themes may be omit for a specific component
  instance.

  If several themes are applied to the same component instance, they are merged,
  according to their priorities, explained further below, and the composition
  modes explained here.

  ```jsx
  import { COMPOSE } from '@dr.pogodin/react-themes`;

  COMPOSE.DEEP // Equals `DEEP` - deep composition mode;
  COMPOSE.SOFT // Equals `SOFT` - soft composition mode;
  COMPOSE.SWAP // Equals `SWAP` - swap composition mode;
  ```

  Two themes with lower (`L`) and higher (`H`) priorities can be merged in
  the following ways:

  - **Deep composition** (_default_) &ndash; all style rules from `L` and `H` are
    applied, ensuring the higher specifity (thus priority) for the rules from
    `H` (i.e. any style rule from `H` will override similar rule from `L`).

  - **Soft composition** &ndash; classes from `L` are applied if they are absent
    in `H`, all classes from `H` are applied, replacing matching classes from `L`
    (matching by their original names).

  - **Swap composition** &ndash; `H` theme completely overrides `L`, i.e. only
    classes from `H` are applied.

- #### `PRIORITY` &ndash; theme priority modes

  There are three theme sources for you themed components: default themes,
  context, and _ad hoc_. When multiple themes are applied to a component instance,
  they can be composed in the following ways

  ```jsx
  import { PRIORITY } from '@dr.pogodin/react-themes';

  PRIORITY.ADHOC_CONTEXT_DEFAULT // Equals 'ADHOC_CONTEXT_DEFAULT'
  PRIORITY.ADHOC_DEFAULT_CONTEXT // Equals 'ADHOC_DEFAULT_CONTEXT'
  ```

  - **ADHOC_CONTEXT_DEFAULT** (**default**) &ndash; _ad hoc_ theme has
    the highest priority, followed by context, then default theme.
  
  - **ADHOC_DEFAULT_CONTEXT** &ndash; _ad hoc_ theme has the highest priority,
    followed by default, then context theme.

- #### `themed(componentName, [defaultTheme], [options])` &rArr; `WrapperFunction` (_default export_)

  Registers themed component with the specified name, and optional default
  theme. It can be used as a decorator, or just execute returned `WrapperFunction`
  with your component passed in:

  ```jsx
  import themed from '@dr.pogodin/react-themes`;

  import defaultTheme from './default.scss';

  function Component() { ... }

  export default themed('ThemedComponent', defaultTheme)(Component);
  ```
  When rendered, your component will receive the composed theme via its
  `theme` prop. You will just need to pass the values from `theme` into
  the `className` attributes of your component elements, as shown in
  the [Getting Started](#getting-started) example.

  #### `themed(..)` arguments:

  - `componentName` (_String_) &ndash; name of your component, it will be used
    to specify context themes for your component via `<ThemeProvider />`.

  - `[defaultTheme]` (_Object_) &ndash; optional default theme to apply to
    the component instances.

  - `[options]` (_Object_) &ndash; optional additional settings:
    - `[options.composeAdhocTheme]` (_String_) &ndash; optional override of
      the composition mode between _ad hoc_ theme, and the result of composition
      of lower priority themes. It must be one of `COMPOSE` values, and defaults
      to `COMPOSE.DEEP`. In compatibility modes other values are accepted and
      mapped to the correct `COMPOSE` values.

    - `[options.composeContextTheme`] (_String_) &ndash; optional override of
      the composition mode between _context_, and _default_ themes. It must be
      one of `COMPOSE` values, and defaults to `COMPOSE.DEEP`. In compatibility
      modes other values are accepted and mapped to the correct `COMPOSE` values.

    - `[options.themePriority`] (_String_) &ndash; optional override of theme
      priorities. It must be one of `PRIORITY` values, and defaults to
      `PRIORITY.ADHOC_CONTEXT_DEFAULT`.

    - [`options.mapThemeProps`] (_Function_) &ndash; by default, the themed
      component wrapper does not pass to the original wrapped component any
      properties introduced by this library. It only passes down the properties
      it does not know, plus the composed `theme`, plus it forwards DOM `ref`.
      In case a different behavior is needed, the property mapper can be
      specified with this option. It should be the function of the following
      signature, and if present the result from this function will be passed
      down the wrapped component as its props.

      `propsMapper(props, theme)` &rArr; `Props`

    - `[options.contextTag]` (_String_) &ndash; optional override of `context`
      specifity selector. It must be a valid class name.

    - `[options.adhocTag]` (_String_) &ndash; optional override of `ad.hoc`
      specifity selector. It must be exactly two valid class names, joined by dot.

    _Deprecated Options (Compatibility Mode)_:

    - `[composeTheme]` (_String_)
    - `[mapThemrProps]` (_Function_)

  #### Additional ThemedComponent props

  The wrapped themed component accepts the following aditional properties. They
  allow to override settings of registered themed component for its individual
  instances. Any other props are forwared to the wrapped base component.

  - `[theme]` (_Object_) &ndash; _ad hoc_ theme to apply to the component
    instance.

  - `[composeAdhocTheme]` (_String_) &ndash; allows to override composition
    mode of _ad hoc_ theme.

  - `[composeContextTheme]` (_String_) &ndash; allows to override composition
    mode of context theme.

  - `[themePriority]` (_String_) &ndash; allows to override theme priorities.

  - `[mapThemeProps]` (_Function_) &ndash; allows to override the props mapper.

- #### `<ThemeProvider themes={...}>{children}</ThemeProvider>`

  Defines style contexts. It accepts a single property `themes` (`theme` in
  compatibility modes).

  - `themes` (_Object_) &ndash; the mapping of between themed component names
    (the first parameter passed into `themed(..)` decorator upon the component
    registration), and context themes to apply to them within the context.

  In case of nested context, the context theme from the closest context takes
  the effect on a component. If the context theme for a component is not set in
  the closest context, but it is set in an outer context, the theme from outer
  context will be applied.

- #### `COMPATIBILITY_MODES` &ndash; emulate behavior of older libraries

  The library can be switched to compatibility modes by
  `setCompatibilityMode(mode)` function.

  ```jsx
  import { COMPATIBILITY_MODES, setCompatibilityMode } from '@dr.pogodin/react-themes';

  setCompatibilityMode(COMPATIBILITY_MODES.REACT_CSS_THEMR);
  ```

  - **REACT_CSS_THEMR** &ndash; the library will accept the same properties,
    and composition mode values as the
    [`react-css-themr`](https://www.npmjs.com/package/react-css-themr)
    library. It will deduce
    all other settings, and sets defaults to match behavior of that lib.

  - **REACT_CSS_SUPER_THEMR** &ndash; the library will accept the same properties,
    and composition mode values as the
    [`react-css-super-themr`](https://www.npmjs.com/package/react-css-super-themr)
    library. It will deduce all other settings, and sets defaults to match behavior
    of that lib.

- #### `setCompatibilityMode(mode)`

  Switches the library into the specified compatibility mode.

### Migration

There are similar older libraries out there, including 
[react-css-themr](https://www.npmjs.com/package/react-css-themr) &ndash;
the original inspiration for this work, and
[react-css-super-themr](https://www.npmjs.com/package/react-css-super-themr).
The [`setCompatibilityMode(mode)`](#setcompatibilitymodemode) feature allows our
project to closely emulate behavior of those older libs (you will still have to
upgrade your code to use the latest React 16). For a complete migration to our
library, you will need to perform the following updates in your code:

- #### Differences from `react-css-themr`

  - Composition mode are renamed from `deeply`, `softly`, and **false**, to
    `DEEP`, `SOFT`, and `SWAP`.

  - Default theme priority is `ADHOC_CONTEXT_DEFAULT` instead of
    `ADHOC_DEFAULT_CONTEXT`.

  - `composeTheme` option of themed component decorator is replaced by two
    separate options: `composeAdhocTheme`, and `composeContextTheme`.

  - `mapThemrProps` option of themed component decorator is replaced by
    `mapThemeProps`.

  - Themes require specifity wrappers (however, any theming that used to work
    fine without them, should keep on working fine, although correct deep theme
    merging won't work in complex scenarios).

- #### Differences from `react-css-super-themr`

  - Composition mode are renamed from `deeply`, `softly`, and **false**, to
    `DEEP`, `SOFT`, and `SWAP`. Allows any composition mode for any theme pair.

  - Default theme priority is `ADHOC_CONTEXT_DEFAULT` instead of
    `ADHOC_DEFAULT_CONTEXT`. Also the priority mode names are renamed from
    `adhoc-context-default`, and `adhoc-default-context`.

  - `mapThemrProps` option of themed component decorator is replaced by
    `mapThemeProps`.

  - Themes require specifity wrappers (however, any theming that used to work
    fine without them, should keep on working fine, although correct deep theme
    merging won't work in complex scenarios).
