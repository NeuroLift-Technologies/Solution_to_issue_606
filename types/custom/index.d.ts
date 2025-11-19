declare module 'node:assert' {
  export const strict: any;
}

declare module 'node:fs/promises' {
  export const readFile: (path: string, encoding: string) => Promise<string>;
}

declare module 'node:path' {
  export function resolve(...segments: string[]): string;
  export function join(...segments: string[]): string;
}

declare const process: {
  cwd(): string;
  exitCode?: number;
};

declare interface Console {
  info: (...args: any[]) => void;
  error: (...args: any[]) => void;
  log: (...args: any[]) => void;
}

declare const console: Console;
