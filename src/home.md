The **react-themes** library implements themeable UI styling of React
components, with theme composition features, based on
[react-css-themr](https://www.npmjs.com/package/@friendsofreactjs/react-css-themr)
ideas.

It allows to easily reuse the same core component inside different applications,
and contexts, modifying its look via default, context, and _ad hoc_ themes.
Powered by CSS modules and core HTML/CSS mechanics: it does not require any
unstable dependencies, no restricts you from using of other (S)CSS tools of
your choice.

![Library Purpose Illustration](https://raw.githubusercontent.com/birdofpreyru/react-themes/master/illustration.png)

[Live Example](https://dr.pogodin.studio/react/react-themes) &bull;
[Getting Started](#getting-started) &bull;
[Theme Anatomy](#theme-anatomy) &bull;
[Theme Composition](#theme-composition) &bull;
[Theme Priority](#theme-priority) &bull;
[Migration from Older Libraries](#migration)

### <a name="getting-started"></a> Getting Started
```bash
npm install --save @dr.pogodin/react-themes
```

This library relies on CSS modules and SCSS. To install and configure them,
follow instructions in
[babel-plugin-react-css-modules](https://www.npmjs.com/package/@dr.pogodin/babel-plugin-react-css-modules), and
[node-sass](https://www.npmjs.com/package/node-sass).

Here is the minimal example from the illustration above:

- `default.scss`

  ```scss
  // Default component theme. The outer class selectors: *, .ad.hoc, .context,
  // as well as prefixing of the next-level selectors with & are necessary for
  // deep theme merging, as explained below. Beside that, this is a regular SCSS
  // stylesheet.

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
  // White button theme. Thanks to deep theme merging, we only need to specify
  // the styles that are different from the base default theme. */

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
  // Dark blue theme.

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
  // Themed component, wrapped into the default theme.

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
  // Showcases component looks from the bottom row of the illustration.

  import React from 'react';
  import { ThemeProvider } from '@dr.pogodin/react-themes';
  import ThemedComponent from './ThemedComponent.jsx';

  // We intentionally import all themes here (default.scss is not really needed
  // at this point), and reverse their order. When SCSS is compiled and bundled
  // by Wepback or another bundler of your choice, the content of these stylesheets
  // will be present in this very order in the resulting bundle. This would break
  // deep theme merging in many existing libraries of the same purpose, but it
  // is handled correctly in our case.
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

### <a name="theme-anatomy"></a> Theme Anatomy

Each theme is a regular SCSS style sheet with rules to apply to elements of
your themed component. The only rule is: the top level selectors in theme
stylesheet should be wrapped within a few extra selectors:

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

{@link themed} decorator supports options to override the exact key names for
auxiliary `ad.hoc` and `context` selectors.

### <a name="theme-composition"></a> Theme Composition
There are three theme sources for your themed components: default theme, set
upon the component registration, context theme, coming from the hierarchy of
{@link &lt;ThemeProvider&gt;} components, and the _ad hoc_ theme specified for
each instance of the themed component. Any of these themes may be omit for
a specific component instance.

If several themes are applied to the same component instance, they are merged,
according to their priorities, explained further below, and the composition
modes provided by {@link COMPOSE} enum:

```jsx
import { COMPOSE } from '@dr.pogodin/react-themes';

const {
  DEEP, // Equals `DEEP` - deep composition mode.
  SOFT, // Equals `SOFT` - soft composition mode.
  SWAP, // Equals `SWAP` - swap composition mode.
} = COMPOSE;
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

### <a name="theme-priority"></a> Theme Priority

There are three theme sources for you themed components: default themes,
context, and _ad hoc_. When multiple themes are applied to a component instance,
they can be composed in the following ways (see {@link PRIORITY})

```jsx
import { PRIORITY } from '@dr.pogodin/react-themes';

const {
  ADHOC_CONTEXT_DEFAULT, // Equals 'ADHOC_CONTEXT_DEFAULT'.
  ADHOC_DEFAULT_CONTEXT, // Equals 'ADHOC_DEFAULT_CONTEXT'.
} = PRIORITY;
```

- **ADHOC_CONTEXT_DEFAULT** (**default**) &ndash; _ad hoc_ theme has
  the highest priority, followed by context, then default theme.

- **ADHOC_DEFAULT_CONTEXT** &ndash; _ad hoc_ theme has the highest priority,
  followed by default, then context theme.

### <a name="migration"></a> Migration from Older Libraries

There are similar older libraries out there, including 
[react-css-themr](https://www.npmjs.com/package/react-css-themr) &ndash;
the original inspiration for this work, and
[react-css-super-themr](https://www.npmjs.com/package/react-css-super-themr).
{@link setCompatibilityMode} function feature allows `react-themes`
to closely emulate behavior of those older libs (you will still have to
upgrade your code to use the latest React 16). For a complete migration to our
library, you will need to perform the following updates in your code:

- **Differences from `react-css-themr`**

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

- **Differences from `react-css-super-themr`**

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
