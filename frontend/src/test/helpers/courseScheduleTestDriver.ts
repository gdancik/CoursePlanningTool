/** Reconstructed reusable Jest table-driven test helpers. */
export type TableCase<TInput, TExpected> = {
  name: string;
  input: TInput;
  expected: TExpected;
};
export type MultiArgCase<TArgs extends unknown[], TExpected> = {
  name: string;
  args: TArgs;
  expected: TExpected;
};
export type ErrorCase<TInput> = {
  name: string;
  input: TInput;
  error?: string | RegExp;
};
export function runTableTests<TInput, TExpected>(
  name: string, fn: (input: TInput) => TExpected, cases: TableCase<TInput, TExpected>[]
): void {
  describe(name, () => {
    test.each(cases)('$name', ({input, expected}) => expect(fn(input)).toEqual(expected));
  });
}
export function runMultiArgTableTests<TArgs extends unknown[], TExpected>(
  name: string, fn: (...args: TArgs) => TExpected, cases: MultiArgCase<TArgs, TExpected>[]
): void {
  describe(name, () => {
    test.each(cases)('$name', ({args, expected}) => expect(fn(...args)).toEqual(expected));
  });
}
export function runErrorTableTests<TInput>(
  name: string, fn: (input: TInput) => unknown, cases: ErrorCase<TInput>[]
): void {
  describe(name, () => {
    test.each(cases)('$name', ({input, error}) => {
      if (error === undefined) expect(() => fn(input)).toThrow();
      else expect(() => fn(input)).toThrow(error);
    });
  });
}
export function runAsyncTableTests<TInput, TExpected>(
  name: string, fn: (input: TInput) => Promise<TExpected>, cases: TableCase<TInput, TExpected>[]
): void {
  describe(name, () => {
    test.each(cases)('$name', async ({input, expected}) => {
      await expect(fn(input)).resolves.toEqual(expected);
    });
  });
}
export function runAsyncErrorTableTests<TInput>(
  name: string, fn: (input: TInput) => Promise<unknown>, cases: ErrorCase<TInput>[]
): void {
  describe(name, () => {
    test.each(cases)('$name', async ({input, error}) => {
      if (error === undefined) await expect(fn(input)).rejects.toThrow();
      else await expect(fn(input)).rejects.toThrow(error);
    });
  });
}
