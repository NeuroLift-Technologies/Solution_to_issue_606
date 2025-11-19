declare module 'node:fs';
declare module 'node:fs/promises';
declare module 'node:path';
declare module 'node:url';
declare module 'node:assert';

declare const process: {
  cwd(): string;
};
