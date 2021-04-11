import { allLiveUsersInformation } from '../services/twitch.js';
import { getSortedDays } from '../utils/date.js';

export const index = async () => {
  const currentlyLiveUsers = await allLiveUsersInformation();
  const schedules = await JSON.parse(await Deno.readTextFile("./public/scripts/schedules.json"));

  const sortedDays = getSortedDays();
  return {
    currentlyLiveUsers,
    sortedDays,
    schedules,
    title: "Ow'do Twitch 👋",
  }
}
