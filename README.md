# ✈️ Voyaro

An AI-powered travel planning platform that generates personalized multi-day itineraries using local destination knowledge, route optimization, and structured itinerary generation.

Built with Next.js, Express.js, Claude AI, Railway, and Vercel.

---

## Live Demo

🔗 [Voyaro](https://voyaro-eta.vercel.app)

---

## Features

### Intelligent Itinerary Generation
- Personalized multi-day travel plans
- Multiple itinerary options per request
- Interest-based attraction selection
- Budget-aware recommendations

### Retrieval-Augmented Generation (RAG)
- Curated Shimla knowledge base
- Context-aware attraction retrieval
- Local travel tips and seasonal insights
- Reduced hallucinations through grounded prompting

### Route Optimization
- Nearest Neighbor heuristic
- 2-opt route refinement
- Reduced travel distance between attractions
- Geographically grouped sightseeing plans

### Interactive Experience
- Dynamic attraction gallery
- Interactive Leaflet maps
- Budget breakdown visualization
- Seasonal recommendations
- Crowd advisories

### Production Deployment
- Frontend hosted on Vercel
- Backend hosted on Railway
- Environment variable management
- Claude API integration

---

## Architecture

```text
                User
                  │
                  ▼
          Next.js Frontend
                  │
                  ▼
           Express Backend
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
  Shimla Knowledge Base   Claude AI
        │                   │
        └─────────┬─────────┘
                  ▼
        Structured JSON Itinerary
                  │
                  ▼
            Interactive UI
```

---

## Tech Stack

### Frontend
- Next.js
- React
- Leaflet.js
- Axios

### Backend
- Node.js
- Express.js

### AI Layer
- Claude (Anthropic)

### Deployment
- Vercel
- Railway

---

## Route Optimization

Voyaro includes a custom route optimization pipeline.

### Step 1: Nearest Neighbor

Generates an initial sightseeing route by selecting the nearest unvisited attraction.

### Step 2: 2-opt Improvement

Iteratively improves the route by removing inefficient path crossings.

Benefits:
- Reduced travel distance
- Better attraction sequencing
- More realistic itineraries

---

## Retrieval-Augmented Generation

Rather than relying solely on the LLM:

1. User preferences are collected.
2. Relevant attractions are retrieved from a curated Shimla dataset.
3. Retrieved context is injected into the prompt.
4. Claude generates a structured itinerary grounded in retrieved information.

This helps:
- Reduce hallucinations
- Improve local relevance
- Ensure attraction consistency

---

## Example Features

### Personalized Planning

Inputs:
- Trip duration
- Budget
- Group type
- Interests
- Travel style
- Previous visits

Outputs:
- Multiple itinerary options
- Daily schedules
- Attraction recommendations
- Budget estimates
- Travel advice

---

## Local Development

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/voyaro.git
cd voyaro
```

### Backend

```bash
cd backend
npm install
npm start
```



### Frontend

```bash
cd frontend
npm install
npm run dev
```



---

## Environment Variables

Backend:

```env
ANTHROPIC_API_KEY=your_key
OPENWEATHER_API_KEY=your_key
PORT=3001
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Future Improvements

- Vector embeddings for semantic retrieval
- User accounts and saved trips
- Real-time weather integration
- Hotel and transport APIs
- Multi-city support
- Automated itinerary validation
- Enhanced recommendation engine

---

## Screenshots

### Planner

<img width="1460" height="802" alt="Screenshot 2026-06-24 at 10 30 17 PM" src="https://github.com/user-attachments/assets/c13e9519-9ecd-4c98-9d03-38b849e38f69" />



### Generated Itineraries

<img width="1435" height="787" alt="Screenshot 2026-06-24 at 10 32 03 PM" src="https://github.com/user-attachments/assets/7be927e9-ba9c-4e5f-9a30-3196e43dd35e" />


### Interactive Map

<img width="1444" height="800" alt="Screenshot 2026-06-24 at 10 32 30 PM" src="https://github.com/user-attachments/assets/cd5a1979-1b94-4595-8047-c59a71be8bce" />


### Budget Breakdown

<img width="1427" height="804" alt="Screenshot 2026-06-24 at 10 32 47 PM" src="https://github.com/user-attachments/assets/bfa15d84-a435-4f09-a643-c490b1633a2d" />


---

## Key Learnings

- Full-stack application architecture
- Prompt engineering for structured outputs
- Retrieval-Augmented Generation (RAG)
- Route optimization algorithms
- API deployment and environment management
- Production debugging and monitoring

---

