export function lazy<Args extends any[], T>(
  fn: (...args: Args) => T,
): (...args: Args) => T {
  let _value: T | null = null;

  const ret: (...args: Args) => T = (...args: Args) => {
    if (_value === null) {
      _value = fn(...args);
    }

    return _value;
  };

  return ret;
}

export function assert<T>(value: T, message?: string): asserts value {
  if (!value) {
    throw new Error(message ?? "Internal error");
  }
}

export function bail(message?: string): never {
  throw new Error(message ?? "Internal error");
}
