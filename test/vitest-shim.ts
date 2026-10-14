// The few parts of Vitest's API the tests of the balls and the gear are written in (describe, it, expect and the usual matchers), on node:test and node:assert, so that those tests run as they were written
// and the package keeps no test dependency.
import assert from "node:assert/strict";
import { describe as nodeDescribe, it as nodeIt } from "node:test";

export const describe = nodeDescribe;
export const it = nodeIt;

type Matchers = {
  toBe(expected: unknown): void;
  toEqual(expected: unknown): void;
  toContain(expected: unknown): void;
  toMatch(expected: RegExp | string): void;
  toBeGreaterThan(n: number): void;
  toBeGreaterThanOrEqual(n: number): void;
  toBeLessThan(n: number): void;
  toBeLessThanOrEqual(n: number): void;
  toBeCloseTo(n: number, digits?: number): void;
  toBeDefined(): void;
  toBeUndefined(): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toHaveLength(n: number): void;
  toThrow(expected?: RegExp | string): void;
};

/** `expect(value, message?)` as Vitest has it: a matcher that fails with the message, and the same matchers after `.not`. */
export function expect(value: unknown, message?: string): Matchers & { not: Matchers } {
  const make = (negate: boolean): Matchers => {
    const check = (ok: boolean, what: string): void => assert.ok(negate ? !ok : ok, `${message === undefined ? "" : `${message}: `}expected ${negate ? "not " : ""}${what}`);
    const text = (v: unknown): string => (typeof v === "string" ? JSON.stringify(v.length > 80 ? `${v.slice(0, 80)}...` : v) : String(v));
    return {
      toBe: (e) => check(Object.is(value, e), `${text(value)} to be ${text(e)}`),
      toEqual: (e) => {
        let same = true;
        try {
          assert.deepEqual(value, e);
        } catch {
          same = false;
        }
        check(same, `${text(JSON.stringify(value))} to equal ${text(JSON.stringify(e))}`);
      },
      toContain: (e) => check(typeof value === "string" ? value.includes(String(e)) : (value as unknown[]).includes(e), `${text(value)} to contain ${text(e)}`),
      toMatch: (e) => check(typeof e === "string" ? String(value).includes(e) : e.test(String(value)), `${text(value)} to match ${String(e)}`),
      toBeGreaterThan: (n) => check((value as number) > n, `${String(value)} > ${n}`),
      toBeGreaterThanOrEqual: (n) => check((value as number) >= n, `${String(value)} >= ${n}`),
      toBeLessThan: (n) => check((value as number) < n, `${String(value)} < ${n}`),
      toBeLessThanOrEqual: (n) => check((value as number) <= n, `${String(value)} <= ${n}`),
      toBeCloseTo: (n, digits = 2) => check(Math.abs((value as number) - n) < 10 ** -digits / 2, `${String(value)} close to ${n}`),
      toBeDefined: () => check(value !== undefined, "a defined value"),
      toBeUndefined: () => check(value === undefined, "undefined"),
      toBeTruthy: () => check(Boolean(value), "a truthy value"),
      toBeFalsy: () => check(!value, "a falsy value"),
      toHaveLength: (n) => check((value as { length: number }).length === n, `length ${n}`),
      toThrow: (e) => {
        let thrown: unknown;
        try {
          (value as () => void)();
        } catch (error) {
          thrown = error;
        }
        check(thrown !== undefined && (e === undefined || (typeof e === "string" ? String((thrown as Error).message).includes(e) : e.test(String((thrown as Error).message)))), "a throw");
      },
    };
  };
  return { ...make(false), not: make(true) };
}
