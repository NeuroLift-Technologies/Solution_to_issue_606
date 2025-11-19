declare module 'fs' {
  export const readFileSync: any;
  export const promises: {
    readFile: any;
  };
}

declare module 'path' {
  export const join: (...parts: string[]) => string;
}

declare module 'node:test' {
  const test: any;
  export default test;
}

declare module 'node:assert/strict' {
  const assert: any;
  export default assert;
}

declare const __dirname: string;
declare const process: {
  cwd(): string;
};
