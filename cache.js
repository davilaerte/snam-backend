const cache = require('memory-cache');

exports.putInCache = function (key, value, time) {
  if (time !== undefined) {
    cache.put(key, value, time);
  } else {
    cache.put(key, value);
  }
};

exports.getFromCache = function (key) {
  let value = cache.get(key);

  return value;
};