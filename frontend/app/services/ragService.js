import shimlaData from '../data/shimla.json';

class RAG {
  retrieveRelevant(query = '', topK = 8) {
    if (!query.trim()) {
      return shimlaData.spots.slice(0, topK);
    }

    const keywords = query
      .toLowerCase()
      .split(' ')
      .filter(Boolean);

    const scored = shimlaData.spots.map(spot => {
      let score = 0;

      keywords.forEach(kw => {
        if (spot.name.toLowerCase().includes(kw)) score += 10;
        if (spot.category.toLowerCase().includes(kw)) score += 5;
        if (spot.description.toLowerCase().includes(kw)) score += 3;

        if (
          spot.local_tip &&
          spot.local_tip.toLowerCase().includes(kw)
        ) {
          score += 2;
        }
      });

      return { spot, score };
    });

    const relevant = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(s => s.spot);

    return relevant.length
      ? relevant
      : shimlaData.spots.slice(0, topK);
  }

  buildContext(spots) {
    return spots
      .map(
        s =>
          `${s.name} (${s.category}): ${s.description}
Best time: ${s.best_time}
Duration: ${s.duration_hours} hours
Tip: ${s.local_tip}`
      )
      .join('\n\n');
  }
}

export default new RAG();
