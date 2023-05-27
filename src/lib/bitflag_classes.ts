function orBitFlags<TValues extends readonly string[]>(
  this: BitFlagValue<TValues>,
  other: BitFlagValue<TValues>
): BitFlagValue<TValues> {
  return new BitFlagValueImpl<TValues>(this.value | other.value);
}

function unionBitFlags<TValues extends readonly string[]>(
  this: BitFlagValue<TValues>,
  other: BitFlagValue<TValues>[]
): BitFlagValue<TValues> {
  let ret = this.value;
  for (let i = 0; i < other.length; i++) {
    const val = other[i];
    ret |= val.value;
  }
  return new BitFlagValueImpl(ret);
}

function hasBitFlag<TValues extends readonly string[]>(
  this: BitFlagValue<TValues>,
  other: BitFlagValue<TValues>
): boolean {
  return (this.value & other.value) !== 0;
}

function intersectBitFlags<TValues extends readonly string[]>(
  this: BitFlagValue<TValues>,
  other: BitFlagValue<TValues>[]
): BitFlagValue<TValues> {
  let union = 0;
  for (let i = 0; i < other.length; i++) {
    const val = other[i];
    union |= val.value;
  }
  return new BitFlagValueImpl(this.value & union);
}

type SingleEnumValue<TValues extends readonly string[]> =
  TValues[keyof TValues extends number ? keyof TValues : never];

/**
 * Represents either a bitflag enum member or a union of bitflag enum members
 */
export interface BitFlagValue<TValues extends readonly string[]> {
  /**
   * The backing bitflag value
   */
  readonly value: number;

  /**
   * Creates a new BitFlagValue representing the union of the operands
   * @example
   * const union = Color.Red.or(Color.Blue);
   * union.hasFlag(Color.Red) // true
   * union.hasFlag(Color.Blue) // true
   * union.hasFlag(Color.Green) // false
   */
  or: (other: BitFlagValue<TValues>) => BitFlagValue<TValues>;

  /**
   * Creates a new BitFlagValue representing the union of the operands
   * @example
   * const union = Color.Red.union([Color.Blue, Color.Green]);
   * union.hasFlag(Color.Red) // true
   * union.hasFlag(Color.Blue) // true
   * union.hasFlag(Color.Green) // true
   * union.hasFlag(Color.Purple) // false
   */
  union: (others: BitFlagValue<TValues>[]) => BitFlagValue<TValues>;

  /**
   * @returns `true` if `other` is present in `this`, `false` otherwise
   * @example
   * const union = Color.Red.or(Color.Blue);
   * union.hasFlag(Color.Red) // true
   * union.hasFlag(Color.Blue) // true
   * union.hasFlag(Color.Green) // false
   */
  hasFlag: (other: BitFlagValue<TValues>) => boolean;

  // TODO: this should probably just intersect a single BitFlagValue. Right now,
  // there is no way to intersect w/o creating an array, which is bad. Breaking
  // change, though.
  /**
   * Creates a new BitFlagValue representing the intersection of the operands
   * @example
   * const union = Color.Red.or(Color.Blue).intersect([Color.Red, Color.Green]);
   * union.hasFlag(Color.Red) // true
   * union.hasFlag(Color.Blue) // false
   * union.hasFlag(Color.Green) // false
   */
  intersect: (others: BitFlagValue<TValues>[]) => BitFlagValue<TValues>;
}

/**
 * Represents a bitflag enum member
 */
export interface BitFlagEnumValue<TValues extends readonly string[]>
  extends BitFlagValue<TValues> {
  stringValue: SingleEnumValue<TValues>;
}

class BitFlagValueImpl<TValues extends readonly string[]>
  implements BitFlagValue<TValues>
{
  value: number;
  constructor(numberValue: number) {
    this.value = numberValue;
  }

  or = orBitFlags;
  union = unionBitFlags;
  hasFlag = hasBitFlag;
  intersect = intersectBitFlags;
}

class BitFlagEnumValueImpl<TValues extends readonly string[]>
  extends BitFlagValueImpl<TValues>
  implements BitFlagEnumValue<TValues>
{
  constructor(stringValue: SingleEnumValue<TValues>, numberValue: number) {
    super(numberValue);
    this.stringValue = stringValue;
  }
  stringValue: SingleEnumValue<TValues>;
}

type BitFlagEnumV2<TValues extends readonly string[]> = {
  readonly [key in SingleEnumValue<TValues>]: BitFlagEnumValue<TValues>;
} & {
  readonly keys: readonly SingleEnumValue<TValues>[];
};

// implements BitFlagEnumV2
class BitFlagEnumImpl<TArr extends readonly string[]> {
  readonly keys: readonly SingleEnumValue<TArr>[];

  constructor(values: TArr) {
    this.keys = values;

    for (let i = 0; i < values.length; i++) {
      const value = values[i] as SingleEnumValue<TArr>;

      const numValue = 1 << i;
      // @ts-expect-error this is valid for now... mostly. Would be ideal to
      // modify the return type to include the new 'number' values
      this[value] = new BitFlagEnumValueImpl<TArr>(value, numValue);
    }
  }

  union(other: BitFlagValue<TArr>[]): BitFlagValue<TArr> {
    let ret = 0;
    for (let i = 0; i < other.length; i++) {
      const val = other[i];
      ret |= val.value;
    }
    return new BitFlagValueImpl<TArr>(ret);
  }
}

/**
 * Enforces that the provided string array must be declared with the `as const`
 * postfix. The "as const" enables the elements in the array to be used to
 * construct the enum-like types.
 */
type EnumValues<TValues extends readonly string[]> = string[] extends TValues
  ? never
  : TValues;
/**
 * Constructs an enum-like type, with members of the names specified in 'values'
 *
 * @param values an array containing the string names for the members of the
 * constructed 'enum'. The array must be declared with `as const`.
 * @example const Color = createBitFlagsEnum(['Red', 'Green', 'Blue'] as const)
 */
export const createBitFlagsEnum = <TValues extends readonly string[]>(
  values: EnumValues<TValues>
): BitFlagEnumV2<TValues> => {
  return new BitFlagEnumImpl(values) as BitFlagEnumV2<TValues>;
};
