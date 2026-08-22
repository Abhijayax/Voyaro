import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=Shimla,IN&appid=${apiKey}&units=metric&cnt=7`;

    const response = await axios.get(url);

    const forecasts = response.data.list.slice(0, 7).map(item => ({
      date: item.dt_txt,
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      description: item.weather[0].description,
      rain: item.rain ? item.rain['3h'] || 0 : 0
    }));

    return NextResponse.json({
      success: true,
      forecasts
    });
  } catch (err) {
    console.error('Weather fetch error:', err.response?.data || err.message);
    return NextResponse.json(
      { error: 'Weather fetch failed' },
      { status: 500 }
    );
  }
}
