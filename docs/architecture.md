# Shimla AI Travel Planner Architecture

## Flow

User
↓
Next.js Frontend
↓
Express Backend
↓
RAG Retrieval Layer
↓
Claude API
↓
Route Optimization
↓
JSON Response
↓
Frontend Display

## Components

### Frontend
- Next.js
- React
- Axios

### Backend
- Express
- Anthropic Claude

### RAG
- Keyword-based retrieval
- Curated Shimla dataset

### Optimization
- Haversine distance
- Nearest Neighbor
- 2-opt local search

## Complexity

Nearest Neighbor: O(n²)

2-opt: O(n²) per iteration
Worst case: O(n³)

## Benchmark

Average improvement: 13.37%

Best improvement: 28.84%
