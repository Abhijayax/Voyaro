const {
  nearestNeighbor,
  twoOpt,
  totalDistance
} = require('./routes/optimizer');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const itineraryRouter = require('./routes/itinerary');
const weatherRouter = require('./routes/weather');
const crowdRouter = require('./routes/crowd');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/itinerary', itineraryRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/crowd', crowdRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.post('/api/optimize-route', (req, res) => {
  const { spots } = req.body;

  if (!spots || spots.length < 2) {
    return res.status(400).json({
      error: 'Need at least 2 spots'
    });
  }

  const nn = nearestNeighbor([...spots]);
  const optimized = twoOpt([...nn]);

  const before = totalDistance(nn);
  const after = totalDistance(optimized);

  res.json({
    original_order: nn.map(s => s.name),
    optimized_order: optimized.map(s => s.name),
    original_km: before.toFixed(2),
    optimized_km: after.toFixed(2),
    improvement_pct: (
      ((before - after) / before) * 100
    ).toFixed(2)
  });
});
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
