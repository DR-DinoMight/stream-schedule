import { env } from "../deps.js";
import { users } from "../data/users.js";
import { dayFromDate } from "../utils/date.js";
import * as Cache from "../utils/cache.js";

let schedule = {};

const header = async () => {
  return {
  "Content-Type": "application/json",
  "Client-ID": env.TWITCH_CLIENT_ID,
  "Authorization": `Bearer ${await authToken()}`
  };
};

const authToken = async () => {
  const token = await Deno.readTextFile("./.twitch_key");
  return token;
}

export const auth = async () => {
  //https://id.twitch.tv/oauth2/token?client_id=<your client ID>&client_secret=<your client secret>&grant_type=client_credentials
  let url = `https://id.twitch.tv/oauth2/token?client_id=${env.TWITCH_CLIENT_ID}&client_secret=${env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`;
  const response = await fetch(url, {
    method: 'POST'
  });

  const key = (await response.json()).access_token;

  Deno.writeTextFile('.twitch_key', key);
};

export const userInformation = async (user) => {
  // curl --location --request
  // GET 'https://api.twitch.tv/helix/search/channels?query=a_seagull' \
  // --header 'client-id: wbmytr93xzw8zbg0p1izqyzzc5mbiz' \

  if (!user) throw 'User is needed!';
  let headeer = await header();
  //const response  = await fetch(`https://api.twitch.tv/helix/search/channels?query=${user}&live_only=true&first=1`, {

  const streamInfoUrl = `https://api.twitch.tv/helix/streams?user_login=${user}`;

  let cachedStreamInformationResponse;
  console.log('has?');
  if (!(await Cache.has(streamInfoUrl))) {
    console.log("not got Information")
    const req = new Request( streamInfoUrl , {
      method: "get",
      headers: headeer
    });

    const streamInformationResponse = await fetch(req);
    const streamInformation = await streamInformationResponse.json();

    await Cache.set(streamInfoUrl, streamInformation, 5);
    cachedStreamInformationResponse = streamInformation;
  } else {
    console.log('has in cache');
    cachedStreamInformationResponse = (await Cache.get(streamInfoUrl)).object 
  }


  const userInfoUrl = `https://api.twitch.tv/helix/users?login=${user}`;
  let cachedUserInformationResponse;
  
  if (!await Cache.has(userInfoUrl)) {
    const userInformationRequest = new Request(userInfoUrl, {
      method: "GET",
     headers: headeer
    });

    const userInformationResponse = await fetch(userInformationRequest);
    const userInformation = await userInformationResponse.json();
    await Cache.set(userInfoUrl, userInformation, 60);
    cachedUserInformationResponse = userInformation;
  } else {
    cachedUserInformationResponse = (await Cache.get(userInfoUrl)).object;
  }


  if (cachedUserInformationResponse) {
    return {
      ...cachedUserInformationResponse.data[0],
      'live_info': (Array.isArray(cachedStreamInformationResponse.data) && 
          !cachedStreamInformationResponse.data.length) ? 
        cachedStreamInformationResponse.data[0] : 
        false
    }
  }

  return [];
}

export const allUsersInformation = async () => {
  // curl --location --request
  // GET 'https://api.twitch.tv/helix/search/channels?query=a_seagull' \
  // --header 'client-id: wbmytr93xzw8zbg0p1izqyzzc5mbiz' \

  let contentHeader = await header();
  const userCsv = users.map(user => user.name);

  const streamInformationResponse  = await fetch(`https://api.twitch.tv/helix/streams?user_login=${userCsv.join('&user_login=')}`, {
    method: "GET",
    headers: contentHeader
  });
  const streamInformation = await streamInformationResponse.json();

   const userInformationResponse = await fetch(`https://api.twitch.tv/helix/users?login=${userCsv.join('&login=')}`, {
    method: "GET",
    headers: contentHeader
  });
  const userInformation = await userInformationResponse.json();

  return userInformation.data.map( userInfo => {
    return {
      ...userInfo,
      'live_info': liveInfo(streamInformation, userInfo)
    }
  });

}

export const allLiveUsersInformation = async () => {
  const allInformation = await allUsersInformation();
  const liveInformation = await allInformation.filter( user => {
    if (user.live_info) return user;
  } );
  return liveInformation;
}

export const scheduleForAllTeam = async () => {
  Promise.all(users.map((u) => scheduleForUser(u.name))).then(() => {
    Deno.writeTextFile('./public/scripts/schedules.json',  JSON.stringify(schedule),  function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("File created!");
    });
  });
}

export const scheduleForUser = async (user) => {
  const current = new Date();
  const response = await fetch("https://gql.twitch.tv/gql", {
    method: "POST",
    headers: {
      "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko"
    },
    body: JSON.stringify([
      {
        operationName: "StreamSchedule",
        variables: {
          login: user,
          startingWeekday: "MONDAY",
          utcOffsetMinutes: 0,
          startAt: current,
          endAt: current.getDate() + 7,
        },
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash:
              "e9af1b7aa4c4eaa1655a3792147c4dd21aacd561f608e0933c3c5684d9b607a6",
          },
        },
      },
    ]),
  });

  const data = await response.json();

  if (!data[0].data.user.channel.schedule || !data[0].data.user.channel.schedule.segments) return;

  var items = data[0].data.user.channel.schedule.segments;
  var channelId = data[0].data.user.id;
  items.sort((a,b) => { a.startAt - b.startAt});


  for (const s of items) {
    let contentHeader = await header();
    let dateName = dayFromDate(s.startAt.substr(0, 10));

    const userInformationResponse = await fetch(`https://api.twitch.tv/helix/users?login=${user}`, {
      method: "GET",
      headers: contentHeader
    });
    const userInformation = await userInformationResponse.json();

    if (!schedule[dateName]) {
      schedule[dateName] = [];
    }

    schedule[dateName].push({
      channelId: channelId,
      who: user,
      avatar: userInformation.data[0].profile_image_url,
      start: s.startAt,
      end: s.endAt,
      title: s.title,
    });
  }

  return true;
};


const liveInfo = (streamInformation, userInfo) => {
        const stream = streamInformation.data.find( (stream, _index) => stream.user_id == userInfo.id );

        if (stream) {
          return {
            game_id: stream.game_id,
            game_name: stream.game_name,
            type: stream.type,
            title: stream.title,
            viewer_count: stream.viewer_count,
            started_at: stream.started_at,
            thumbnail_url: stream.thumbnail_url,
            tags: stream.tagstag_ids
          };
        }
        else
          return false;
}

