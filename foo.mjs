const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function* makeRangeIterator() {
  const promises = Array(10)
    .fill(0)
    .map((_, i) => delay(Math.random() * 1000).then(() => i));
  for (const p of promises) {
    console.log('before yield');
    yield await p;
  }
}

for await (const i of makeRangeIterator()) {
  console.log(i);
}

export {};
