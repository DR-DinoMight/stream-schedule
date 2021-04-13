

# Installation

- Download Deno from - https://deno.land/#installation
- Download and install the latest version Denon globally (https://deno.land/x/denon) by
```
deno install -qAf --unstable https://deno.land/x/denon/denon.ts
```
- Copy `.env.example` to `.env`
- Get your twitch client id and secret and replace the values `TWITCH_CLIENT_ID` and `TWITCH_CLIENT_SECRET`.
- Run `denon auth` which in turn create a `.twitch_key` which is used as the bearer token.
- If running this for another team swap detail out of each use at `./data/users.js`.
- To make sure we get the schedules go run `denon schedules` this will save a `JSON` file at `./public/scripts/schedules.json`.
- To get server running run `denon start`

- A schedule CRON will run on the hour to go fetch the  schedule, to alter this check out `./services/schedule.js`

