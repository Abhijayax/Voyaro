const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/shimla', async (req, res) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=Shimla,IN&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&cnt=7`;

    const response = await axios.get(url);

    const forecasts = response.data.list.slice(0, 7).map(item => ({
      date: item.dt_txt,
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      description: item.weather[0].description,
      rain: item.rain ? item.rain['3h'] || 0 : 0
    }));

    res.json({
      success: true,
      forecasts
    });

  } catch (err) {
    res.status(500).json({
      error: 'Weather fetch failed'
    });
  }
});

module.exports = router;