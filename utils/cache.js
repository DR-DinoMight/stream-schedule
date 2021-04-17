import {cache} from '../deps.js';

export const get = async (key) => {
  return await cache.get(key);
}

export const set = async (key, object, ttl = 5) => {
    const dt = new Date();

    const cacheObj = {
      object: object,
      expiresAt: new Date(dt.getTime() + (ttl*60000))
    };
    return await cache.set(key, cacheObj);
}

export const has = async (key) => {
    const hasObject = await cache.has(key);
    if (!hasObject) return false;
    const object = await get(key);
    if (object.expiresAt <= (new Date())) {
      await cache.remove(key);
      await cache.get(key);
      return false;
    }
    return true;
}

export const remove = async (key) => {
  return await cache.remove(key);
}

