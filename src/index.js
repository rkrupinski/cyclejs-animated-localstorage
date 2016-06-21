const Rx = require('rx');

function animate(str) {
  const chars = str.split('');

  chars.push(chars.shift());

  return chars.join('');
}

function trim(size) {
  return function selector(str) {
    return str.slice(0, size);
  };
}

function write(key) {
  return function observer(str) {
    localStorage.setItem(key, str);
  };
}

function makeAnimatedLocalStorageDriver({
  interval = 100,
  size = 20,
  placeholder = '_',
  key = '☺',
} = {}) {
  return function driver(text$) {
    const animatedText$ = text$
        .filter(Boolean)
        .flatMapLatest(text => Rx.Observable
            .interval(interval)
            .scan(animate, placeholder.repeat(size) + text)
        )
        .map(trim(size))
        .do(write(key))
        .replay(null, 1);

    animatedText$.connect();

    return animatedText$;
  };
}

module.exports = makeAnimatedLocalStorageDriver;
