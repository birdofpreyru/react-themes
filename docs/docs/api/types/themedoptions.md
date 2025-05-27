# ThemedOptions
[ThemedOptions]: themedoptions
```tsx
import type { ThemedOptions } from '@dr.pogodin/react-themes`;

type ThemedOptions<
  ComponentProps extends ThemeableComponentProps,
> = {


  composeAdhocTheme?: COMPOSE;
  composeContextTheme?: COMPOSE;
  mapThemeProps?: ThemePropsMapper<ComponentProps>;
  themePriority?: PRIORITY;

  // These options are not intended for TypeScript use case, they are assumed
  // to be fixed at the values below; but their custom values are still supported
  // in plain JavaScript.
  adhocTag?: 'ad.hoc';
  contextTag?: 'context';
};
```

The [ThemedOptions] type specifies options accepted by [themed()] function.

- `.composeAdhocTheme` &mdash; [COMPOSE] &mdash; Composition type for _ad hoc_
  theme, which is merged into the result of composition of lower priority themes.
  Must be one of [COMPOSE] values. Defaults `COMPOSE.DEEP`.

- `.composeContextTheme` &mdash; [COMPOSE] &mdash; Composition type for context
  theme into default theme (or vice verca, if opted by `themePriority` override).
  Must be one of [COMPOSE] values. Defaults `COMPOSE.DEEP`.

- `.mapThemeProps` &mdash; [ThemePropsMapper] &mdash; By default, a themed component
  created by [themed()] does not pass into the original base component any
  props introduced by this library. A function provided by this option will
  get the composed theme and all properties, and the result from this function
  call will be passed as props down the base component.

- `.themePriority` &mdash; [PRIORITY] &mdash; Theme priorities. Must be one of [PRIORITY]
  values. Defaults `PRIORITY.ADHOC_CONTEXT_DEFAULT`.

:::note
The following two options, inherited from the original JavaScript implementation,
still work, but they do not fit well with TypeScript restrictions, thus, at least
for now, we assume they are always set to their default values.

- `.adhocTag` &mdash; **string** &mdash; Overrides "ad.hoc" theme key. Defaults `"ad.hoc"`.
- `.contextTag` &mdash; **string** &mdash; Overrides context theme key. Defaults `"context"`.
:::

[COMPOSE]: /docs/api/enums/compose
[PRIORITY]: /docs/api/enums/priority
[themed()]: /docs/api/functions/themed
[ThemePropsMapper]: themepropsmapper
