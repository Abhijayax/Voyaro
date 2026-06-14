const express = require('express');
const router = express.Router();
const shimlaData = require('../data/shimla.json');

// Rule-based crowd predictor (ML model comes in Week 2)
// months: 0=Jan...11=Dec
const PEAK_MONTHS = [4, 5, 9, 10]; // May, Jun, Oct, Nov
const SNOW_MONTHS = [11, 0, 1, 2];  // Dec, Jan, Feb, Mar

router.get('/predict', (req, res) => {
  const { spot_id, date } = req.query;
  if (!spot_id || !date) {
    return res.status(400).json({ error: 'spot_id and date required' });
  }

  const spot = shimlaData.spots.find(s => s.id === spot_id);
  if (!spot) return res.status(404).json({ error: 'Spot not found' });

  const d = new Date(date);
  const dayOfWeek = d.getDay(); // 0=Sun, 6=Sat
  const month = d.getMonth();

  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isPeak = PEAK_MONTHS.includes(month);
  const isSnowSeason = SNOW_MONTHS.includes(month);

  let crowdLevel = spot.crowd.weekday;
  if (isWeekend) crowdLevel = spot.crowd.weekend;
  if (isPeak) crowdLevel = spot.crowd.peak_season;

  const crowdScore = { very_low: 1, low: 2, medium: 3, high: 4, very_high: 5 };
  const score = crowdScore[crowdLevel] || 3;

  let advice = '';
  if (score >= 4) advice = `Avoid ${spot.name} on this date — very crowded. Visit early morning before 8am.`;
  else if (score === 3) advice = `Moderate crowds expected. Go before 10am for a comfortable experience.`;
  else advice = `Great time to visit ${spot.name}. Low crowd expected.`;

  res.json({
    spot: spot.name,
    date,
    crowd_level: crowdLevel,
    score,
    is_peak_season: isPeak,
    is_snow_season: isSnowSeason,
    advice,
    local_tip: spot.local_tip
  });
});

module.exports = router;
