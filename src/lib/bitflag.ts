type StandardEnum<T extends number | string> = {
  [id: string]: T;
};

type BitFlagUnion<
  _TFlag extends StandardEnum<TValues>,
  TValues extends string | number
> = {
  value: number;
  hasFlag: (flag: TValues extends number ? TValues : never) => boolean;
};

export const bitFlagIfy = <
  TEnum extends StandardEnum<TValues>,
  TValues extends number | string
>(
  values: TEnum
): TEnum & {
  union: (
    ...other: (TValues extends number ? TValues : never)[]
  ) => BitFlagUnion<TEnum, TValues>;
} => {
  const retEnum: StandardEnum<TValues> = {};

  Object.defineProperty(retEnum, 'union', {
    value: (
      ...other: (TValues extends number ? TValues : never)[]
    ): BitFlagUnion<TEnum, TValues> => {
      let ret = 0;
      for (let i = 0; i < other.length; i++) {
        const val = other[i];
        ret |= val;
      }
      return {
        value: ret,
        hasFlag: (val) => (ret & val) === val,
      };
    },
    writable: false,
  });

  const keys = Object.keys(values);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = values[key];
    if (typeof value !== 'string') {
      continue;
    }

    // @ts-expect-error this is valid for now... mostly. Would be ideal to
    // modify the return type to include the new 'number' values
    retEnum[(retEnum[value] = 1 << i)] = value;
  }

  return retEnum as TEnum & {
    union: (
      ...other: (TValues extends number ? TValues : never)[]
    ) => BitFlagUnion<TEnum, TValues>;
  };
};
