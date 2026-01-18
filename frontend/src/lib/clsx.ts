export {}

// Dummy clsx function since we're not adding it as dependency
export function clsx(...inputs: any[]) {
  return inputs
    .flat()
    .filter((x) => typeof x === 'string')
    .join(' ')
    .trim();
}

export type ClassValue = string | undefined | null | false;
