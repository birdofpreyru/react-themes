---
sidebar_position: 2
---

# Theming Mechanics

## Theme Anatomy

Each theme is a regular SCSS stylesheet with rules to apply to elements of
your themed component. The only extra rule is: the top level selectors inside
theme stylesheet should be wrapped within a few extra boilerplate selectors:

```scss
// SCSS theme source.
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
// Theme object imported into JSX (transformed by CSS Modules).
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
classes to elements of themed components as necessary to ensure the correct
priority via CSS specifity rules. The SCSS wrapper suggested above ensures that,
for example your rules for `yourClass1` are applied with three alternative
selectors of different specifities (for clarity, the classes below are
named by their original names, rather the transformed out):
- `.yourClass1` - base specifity;
- `.context.yourClass1` - higher specifity;
- `.ad.hoc.yourClass1` - the highest specifity.

[themed()] decorator supports options to override
the exact key names for auxiliary `ad.hoc` and `context` selectors.

## Theme Composition

There are three theme sources for your themed components: default theme, set
upon the component registration, context theme, coming from the hierarchy of
[ThemeProvider] components, and the _ad hoc_ theme specified for
each instance of the themed component. Any of these themes may be omit for
a specific component instance.

If several themes are applied to the same component instance, they are merged,
according to their priorities, explained further below, and the composition
modes provided by [COMPOSE](/docs/api/constants#compose) enum:

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
  `H` (_i.e._ any style rule from `H` will override similar rule from `L`).

- **Soft composition** &ndash; classes from `L` are applied if they are absent
  in `H`, all classes from `H` are applied, replacing matching classes from `L`
  (matching by their original names).

- **Swap composition** &ndash; `H` theme completely overrides `L`, i.e. only
  classes from `H` are applied.

To understand how it works under the hood, consider the following simplified
example:

```scss title="Sample Theme Sources and Compiled Objects"
// SCSS Source of Theme L
*,
.ad.hoc,
.context {
  &.class1 { ... }
  &.class2 { ... }
}

// For the explanation sake, assume it compiles into
// this object at JSX side:
{
  ad: 'adL',
  hoc: 'hocL',
  context: 'contextL',
  class1: 'class1L',
  class2: 'class2L',
}

// SCSS Source of Theme H
*,
.ad.hoc,
.context {
  &.class2 { ... }
}

// For the explanation sake, assume it compiles into
// this object at JSX side:
{
  ad: 'adH',
  hoc: 'hocH',
  context: 'contextH',
  class2: 'class2H',
}
```
When these two themes are applied to a themed component expecting them,
the value of `theme` prop received by the component will be the following for
each composition type (we still assume that `H` theme has higher priority in
each case, and remember that the values of `theme` object are just classnames in
the generated CSS bundle to be applied to component elements):

```jsx title="Composed Themes"
// "Deep composition" of H into L.
// Note that for the element getting 'class2L contextH class2H'
// classname CSS rules corresponding to .contextH.class2H selector
// will have higher priority compared to .class2L selector rules,
// no matter the order of the corresponding rule blocks in
// the bundled CSS.
{
  class1: 'class1L',
  class2: 'class2L contextH class2H',
}

// "Soft composition" of H into L.
{
  class1: 'class1L',
  class2: 'class2H',
}

// "Swap composition" of H into L.
{
  class2: 'class2H',
}
```

## Theme Priority

As already mentioned before, there are three theme sources for you themed
components: default themes, context, and _ad hoc_. By default, _ad hoc_ theme,
if applied to a component instance, will have the highest priority, followed by
the context theme (if any), then by the default theme (lowest priority). This
priority order can be changed either for selected themed components, or for
their individual instances to _ad hoc_ (highest priority), followed by default
theme, then context theme (lowest priority).

See [PRIORITY](/docs/api/constants#priority), [themed()],
[ThemedComponent](/docs/api/components#themedcomponent).

[themed()]: /docs/api/functions#themed
[ThemeProvider]: /docs/api/components#themeprovider
