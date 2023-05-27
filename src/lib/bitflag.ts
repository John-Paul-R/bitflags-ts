type BitFlagEnum<TValues extends readonly string[]> = {
  [key in TValues[number]]: number;
} & {
  union: (...other: number[]) => SimpleBitFlagUnion;
  stringValueOf: (value: number) => string | undefined;
  keys: TValues;
};
type SimpleBitFlagUnion = {
  value: number;
  hasFlag: (flag: number) => boolean;
};

class BitFlagUnionImpl {
  value: number;
  constructor(value: number) {
    this.value = value;
  }

  hasFlag(other: number) {
    return (this.value & other) === other;
  }
}

class BitFlagEnumImpl<TValues extends readonly string[]> {
  keys: TValues;
  numsToStrings: Record<number, string> = {};
  constructor(values: TValues) {
    this.keys = values;
    for (let i = 0; i < values.length; i++) {
      const value = values[i];

      const numValue = 1 << i;
      // @ts-expect-error this is valid for now... mostly. Would be ideal to
      // modify the return type to include the new 'number' values
      this[value] = numValue;
      this.numsToStrings[numValue] = value;
    }
  }

  union(...other: number[]): SimpleBitFlagUnion {
    let ret = 0;
    for (let i = 0; i < other.length; i++) {
      ret |= other[i];
    }
    return new BitFlagUnionImpl(ret);
  }

  stringValueOf(val: number): string | undefined {
    return this.numsToStrings[val];
  }
}

export const bitFlag = <TArr extends readonly string[]>(
  ...values: TArr
): BitFlagEnum<TArr> => {
  return new BitFlagEnumImpl(values) as BitFlagEnum<TArr>;
};
