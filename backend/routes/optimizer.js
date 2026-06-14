function distance(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const x = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}

function totalDistance(route) {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) total += distance(route[i], route[i+1]);
  return total;
}

function nearestNeighbor(spots) {
  let unvisited = [...spots];
  let route = [unvisited.shift()];
  while (unvisited.length > 0) {
    const last = route[route.length - 1];
    const nearest = unvisited.reduce((min, s) => distance(last, s) < distance(last, min) ? s : min);
    route.push(nearest);
    unvisited.splice(unvisited.indexOf(nearest), 1);
  }
  return route;
}

function twoOpt(route, maxIter = 100) {
  let bestRoute = [...route];
  let bestDistance = totalDistance(bestRoute);

  let improved = true;
  let iter = 0;

  while (improved && iter < maxIter) {
    improved = false;

    for (let i = 1; i < bestRoute.length - 2; i++) {
      for (let j = i + 1; j < bestRoute.length - 1; j++) {

        const newRoute = [
          ...bestRoute.slice(0, i),
          ...bestRoute.slice(i, j + 1).reverse(),
          ...bestRoute.slice(j + 1)
        ];

        const newDistance = totalDistance(newRoute);

        if (newDistance < bestDistance) {
          bestRoute = newRoute;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }

    iter++;
  }

  return bestRoute;
}

module.exports = { nearestNeighbor, twoOpt, distance, totalDistance };
