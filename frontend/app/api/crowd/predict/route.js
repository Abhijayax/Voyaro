import { NextResponse } from 'next/server';
import shimlaData from '../../../data/shimla.json';

const PEAK_MONTHS = [4, 5, 9, 10]; // May, Jun, Oct, Nov
const SNOW_MONTHS = [11, 0, 1, 2];  // Dec, Jan, Feb, Mar

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const spot_id = searchParams.get('spot_id');
  const date = searchParams.get('date');

  if (!spot_id || !date) {
    return NextResponse.json({ error: 'spot_id and date required' }, { status: 400 });
  }

  const spot = shimlaData.spots.find(s => s.id === spot_id);
  if (!spot) {
    return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
  }

  const d = new Date(date);
  const dayOfWeek = d.getDay();
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

  return NextResponse.json({
    spot: spot.name,
    date,
    crowd_level: crowdLevel,
    score,
    is_peak_season: isPeak,
    is_snow_season: isSnowSeason,
    advice,
    local_tip: spot.local_tip
  });
}
