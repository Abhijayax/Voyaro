const {
  distance,
  nearestNeighbor,
  twoOpt,
  totalDistance
} = require('../routes/optimizer');

const spots = [
  { name: 'A', lat: 31.1, lng: 77.1 },
  { name: 'B', lat: 31.2, lng: 77.2 },
  { name: 'C', lat: 31.3, lng: 77.3 }
];

describe('distance()', () => {
  test('same point gives zero', () => {
    expect(distance(spots[0], spots[0])).toBe(0);
  });

  test('different points positive', () => {
    expect(distance(spots[0], spots[1])).toBeGreaterThan(0);
  });
});

describe('nearestNeighbor()', () => {
  test('returns all spots', () => {
    expect(nearestNeighbor([...spots]).length).toBe(3);
  });

  test('starts with first spot', () => {
    expect(nearestNeighbor([...spots])[0].name).toBe('A');
  });
});

describe('twoOpt()', () => {
  test('preserves spot count', () => {
    expect(twoOpt([...spots]).length).toBe(3);
  });
});

describe('totalDistance()', () => {
  test('single point route is zero', () => {
    expect(totalDistance([spots[0]])).toBe(0);
  });
});
