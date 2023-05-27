# bitflags-ts

An enum-like type for representing & using bit flags

![build-status-badge](https://img.shields.io/github/actions/workflow/status/John-Paul-R/bitflags-ts/node.js.yml?label=build%20%26%20test)
![npm bundle size](https://img.shields.io/bundlephobia/min/bitflags-ts)

## Usage

_Note: I don't particularly recommend using this package!_ Bit flags are great,
and can be created and used quite simply in TypeScript (demonstrated in
fantastically concise fashion in [this SO
answer](https://stackoverflow.com/a/39359953/8105643)). This package abstracts
away the bitwise operations, but is not without performance cost. As long as
you're fine with seeing `|` and `&`, use native bit flag enums!

Also note: JS coerces `number`s to 32 bits before performing any bitwise
operations, so the maximum number of flags that can be represented by a bit
flag type is 32!

### `bitFlag`

```ts
const PermissionsFlag = bitFlag('Read', 'Write', 'Execute');

const userPermissions = PermissionsFlag.union(PermissionsFlag.Read, PermissionsFlag.Write);

const canRead = userPermissions.hasFlag(PermissionsFlag.Read); // true
const canExecute = userPermissions.hasFlag(PermissionsFlag.Execute); // false
```


### `createBitFlagsEnum`

An alternative syntax that creates an 'enum' with object-valued (instead of
Number-valued, as in `bitFlag`) members. While this has higher one-time
allocation cost, there are more utilities for working with the values
themselves on the enum member instances. 

```ts
const PermissionsFlag = createBitFlagsEnum(['Read', 'Write', 'Execute'] as const);

{ // offers 'or' syntax on the enum value itself
  const userPermissions = PermissionsFlag.Read
    .or(PermissionsFlag.Write)
    .or(PermissionsFlag.Execute);
  const canRead = userPermissions.hasFlag(PermissionsFlag.Read); // true
  const canExecute = userPermissions.hasFlag(PermissionsFlag.Execute); // true
}

{ // static `union` works in the same fashion as bitFlag
  const userPermissions = PermissionsFlag.union([PermissionsFlag.Read, PermissionsFlag.Write]);
  const canRead = userPermissions.hasFlag(PermissionsFlag.Read); // true
  const canExecute = userPermissions.hasFlag(PermissionsFlag.Execute); // false
}
```
