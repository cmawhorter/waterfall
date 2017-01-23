import { default as eachOfSeries } from 'async-es/eachOfSeries';

export default function(steps, optionalInitialState, callback) {
  if (typeof optionalInitialState === 'function') callback = optionalInitialState, optionalInitialState = null;
  let state = optionalInitialState || {};
  let fn = (item, key, next) => {
    try {
      item.call(null, state, (err, result) => {
        state[key] = result;
        next(err || null);
      });
    }
    catch (err) {
      next(err);
    }
  };
  eachOfSeries(steps, fn, (err) => callback(err, state));
}
