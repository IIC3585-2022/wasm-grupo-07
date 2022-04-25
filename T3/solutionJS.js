function combinations(array) {
  return new Array(1 << array.length)
    .fill()
    .map((e1, i) => array.filter((e2, j) => i & (1 << j)));
}

function add(a, b) {
  return a + b;
}

function pariticionsAddN(array, n) {
  return combinations(array).filter((subarray) => subarray.reduce(add, 0) == n);
}

async function timeParticion(array, n) {
  var startTime = performance.now();
  //var output = await resolveAfter3Seconds();
  var output = await pariticionsAddN(array, n);
  var endTime = performance.now();
  var time = endTime - startTime;
  //output.push(time);
  return [output, time];
}

async function resolveAfter3Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 3000);
  });
}

async function Example() {
  const a = await timeParticion([2, 4, 45, 6, 0, 19], 51);
  console.log(a);
}

export default timeParticion;
//Example();
