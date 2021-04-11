import { env } from './deps.js';
import * as tty from "https://deno.land/x/tty/mod.ts";
import * as Colors from "https://deno.land/std/fmt/colors.ts";
import { printImage  } from "https://x.nest.land/terminal_images@3.0.0/mod.ts";
import {auth} from './services/twitch.js';

if (!env.TWITCH_CLIENT_ID || !env.TWITCH_CLIENT_SECRET ) {
  console.error(Colors.red('update .env with twitch keys (HINT: duplicate .env.example)'));
  Deno.exit(1);
}

tty.clearScreenSync();
tty.goHomeSync();
await auth();
console.log(Colors.green('AUTH TOKEN FETCHED SUCCESSFULLY'));
console.log(`TOKEN can be found in ${Colors.green('.twitch_key')} file`);
await printImage({path: "./public/cool-300.png", width: 25});
