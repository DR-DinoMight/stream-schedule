import * as tty from "https://deno.land/x/tty/mod.ts";
import * as Colors from "https://deno.land/std/fmt/colors.ts";
import { printImage  } from "https://x.nest.land/terminal_images@3.0.0/mod.ts";
import { scheduleForAllTeam } from './services/twitch.js';

tty.clearScreenSync();
tty.goHomeSync();
await scheduleForAllTeam();
console.log(Colors.green('SCHEDULES FETCHED!'));
console.log(`Schedule can be found at ${Colors.green('./public/scripts/schedules.json')}`);
await printImage({path: "https://github.com/whitep4nth3r/p4nth3rlabs/raw/main/public/assets/panthers/fire-300.png", width: 25});
