# waterfall

I don't find async's waterfall very useful because of it's requirement to pass on state to the next function.  That makes the signature of each step unique, difficult to refactor, and error-prone.

async.waterfall uses eachOfSeries under-the-hood and so does this.  

No external dependencies.  It depends on `async-es/eachOfSeries` but it's bundled.

## Installing

`npm install cmawhorter/waterfall --save` or optionally `npm install cmawhorter/waterfall#x.x.x --save` to peg a version.

## How it works

A task/step signature is constant and always `(state, next)`.  The signature of next is always `(err, result)` and the contents of result become associated with the key passed to waterfall.

```js
var waterfall = require('waterfall');

function calculate(color, size, callback) {
  // fake lookup
  setTimeout(() => callback(null, {
    cost:   1299,
    tax:    200,
    total:  1499,
  }));
}

waterfall({
  color: (state, next) => next(null, 'red'),
  size: (state, next) => next(null, 'small'),
  price: (state, next) => calculate(state.color, state.size, next),
}, (err, state) => {
  console.log('state', JSON.stringify(state, null, 2));
});

```

Output:

```json
{
  "color": "red",
  "size": "small",
  "price": {
    "cost": 1299,
    "tax": 200,
    "total": 1499
  }
}
```

### Optional input

```js
let initialState = { currency: 'usd' }; // Warning: value is not copied and waterfall will modify the contents of this object
waterfall({}, initialState, callback)
```

### No constraints on state

State is just a regular object and there is nothing stopping you from doing `state.color = "red"` in a task instead of returning it to next.

However, if it's easily possible to avoid that you should.  Avoiding that makes it easily understood what's happening, where everything is coming from, and how it can be reordered or refactored.


## Why is this good

Because consistency is good and allows for other things.  For example, with the consistency, you could easily implement a timeout wrapper around your tasks or any other wrapper at any point in the future:

```js
var wrapInTimeout = (maxWait, step) => {
  return (state, next) => {
    var timeout = setTimeout(() => next(new Error('timeout')), maxWait);
    var done = (err, result) => {
      clearTimeout(timeout);
      next(err, result);
    };
    step(state, done);
  };
};

waterfall({
  one: wrapInTimeout(1000, (state, next) => {
    thirdPartyServiceRequest(userId, next);
  }),
})
```


## Key ordering not guaranteed?

In theory, the hash passed to waterfall does not have the execution order guaranteed.  However, in practice, I'm unaware of any engines or environments that would not execute in the order defined.

If you're still concerned, you can refactor the above example into this and it'll work:

```js
waterfall([
  (state, next) => next(null, 'red'),
  (state, next) => next(null, 'small'),
  (state, next) => calculate(state.color, state.size, next),
], (err, state) => {
  console.log('state', JSON.stringify(state, null, 2));
});
```

The keys will be a string that is the index of the step in the array:

```json
{
  "0": "red",
  "1": "small",
  "2": {
    "cost": 1299,
    "tax": 200,
    "total": 1499
  }
}
```
