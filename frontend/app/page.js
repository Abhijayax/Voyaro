


'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

import Map from './components/Map';
import shimlaData from '../../backend/data/shimla.json';
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [itineraries, setItineraries] = useState(null);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    days: 3,
    budget_per_day: 1500,
    group_type: 'couple',
    interests: [],
    travel_dates: '',
    past_trips: '',
    travel_style: 'balanced'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        interests: checked
          ? [...prev.interests, value]
          : prev.interests.filter(i => i !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setItineraries(null);
setSelectedItinerary(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/itinerary/generate`,
        formData
      );
      setItineraries(response.data.itineraries);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate itinerary. Check your API is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (selectedItinerary) {
    return (
      <ItineraryDisplay
        itinerary={selectedItinerary}
        onBack={() => setSelectedItinerary(null)}
      />
    );
  }
  
  if (itineraries) {
    return (
      <div className={styles.container}>
        <h1>Choose Your Itinerary</h1>
  
        {itineraries.map((plan, index) => (
          <div
            key={index}
            className={styles.dayCard}
            style={{ marginBottom: '20px', cursor: 'pointer' }}
          >
            <h2>{plan.theme}</h2>
  
            <p>{plan.trip_summary}</p>
  
            <p>
              <strong>Best For:</strong> {plan.best_for}
            </p>
  
            <p>
              <strong>Budget:</strong> {plan.budget_estimate?.total}
            </p>
  
            <button
              className={styles.submitBtn}
              onClick={() => setSelectedItinerary(plan)}
            >
              View Full Plan
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div
  style={{
    padding: '40px',
    borderRadius: '16px',
    marginBottom: '30px',
    background: 'linear-gradient(135deg,#0f172a,#1e293b)',
    color: 'white'
  }}
>
      <h1>✈️ Voyaro</h1>
      <p>
  AI-powered travel planning with local knowledge, route optimization, and smart recommendations.
</p></div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>How many days?</label>
          <input
            type="number"
            name="days"
            min="1"
            max="10"
            value={formData.days}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Daily budget (₹)</label>
          <input
            type="number"
            name="budget_per_day"
            min="500"
            step="500"
            value={formData.budget_per_day}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Group type</label>
          <select name="group_type" value={formData.group_type} onChange={handleInputChange}>
            <option value="solo">Solo traveler</option>
            <option value="couple">Couple</option>
            <option value="family">Family with kids</option>
            <option value="friends">Friends group</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Interests (select multiple)</label>
          <div className={styles.checkboxGroup}>
            {['temples', 'nature', 'photography', 'adventure', 'heritage', 'food'].map(interest => (
              <label key={interest} className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="interests"
                  value={interest}
                  checked={formData.interests.includes(interest)}
                  onChange={handleInputChange}
                />
                {interest.charAt(0).toUpperCase() + interest.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>When are you traveling? (e.g., December, mid-January)</label>
          <input
            type="text"
            name="travel_dates"
            placeholder="e.g., December, mid-January"
            value={formData.travel_dates}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Have you been to Shimla before? (optional)</label>
          <input
            type="text"
            name="past_trips"
            placeholder="e.g., Yes, 2 years ago, loved Jakhu Temple"
            value={formData.past_trips}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Travel style</label>
          <select name="travel_style" value={formData.travel_style} onChange={handleInputChange}>
            <option value="budget">Budget (hostels, local transport)</option>
            <option value="balanced">Balanced (mix of comfort and value)</option>
            <option value="luxury">Luxury (resorts, private transport)</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Creating your itinerary...' : 'Generate My Itinerary'}
        </button>

        {error && <div className={styles.error}>{error}</div>}
      </form>
    </div>
  );
}

function ItineraryDisplay({ itinerary, onBack }) {
  const selected = Array.isArray(itinerary) ? itinerary[0] : itinerary;
  const activities = selected.days.flatMap(day =>
    day.schedule.map(slot => slot.activity)
  );
  
  const matchingSpots = shimlaData.spots.filter(spot =>
    activities.some(activity =>
      activity.toLowerCase().includes(spot.name.toLowerCase()) ||
      spot.name.toLowerCase().includes(activity.toLowerCase())
    )
  );
  return (
    <div className={styles.container}>
      <button onClick={onBack} className={styles.backBtn}>
        ← Back to planner
      </button>

      <h1>{selected.theme}</h1>
      <p className={styles.summary}>{selected.trip_summary}</p>
      <div
  style={{
    marginBottom: '30px'
  }}
>
  <h2>📸 Places You'll Visit</h2>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px'
    }}
  >
    {matchingSpots.map((spot, idx) => (
      <div
        key={idx}
        style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <img
          src={spot.images?.[0] || '/images/placeholder.jpg'}
          alt={spot.name}
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'cover'
          }}
        />

        <div style={{ padding: '15px' }}>
          <h3>{spot.name}</h3>

          <p
            style={{
              fontSize: '0.9rem',
              color: '#666'
            }}
          >
            {spot.description}
          </p>

          <p>
            📍 {spot.category}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
<div style={{ marginBottom: '30px' }}>
  <h2>🗺️ Trip Route Map</h2>

  <Map
    day={{
      schedule: matchingSpots.map(spot => ({
        activity: spot.name,
        time: ''
      }))
    }}
    spots={matchingSpots}
  />
</div>
<div
  style={{
    background: '#eef6ff',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px'
  }}
>
  <h2>🚗 Route Optimization Engine</h2>

  <p>
    <strong>Algorithms:</strong> Nearest Neighbor + 2-opt Local Search
  </p>

  <p>
    Attractions are reordered to reduce overall travel distance
    while preserving practical sightseeing flow.
  </p>

  <p>
    Route distances are computed using the Haversine formula
    using real latitude and longitude coordinates.
  </p>

  <p>
    <strong>Complexity:</strong> O(n²) route construction + O(n³) optimization
  </p>
</div>
      <div className={styles.budgetSection}>
        <h2>Budget Breakdown</h2>
        <div className={styles.budget}>
          <div>🏨 Accommodation: {selected.budget_estimate?.accommodation}</div>
          <div>🍽️ Food: {selected.budget_estimate?.food}</div>
          <div>🚌 Transport: {selected.budget_estimate?.transport}</div>
          <div>🎫 Activities: {selected.budget_estimate?.activities}</div>
          <div className={styles.total}>
            💰 Total: {selected.budget_estimate?.total}
          </div>
        </div>
      </div>

      {selected.days?.map(day => (
        <div key={day.day} className={styles.dayCard}>
          <h2>
            Day {day.day} — {day.theme}
          </h2>

          <div className={styles.schedule}>
            {day.schedule?.map((slot, idx) => (
              <div key={idx} className={styles.slot}>
                <div className={styles.time}>{slot.time}</div>

                <div className={styles.activity}>
                  <h4>{slot.activity}</h4>

                  <p className={styles.duration}>
                    ⏱️ {slot.duration}
                  </p>

                  {slot.crowd_warning && (
                    <p className={styles.warning}>
                      ⚠️ {slot.crowd_warning}
                    </p>
                  )}

                  <p className={styles.tip}>
                    💡 {slot.local_tip}
                  </p>

                  <p className={styles.cost}>
                    {slot.cost}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className={styles.hotelSection}>
        <h2>Where to Stay</h2>

        <div className={styles.hotel}>
          <h3>{selected.accommodation?.name}</h3>
          <p><strong>Price:</strong> {selected.accommodation?.price}</p>
          <p><strong>Why:</strong> {selected.accommodation?.why}</p>
        </div>
      </div>

      <div className={styles.transportSection}>
        <h2>Getting Around</h2>
        <p>{selected.transport_advice}</p>
      </div>

      <div className={styles.seasonalSection}>
        <h2>Seasonal Notes</h2>
        <p>{selected.seasonal_note}</p>
      </div>

      <button onClick={onBack} className={styles.submitBtn}>
        ← Plan Another Trip
      </button>
    </div>
  );
}