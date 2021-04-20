import {hourly, everyMinute} from 'https://deno.land/x/deno_cron/cron.ts';
import {scheduleForAllTeam} from './twitch.js';

export const schedule = () => {
  everyMinute(() => {
    console.log('Running CRON...');
    scheduleForAllTeam().then( () => {
      console.log('Fetch new Schedule');
    }).catch((err) => {
      console.erro(err);
    })
  });
}
