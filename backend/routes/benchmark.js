
const { nearestNeighbor, twoOpt, totalDistance } = require('./optimizer');
const shimlaData = require('../data/shimla.json');

const tests = [
  shimlaData.spots.slice(0, 5),
  shimlaData.spots.slice(0, 8),
  shimlaData.spots.slice(0, 10),
];

console.log('\nROUTE OPTIMIZATION BENCHMARK');
console.log('============================\n');

let improvements = [];
tests.forEach((spots, idx) => {
  const nn = nearestNeighbor([...spots]);
  const optimized = twoOpt([...nn]);
  const nnDist = totalDistance(nn);
  const optDist = totalDistance(optimized);
  const pct = ((nnDist - optDist) / nnDist * 100).toFixed(2);
  improvements.push(parseFloat(pct));
  console.log(`Test ${idx+1} (${spots.length} spots):`);
  console.log(`  NN:    ${nnDist.toFixed(2)} km`);
  console.log(`  2-opt: ${optDist.toFixed(2)} km`);
  console.log(`  Saved: ${pct}%\n`);
});

const avg = (improvements.reduce((a,b) => a+b, 0) / improvements.length).toFixed(2);
console.log(`Average improvement: ${avg}%`);
console.log('\nSave this output in docs/route-optimization.md');
