import { ReflectionKind } from 'typedoc';

const tx: Record<string, string> = {
  TypeAlias: `Type`,
  Variable: 'Constant',
};

export const reflectionKind: Readonly<Record<number, string>> = Object.fromEntries(
  Object.entries(ReflectionKind)
    .filter(([, v]) => typeof v === 'number')
    .map(([k, v]) => [v, tx[k] ?? k]),
);
