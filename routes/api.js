import { Router } from '../deps.js';
import { scheduleForAllTeam, scheduleForUser, userInformation, allUsersInformation } from '../services/twitch.js';

const router = Router();

//Get home page.
router.get('/', (_req, res, _next) => {
  res.setStatus(404).end('What you looking at!');
});

router.get('/is-live/:user', async(req, res, _next) => {
  let isUserLive = await userInformation(req.params.user);
  res.json(isUserLive);
});

router.get('/the-claw/', async(_req,res, _next) => {
  res.json(await allUsersInformation());
});

router.get('/schedule/:id', async (req, res, _next) => {
  let test = await scheduleForUser(req.params.id);
  res.json(test);
});

router.get('/schedules', async (_req, res, _next) => {
  try {
    const schedules = await Deno.readTextFile("./public/scripts/schedules.json");
    res.json(JSON.parse(schedules));
  }
  catch (err) {
    const schedules = await Deno.readTextFile("./public/scripts/schedules.json");
    res.json(JSON.parse(schedules));
  }
});

router.post('/schedules', async (_req, res, _next) => {
  try {
    await scheduleForAllTeam();

    res.setStatus(200).end('success!');
  } catch (err) {
    console.error(err.stack);
    res.setStatus(500).end(`THERE WAS A ERROR READING/WRITING SCHEDULES\r\n ${err.stack}`)
  }

});

export default router;
