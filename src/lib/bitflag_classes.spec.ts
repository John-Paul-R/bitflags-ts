import test, { ExecutionContext } from 'ava';

import { BitFlagValue, createBitFlagsEnum } from './bitflag_classes';

const sourceArray = ['Read', 'Write', 'Execute'] as const;
const Perms = createBitFlagsEnum(sourceArray);
{
  const sourceArray2 = ['Read', 'Write', 'Execute'];
  // @ts-expect-error We disallow non-"as const" values, since it makes it
  // impossible to inspect the elements in the array from TS, causing the
  // enum-like type safety to be lost
  const Perms2 = createBitFlagsEnum(sourceArray2);
}

test('enum created with expected values', (t) => {
  t.is(Perms.Read.value, 1);
  t.is(Perms.Write.value, 2);
  t.is(Perms.Execute.value, 4);
  t.is(Perms.keys, sourceArray);
  t.is(4, Object.keys(Perms).length);
});

test('Enum.Union creates correct values', (t) => {
  const perms = Perms as any;
  t.is(
    perms.union([Perms.Read, Perms.Write, Perms.Execute]).value,
    Perms.Read.value | Perms.Write.value | Perms.Execute.value
  );
  t.is(perms.union([Perms.Read, Perms.Write]).value, 3);
  t.is(perms.union([Perms.Write]).value, 2);
  t.is(perms.union([]).value, 0);
});

{
  const unionTests =
    <TValues extends readonly string[]>(unitUnderTest: BitFlagValue<TValues>) =>
    (t: ExecutionContext<unknown>) => {
      t.is(
        unitUnderTest.union([Perms.Write, Perms.Execute]).value,
        unitUnderTest.value | Perms.Write.value | Perms.Execute.value
      );
      t.is(
        unitUnderTest.union([Perms.Write]).value,
        unitUnderTest.value | Perms.Write.value
      );
      t.is(unitUnderTest.union([]).value, unitUnderTest.value);
    };

  test('enum instance `union([...])`: creates correct values', (t) => {
    unionTests(Perms.Read)(t);
    unionTests(Perms.Write)(t);
  });

  test('union instance (non-enum) `union([...]): creates correct value', (t) => {
    unionTests(Perms.Read.union([]))(t);
    unionTests(Perms.Read.union([Perms.Read]))(t);
    unionTests(Perms.Read.or(Perms.Execute))(t);
  });
}

test('enum instance `or`: creates correct values', (t) => {
  t.is(
    Perms.Read.or(Perms.Write).or(Perms.Execute).value,
    Perms.Read.value | Perms.Write.value | Perms.Execute.value
  );
  t.is(Perms.Read.or(Perms.Write).value, Perms.Read.value | Perms.Write.value);
});

test('hasFlag', (t) => {
  {
    const union = (Perms as any).union([
      Perms.Read,
      Perms.Write,
      Perms.Execute,
    ]);
    t.true(union.hasFlag(Perms.Read));
    t.true(union.hasFlag(Perms.Write));
    t.true(union.hasFlag(Perms.Execute));
  }

  {
    const union = (Perms as any).union([Perms.Read, Perms.Write]);
    t.true(union.hasFlag(Perms.Read));
    t.true(union.hasFlag(Perms.Write));
    t.false(union.hasFlag(Perms.Execute));
  }

  {
    const union = Perms.Read.union([Perms.Read, Perms.Write, Perms.Execute]);
    t.true(union.hasFlag(Perms.Read));
    t.true(union.hasFlag(Perms.Write));
    t.true(union.hasFlag(Perms.Execute));
  }

  {
    const union = Perms.Read.or(Perms.Write);
    t.true(union.hasFlag(Perms.Read));
    t.true(union.hasFlag(Perms.Write));
    t.false(union.hasFlag(Perms.Execute));
  }

  {
    const union = Perms.Write;
    t.false(union.hasFlag(Perms.Read));
    t.true(union.hasFlag(Perms.Write));
    t.false(union.hasFlag(Perms.Execute));
  }
});

test('intersect', (t) => {
  t.is(
    Perms.Read.intersect([Perms.Read, Perms.Write, Perms.Execute]).value,
    Perms.Read.value
  );
  t.is(
    Perms.Read.or(Perms.Execute).intersect([
      Perms.Read,
      Perms.Write,
      Perms.Execute,
    ]).value,
    Perms.Read.value | Perms.Execute.value
  );
  t.is(
    Perms.Read.or(Perms.Execute).intersect([Perms.Write, Perms.Execute]).value,
    Perms.Execute.value
  );
});
