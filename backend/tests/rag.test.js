const rag = require('../services/ragService');

describe('RAG', () => {
  test('returns array', () => {
    expect(Array.isArray(rag.retrieveRelevant('temple'))).toBe(true);
  });

  test('handles empty query', () => {
    expect(rag.retrieveRelevant('').length).toBeGreaterThan(0);
  });

  test('returns max topK', () => {
    expect(rag.retrieveRelevant('temple', 3).length).toBeLessThanOrEqual(3);
  });

  test('buildContext returns string', () => {
    expect(
      typeof rag.buildContext(
        rag.retrieveRelevant('temple', 1)
      )
    ).toBe('string');
  });
});
