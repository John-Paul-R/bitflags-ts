import test from 'ava';

import { bitFlag, bitFlagIfy } from './bitflag';

enum Perms {
  Read,
  Write,
  Execute,
}

test('bitFlagIfy_KeyValuesMatch', (t) => {
  const permsFlags = bitFlagIfy(Perms);
  t.is(permsFlags.Read, 1);
  t.is(permsFlags.Write, 2);
  t.is(permsFlags.Execute, 4);
  t.is(permsFlags[1], 'Read');
  t.is(permsFlags[2], 'Write');
  t.is(permsFlags[4], 'Execute');
  t.is(6, Object.keys(permsFlags).length);
});

test('bitFlagIfy_Union_CreatesCorrectValues', (t) => {
  const permsFlags = bitFlagIfy(Perms);
  t.is(
    permsFlags.union(permsFlags.Read, permsFlags.Write, permsFlags.Execute)
      .value,
    permsFlags.Read | permsFlags.Write | permsFlags.Execute
  );
  t.is(permsFlags.union(permsFlags.Read, permsFlags.Write).value, 3);
  t.is(permsFlags.union(permsFlags.Write).value, 2);
  t.is(permsFlags.union().value, 0);
});

test('bitFlagIfy_Union_HasFlag', (t) => {
  const permsFlags = bitFlagIfy(Perms);

  {
    const union = permsFlags.union(
      permsFlags.Read,
      permsFlags.Write,
      permsFlags.Execute
    );
    t.true(union.hasFlag(permsFlags.Read));
    t.true(union.hasFlag(permsFlags.Write));
    t.true(union.hasFlag(permsFlags.Execute));
    t.false(union.hasFlag(0b1000));
  }

  {
    const union = permsFlags.union(permsFlags.Read, permsFlags.Write);
    t.true(union.hasFlag(permsFlags.Read));
    t.true(union.hasFlag(permsFlags.Write));
    t.false(union.hasFlag(permsFlags.Execute));
    t.false(union.hasFlag(0b1000));
  }

  {
    const union = permsFlags.union(permsFlags.Write);
    t.false(union.hasFlag(permsFlags.Read));
    t.true(union.hasFlag(permsFlags.Write));
    t.false(union.hasFlag(permsFlags.Execute));
    t.false(union.hasFlag(0b1000));
  }

  {
    const union = permsFlags.union(1, 2, 3);
    t.false(union.hasFlag(permsFlags.Read));
    t.false(union.hasFlag(permsFlags.Write));
    t.false(union.hasFlag(permsFlags.Execute));
    t.false(union.hasFlag(0b1000));
  }
});

// bitflag

const permsFlags = bitFlag('Read', 'Write', 'Execute');

test('bitFlag_KeyValuesMatch', (t) => {
  t.is(permsFlags.Read, 1);
  t.is(permsFlags.Write, 2);
  t.is(permsFlags.Execute, 4);
  t.is(permsFlags.stringValueOf(1), 'Read');
  t.is(permsFlags.stringValueOf(2), 'Write');
  t.is(permsFlags.stringValueOf(3), undefined);
  t.is(permsFlags.stringValueOf(4), 'Execute');
  t.is(3, Object.keys(permsFlags).length);
});

test('bitFlag_Union_CreatesCorrectValues', (t) => {
  t.is(
    permsFlags.union(permsFlags.Read, permsFlags.Write, permsFlags.Execute)
      .value,
    permsFlags.Read | permsFlags.Write | permsFlags.Execute
  );
  t.is(permsFlags.union(permsFlags.Read, permsFlags.Write).value, 3);
  t.is(permsFlags.union(permsFlags.Write).value, 2);
  t.is(permsFlags.union().value, 0);
});

test('bitFlag_Union_HasFlag', (t) => {
  {
    const union = permsFlags.union(
      permsFlags.Read,
      permsFlags.Write,
      permsFlags.Execute
    );
    t.true(union.hasFlag(permsFlags.Read));
    t.true(union.hasFlag(permsFlags.Write));
    t.true(union.hasFlag(permsFlags.Execute));
    t.false(union.hasFlag(0b1000));
  }

  {
    const union = permsFlags.union(permsFlags.Read, permsFlags.Write);
    t.true(union.hasFlag(permsFlags.Read));
    t.true(union.hasFlag(permsFlags.Write));
    t.false(union.hasFlag(permsFlags.Execute));
    t.false(union.hasFlag(0b1000));
  }

  {
    const union = permsFlags.union(permsFlags.Write);
    t.false(union.hasFlag(permsFlags.Read));
    t.true(union.hasFlag(permsFlags.Write));
    t.false(union.hasFlag(permsFlags.Execute));
    t.false(union.hasFlag(0b1000));
  }

  {
    const union = permsFlags.union(1, 2, 3);
    t.false(union.hasFlag(permsFlags.Read));
    t.false(union.hasFlag(permsFlags.Write));
    t.false(union.hasFlag(permsFlags.Execute));
    t.false(union.hasFlag(0b1000));
  }
});
