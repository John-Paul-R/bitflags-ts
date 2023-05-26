# bitflags-ts

An enum-like type for representing & using bit flags

## Usage

### `bitFlag`

```ts
const PermissionsFlag = bitFlag('Read', 'Write', 'Execute');

const userPermissions = PermissionsFlag.union(PermissionsFlag.Read, PermissionsFlag.Write);

const canRead = userPermissions.hasFlag(PermissionsFlag.Read); // true
const canExecute = userPermissions.hasFlag(PermissionsFlag.Execute); // false
```


### `createBitFlagsEnum`

An `createBitFlagsEnum` alternative syntax that creates an 'enum' with
object-valued (instead of Number-valued, as in `bitFlag`) members. While this
has higher one-time allocation cost, there are more utilities for working with
the values themselves, on the enum member instances. 

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