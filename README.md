# bitflags-ts

An enum-like type for representing & using bit flags

## Usage

```ts
const PermissionsFlag = bitFlag('Read', 'Write', 'Execute');

const userPermissions = PermissionsFlag.union(PermissionsFlag.Read, PermissionsFlag.Write);

const canRead = userPermissions.hasFlag(PermissionsFlag.Read); // true
const canExecute = userPermissions.hasFlag(PermissionsFlag.Execute); // false
```