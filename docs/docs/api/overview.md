---
sidebar_position: 1
---

# Overview

## Constants

- [COMPATIBILITY_MODE](constants#compatibility_mode) - Compatibility modes
  supported by [setCompatibilityMode()].
- [COMPOSE](constants#compose) - Supported theme composition modes.
- [PRIORITY](constants#priority) - Supported theme priority modes.

## Functions

- [setCompatibilityMode()] - Enables emulation
  of older similar libraries.
- [themed()] - Register a new themed component.
- [ThemePropsMapper](functions#themepropsmapper) - Signature of `mapThemeProps`
  parameter accepted by [themed()] and [ThemedComponent].

## Components

- [ThemedComponent] - Documents extra features of components registered by [themed()].
- [ThemeProvider](components#themeprovider) - Provides context themes to its
  children tree.

[setCompatibilityMode()]: functions#setcompatibilitymode
[themed()]: functions#themed
[ThemedComponent]: components#themedcomponent
