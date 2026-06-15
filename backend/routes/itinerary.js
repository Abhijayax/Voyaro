const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const shimlaData = require('../data/shimla.json');
const rag = require('../services/ragService');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const lastRequest = {};
function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  if (lastRequest[ip] && now - lastRequest[ip] < 10000) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  lastRequest[ip] = now;
  next();
}
router.post('/generate', rateLimiter, async (req, res) => {
  const { days = 3, budget_per_day = 1000, group_type = 'couple', interests = [], travel_dates = '', past_trips = '', travel_style = 'balanced' } = req.body;
  let budget_tier = 'budget';
  if (budget_per_day >= 5000) budget_tier = 'luxury';
  else if (budget_per_day >= 2000) budget_tier = 'mid';
  const relevantSpots = shimlaData.spots.map(s => ({ id: s.id, name: s.name, category: s.category, description: s.description, duration_hours: s.duration_hours, best_time: s.best_time, local_tip: s.local_tip, budget_tier: s.budget_tier, lat: s.lat, lng: s.lng }));
  const hotels = shimlaData.hotels[budget_tier];
  const themes = [
    { name: 'Adventure & Nature', focus: 'outdoor activities, treks, hidden gems' },
    { name: 'Cultural & Heritage', focus: 'temples, history, photography' },
    { name: 'Relaxed & Budget', focus: 'budget, easy walks, cafes' }
  ];
  const itineraries = [];
  for (const theme of themes) {

    const retrieved = rag.retrieveRelevant(
      interests.join(' ') + ' ' + theme.focus
    );
  
    const ragContext = rag.buildContext(retrieved);
  
    const userPrompt = `
  You are a local Shimla travel expert.
  
 Create a ${days}-day itinerary.

IMPORTANT RULES:

1. Use ONLY attractions from the CURATED SHIMLA ATTRACTIONS list below.
2. Mention attraction names EXACTLY as written in the list.
3. Include at least ${Math.min(days * 3, 10)} unique attractions across the itinerary.
4. Each day must contain 2-4 attractions from the curated list.
5. Avoid generic activities such as:
   - Explore local market
   - Relax at hotel
   - Cafe hopping
   - Shopping
   unless tied to a curated attraction.
6. Every activity field should contain a real attraction name from the curated list.
7. Spread attractions geographically to reduce travel distance.
8. Prefer attractions matching the user's interests.
9. Do not invent attractions that are not in the provided context.

EXAMPLE:

Day 1:
- Mall Road
- The Ridge
- Christ Church

Day 2:
- Jakhu Temple
- Viceregal Lodge (IIAS)
- Kali Bari Temple

Day 3:
- Kufri
- Green Valley
- Naldehra Golf Course
  
  CURATED SHIMLA ATTRACTIONS:
  
  ${ragContext}
  
  User Information:
  Budget: ₹${budget_per_day}/day
  Group: ${group_type}
  Interests: ${interests.join(', ')}
  Travel Style: ${travel_style}
  Theme: ${theme.focus}
  Travel Dates: ${travel_dates || 'Not specified'}
  Past Trips: ${past_trips || 'First visit'}
  
  Return JSON ONLY:
  
  {
    "theme":"${theme.name}",
    "trip_summary":"1 line",
    "highlights":["a","b","c"],
    "budget_estimate":{
      "accommodation":"₹X",
      "food":"₹X",
      "transport":"₹X",
      "activities":"₹X",
      "total":"₹X"
    },
    "crowd_risk":"low",
    "best_for":"x",
    "days":[
      {
        "day":1,
        "theme":"x",
        "schedule":[
          {
            "time":"8am",
            "activity":"EXACT attraction name from curated list",
            "duration":"2h",
            "crowd_warning":null,
            "local_tip":"tip",
            "cost":"₹0"
          }
        ]
      }
    ],
    "accommodation":{
      "name":"h",
      "price":"₹x",
      "why":"y"
    },
    "transport_advice":"text",
    "seasonal_note":"text"
  }
  `;
  
    try {
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 3000,
        messages: [{ role: 'user', content: userPrompt }]
      });
  
      const rawText = message.content[0].text;
  
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
  
      const itinerary = JSON.parse(cleaned);
  
      itineraries.push(itinerary);
  
    } catch (err) {
      console.error('Error:', err.message);
      return res.status(500).json({ error: 'Generation failed' });
    }
  }
  res.json({ success: true, itineraries });
});
module.exports = router;
