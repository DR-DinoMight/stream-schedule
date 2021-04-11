export { dirname, join } from "https://deno.land/std@0.92.0/path/mod.ts";

export { createError } from "https://deno.land/x/http_errors@3.0.0/mod.ts";
export {
  opine,
  json,
  urlencoded,
  serveStatic,
  Router,
} from "https://deno.land/x/opine@1.2.0/mod.ts";
export * as eta from "https://deno.land/x/eta@v1.11.0/mod.ts";

import { config  } from "https://deno.land/x/dotenv/mod.ts";
export const env = config({ safe: true });

import { LRU  } from "https://deno.land/x/lru@1.0.2/mod.ts";
export const cache = new LRU(500);
