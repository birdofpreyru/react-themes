---
sidebar_position: 2
---

# Constants

## COMPOSE

```jsx
export const COMPOSE = {
  DEEP: 'DEEP',
  SOFT: 'SOFT',
  SWAP: 'SWAP',
}
```
Supported theme composition modes. Two component themes with lower (`L`),
and higher (`H`) priorities can be merged in the following ways

- `.DEEP` - In deep composition mode all classes from `H` are applied with
  higher specifity, on top of all classes from `L`, which are applied with lower
  specifity. Thus, in case of conflicting rules, theme `H` overrides `L`,
  but otherwise rules from `L` are used as defaults. It is the default
  composition mode.

- `.SOFT` - In soft composition mode all classes from `H` are applied, while
  classes from theme `L` are applied only if they are absent in theme `H`.
  Thus, any classes defined in `H` completely override corresponding classes
  from `L`.`

- `.SWAP` - In swap mode only classes from theme `H`  are applied,
  thus theme `H` completely overrides `L`.

## PRIORITY

```jsx
export const PRIORITY = {
  ADHOC_CONTEXT_DEFAULT: 'ADHOC_CONTEXT_DEFAULT',
  ADHOC_DEFAULT_CONTEXT: 'ADHOC_DEFAULT_CONTEXT',
}
```
Supported theme priority models.

- `.ADHOC_CONTEXT_DEFAULT` - In this mode _ad hoc_ theme has the highest
  priority, followed by the context, then by the default theme.
  This is the default prioty model.

- `.ADHOC_DEFAULT_CONTEXT` - In this mode _ad hoc_ theme has the highest
  priority, followed by the default theme, then by the context theme.
