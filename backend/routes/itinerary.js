const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const shimlaData = require('../data/shimla.json');
const rag = require('../services/ragService');
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 120000 // 120 seconds timeout
});
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
  const allSpots = shimlaData.spots.map(s => ({ id: s.id, name: s.name, category: s.category, description: s.description, duration_hours: s.duration_hours, best_time: s.best_time, local_tip: s.local_tip, budget_tier: s.budget_tier, lat: s.lat, lng: s.lng }));
  const hotels = shimlaData.hotels[budget_tier];
  const themes = [
    { name: 'Adventure & Nature', focus: 'outdoor activities, treks, hidden gems' },
    { name: 'Cultural & Heritage', focus: 'temples, history, photography' },
    { name: 'Relaxed & Budget', focus: 'budget, easy walks, cafes' }
  ];
  try {
    const itineraries = await Promise.all(
      themes.map(async (theme) => {
        const retrieved = rag.retrieveRelevant(
          interests.join(' ') + ' ' + theme.focus
        );
        console.log('RETRIEVED:', retrieved.map(x => x.name));
        const ragContext = rag.buildContext(retrieved);
        const allAttractions = shimlaData.spots
          .map(s => `${s.name} (${s.category})`)
          .join('\n');

        const userPrompt = `
  You are a local Shimla travel expert.
  
 Create a ${days}-day itinerary.
IMPORTANT RULES:

1. Use ONLY attraction names from the ALLOWED ATTRACTIONS list.
2. Never invent attractions.
3. Every attraction may appear at most once.
4. Use at least ${Math.min(days * 4, 20)} unique attractions.
5. Each day must contain 4-6 attractions.
6. Group nearby attractions together.
7. Match attractions to the user's interests.
8. Keep local_tip under 40 words.
9. Use realistic budget estimates.
10. Never recommend specific hotels, restaurants, cafes, taxi operators, or businesses unless they are explicitly provided in the supplied context.
11. If uncertain, provide budget ranges instead of exact prices.
12. Return VALID JSON ONLY.

- Provide realistic budget ranges appropriate for the user's budget tier.
- Budget tier: ${budget_tier}
Keep every local_tip under 30 words.

Keep budget_estimate concise.
Accommodation, food, transport, activities and total should each be one short line.

Keep transport_advice under 40 words.

Keep seasonal_note under 30 words.

Keep crowd_warning under 12 words.

Keep trip_summary to one sentence (maximum 25 words).

Keep highlights to a maximum of 5 items.

Keep schedule descriptions concise and practical.

Avoid unnecessary storytelling or marketing language.

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

ALLOWED ATTRACTIONS:

${allAttractions}

Use ONLY attractions from the list above.
Do not create new attraction names.

ALL AVAILABLE ATTRACTIONS:

${allAttractions}

IMPORTANT:
The curated attractions above are only examples and context.

You may use ANY attraction from the full attraction list.

Prefer unique attractions.
Never repeat attractions.
Every attraction should appear at most once.
  
  User Information:
  Group: ${group_type}

The user's budget is ₹${budget_per_day} TOTAL per day for the entire travelling group.

It is NOT a per-person budget.

All accommodation, food, transport and activities combined must fit within this total daily budget.
  Interests: ${interests.join(', ')}
  Travel Style: ${travel_style}
  Theme: ${theme.focus}
  Travel Dates: ${travel_dates || 'Not specified'}
  Past Trips: ${past_trips || 'First visit'}
  Every schedule item MUST contain:

- activity
- description
- local_tip
- duration
- cost
- crowd_warning

"description" explains why the attraction is worth visiting in 1-2 concise sentences.

"local_tip" is a practical recommendation under 30 words.

Never leave any field empty.


  Return VALID JSON ONLY.
Every field in the JSON is mandatory.

Do not copy placeholder text from the schema.

Replace every placeholder with real values based on the user's preferences and budget.

Budget ranges must change according to the selected budget tier.
For budget_breakdown:

Accommodation:
- range
- description

Food:
- range
- description

Transport:
- range
- description

Descriptions should explain what travelers can expect.

Do NOT mention specific hotels, restaurants, cafes, taxi companies or business names.

Examples:

Accommodation:
"Comfortable 3-star hotels near the town centre."

Food:
"Mix of local cafés, dhabas and casual restaurants."

Transport:
"Mostly walking within Shimla with shared taxis for attractions outside town."

Each description must be under 25 words.
Return only valid JSON.
Do not include explanations.
Do not include markdown.
Do not include notes after the JSON.
Do not explain your choices.
The response must start with { and end with }.
  
 {
  "theme": "${theme.name}",

  "trip_summary": "Brief one-sentence summary.",

  "highlights": [
    "Key highlight",
    "Key highlight",
    "Key highlight"
  ],

  "budget_estimate": {
    "accommodation": "Estimated accommodation budget",
    "food": "Estimated food budget",
    "transport": "Estimated transport budget",
    "activities": "Estimated activity budget",
    "total": "Estimated total trip cost"
  },

  "crowd_risk": "low | medium | high",

  "best_for": "Short sentence describing the ideal traveller.",

  "total_unique_attractions": 0,

  "days": [
    {
      "day": 1,

      "theme": "Short theme",

      "tagline": "Short tagline",

      "schedule": [
        {
          "time": "08:00 AM",

          "activity": "Exact attraction name from ALLOWED ATTRACTIONS",

          "description": "1–2 concise sentences explaining why this attraction is worth visiting.",

          "duration": "Estimated visit duration",

          "cost": "Estimated cost",

          "crowd_warning": "Short crowd advisory",

          "local_tip": "One practical local tip under 30 words."
        }
      ]
    }
  ],

  "budget_breakdown": {
    "accommodation": {
      "range": "Appropriate accommodation budget range (e.g. ₹1500-2500/night)",
      "description": "Brief generic description of the accommodation available in this budget (e.g. standard 3-star cozy guesthouse near Mall Road) without naming any specific hotels/resorts."
    },
    "food": {
      "range": "Appropriate food budget range (e.g. ₹600-1000/day)",
      "description": "Brief generic description of the dining options (e.g. local cafés, casual street food stalls, and dhabas) without naming any specific restaurants/cafes."
    },
    "transport": {
      "range": "Appropriate transport budget range (e.g. ₹1500-2500/day)",
      "description": "Brief generic description of the recommended transport (e.g. shared local taxis and walking) without naming any taxi brands/companies."
    }
  },

  "transport_advice": "Maximum 40 words.",

  "seasonal_note": "Maximum 30 words."
}
  `;

        const message = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 6000,
          messages: [{ role: 'user', content: userPrompt }]
        });

        const rawText = message.content[0].text;
        let jsonString = rawText;

        const jsonBlock = rawText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonBlock) {
          jsonString = jsonBlock[1];
        } else {
          const start = rawText.indexOf('{');
          const end = rawText.lastIndexOf('}');
          if (start !== -1 && end !== -1) {
            jsonString = rawText.substring(start, end + 1);
          }
        }

        const itinerary = JSON.parse(jsonString);

        const activities = itinerary.days.flatMap(day =>
          day.schedule.map(item => item.activity)
        );
        const uniqueActivities = new Set(activities);

        if (activities.length !== uniqueActivities.size) {
          console.warn("Duplicate attractions detected. Returning itinerary anyway.");
        }

        return itinerary;
      })
    );

    res.json({ success: true, itineraries });
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: 'Generation failed' });
  }
});
module.exports = router;
