


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
  const [view, setView] = useState('PLANNER'); // PLANNER, RESULTS
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

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/itinerary/generate`,
        formData
      );
      setItineraries(response.data.itineraries);
      setView('RESULTS');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate itinerary. Check your API is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectItinerary = (plan) => {
    setSelectedItinerary(plan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToForm = () => {
    setView('PLANNER');
    setItineraries(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (selectedItinerary) {
    return (
      <ItineraryDisplay
        itinerary={selectedItinerary}
        onBack={() => setSelectedItinerary(null)}
      />
    );
  }

  if (view === 'RESULTS') {
    return (
      <div style={{ minHeight: '100vh', padding: '160px 5vw', background: 'var(--background)' }}>
        <button onClick={backToForm} className="glass" style={{ padding: '15px 30px', borderRadius: '50px', color: 'var(--gold)', marginBottom: '80px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
          ← Re-Architect
        </button>
        
        <div className="animate-in" style={{ marginBottom: '100px' }}>
          <h2 style={{ fontSize: '5rem', marginBottom: '20px', letterSpacing: '-2px' }}>The Enchanted Proposals</h2>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', maxWidth: '1000px' }}>Three distinct Himalayan narratives, sculpted by AI to match your soul's parameters. Spanned across the horizon of your journey.</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '40px', 
          width: '100%', 
          maxWidth: '1800px',
          margin: '0 auto' 
        }}>
          {itineraries?.map((plan, index) => (
            <div
              key={index}
              className="animate-in"
              onClick={() => selectItinerary(plan)}
              style={{ 
                position: 'relative',
                height: '700px',
                borderRadius: '40px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(212, 175, 55, 0.1)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-20px)';
                e.currentTarget.style.borderColor = 'var(--gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.1)';
              }}
            >
              <img 
                src={`/images/mall-road/${(index % 3) + 1}.jpg`} 
                alt={plan.theme}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
              />
              <div style={{ 
                position: 'absolute', 
                bottom: 0, left: 0, right: 0, 
                padding: '60px', 
                background: 'linear-gradient(to top, rgba(10,10,10,1) 30%, transparent)',
                zIndex: 2
              }}>
                <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '20px', letterSpacing: '5px' }}>OPTION 0{index + 1}</div>
                <h3 style={{ fontSize: '2.8rem', marginBottom: '20px', color: 'white', lineHeight: '1.1' }}>{plan.theme}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', marginBottom: '40px', lineHeight: '1.8' }}>{plan.trip_summary}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '30px' }}>
                   <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--gold)' }}>₹{plan.budget_estimate?.total}</span>
                   <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '2px' }}>DISCOVER NARRATIVE →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main>
      <section style={{ 
        position: 'relative', 
        height: '90vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden',
        background: 'var(--background)'
      }}>
        <img 
          src="/images/mall-road/1.jpg" 
          alt="Shimla Architectural Splendor" 
          style={{ 
            position: 'absolute', 
            top: 0, left: 0, width: '100%', height: '100%', 
            objectFit: 'cover', 
            opacity: 0.3,
            filter: 'grayscale(100%) contrast(120%)'
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 40px' }} className="animate-in">
          <h1 style={{ fontSize: '7rem', color: 'var(--gold)', letterSpacing: '-4px', lineHeight: '0.9', marginBottom: '30px', fontFamily: 'var(--font-playfair)' }}>
            The Architect.
          </h1>
          <p style={{ fontSize: '1.4rem', color: '#ffffff', letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.8 }}>
            Himalayan narratives sculpted by Intelligence.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1800px', margin: '-160px auto 200px', padding: '0 80px', position: 'relative', zIndex: 10 }}>
        <div style={{ 
          padding: '120px 100px', 
          borderRadius: '60px', 
          background: 'rgba(18, 18, 18, 0.4)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle gold accent light */}
          <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '200px', background: 'var(--primary-glow)', filter: 'blur(100px)', opacity: 0.3, pointerEvents: 'none' }}></div>

          <div style={{ marginBottom: '100px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '20px', color: 'white' }}>Journey Architect</h2>
            <p style={{ color: 'var(--gold)', fontSize: '1.1rem', letterSpacing: '4px', textTransform: 'uppercase' }}>Precision meeting Poetry</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '80px 100px' }}>
            <div className={styles.formGroup}>
              <label>Temporal Duration</label>
              <select name="days" value={formData.days} onChange={handleInputChange} style={{ width: '100%', height: '80px', fontSize: '1.2rem', background: 'transparent !important', border: 'none !important', borderBottom: '2px solid rgba(212, 175, 55, 0.1) !important', borderRadius: '0 !important' }}>
                {[1,2,3,4,5,6,7].map(d => <option key={d} value={d}>{d} {d===1 ? 'Night' : 'Nights'}</option>)}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Daily Allocation (₹)</label>
              <input type="number" name="budget_per_day" min="500" step="500" value={formData.budget_per_day} onChange={handleInputChange} style={{ width: '100%', height: '80px', fontSize: '1.2rem', background: 'transparent !important', border: 'none !important', borderBottom: '2px solid rgba(212, 175, 55, 0.1) !important', borderRadius: '0 !important' }} />
            </div>

            <div className={styles.formGroup}>
              <label>Fellowship Type</label>
              <select name="group_type" value={formData.group_type} onChange={handleInputChange} style={{ width: '100%', height: '80px', fontSize: '1.2rem', background: 'transparent !important', border: 'none !important', borderBottom: '2px solid rgba(212, 175, 55, 0.1) !important', borderRadius: '0 !important' }}>
                <option value="solo">Solo</option>
                <option value="couple">Couple</option>
                <option value="family">Family</option>
                <option value="friends">Friends</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Traversal Style</label>
              <select name="travel_style" value={formData.travel_style} onChange={handleInputChange} style={{ width: '100%', height: '80px', fontSize: '1.2rem', background: 'transparent !important', border: 'none !important', borderBottom: '2px solid rgba(212, 175, 55, 0.1) !important', borderRadius: '0 !important' }}>
                <option value="budget">Essential (Budget)</option>
                <option value="balanced">Curated (Balanced)</option>
                <option value="luxury">Opulent (Luxury)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
               <label>Calendar Interval</label>
               <input type="text" name="travel_dates" placeholder="e.g. Late Autumn" value={formData.travel_dates} onChange={handleInputChange} style={{ width: '100%', height: '80px', background: 'transparent !important', border: 'none !important', borderBottom: '2px solid rgba(212, 175, 55, 0.1) !important', borderRadius: '0 !important' }} />
            </div>

            <div className={styles.formGroup}>
               <label>Nostalgic Echoes</label>
               <input type="text" name="past_trips" placeholder="e.g. Adored the Mall Road" value={formData.past_trips} onChange={handleInputChange} style={{ width: '100%', height: '80px', background: 'transparent !important', border: 'none !important', borderBottom: '2px solid rgba(212, 175, 55, 0.1) !important', borderRadius: '0 !important' }} />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '40px' }}>
              <label>Elemental Interests</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '30px' }}>
                {['temples', 'nature', 'photography', 'adventure', 'heritage', 'food'].map(interest => (
                  <label key={interest} style={{ 
                    padding: '18px 45px', 
                    borderRadius: '0', 
                    borderBottom: `2px solid ${formData.interests.includes(interest) ? 'var(--gold)' : 'rgba(255,255,255,0.05)'}`, 
                    cursor: 'pointer',
                    background: formData.interests.includes(interest) ? 'rgba(212, 175, 55, 0.05)' : 'transparent',
                    color: formData.interests.includes(interest) ? 'var(--gold)' : 'var(--text-muted)',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    fontSize: '0.85rem',
                    letterSpacing: '3px',
                    fontWeight: 700
                  }}>
                    <input type="checkbox" name="interests" value={interest} checked={formData.interests.includes(interest)} onChange={handleInputChange} style={{ display: 'none' }} />
                    {interest}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ 
              gridColumn: '1 / -1', 
              padding: '30px', 
              fontSize: '1.5rem', 
              marginTop: '60px', 
              background: 'white', 
              color: 'black', 
              fontWeight: 900, 
              border: 'none', 
              borderRadius: '0',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}>
              {loading ? 'ARCHITECTING...' : 'BEGIN THE BUILD'}
            </button>
          </form>
        </div>
      </div>
    </main>
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
    <div style={{ background: 'var(--background)', color: 'white', minHeight: '100vh', paddingBottom: '200px' }}>
      
      {/* Editorial Header */}
      <header style={{ 
        height: '80vh', 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 10vw',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px' }} className="animate-in">
          <div style={{ color: 'var(--gold)', fontWeight: 800, letterSpacing: '8px', marginBottom: '30px', fontSize: '0.9rem' }}>NARRATIVE ARCHITECTURE</div>
          <h1 style={{ fontSize: '8rem', fontFamily: 'var(--font-playfair)', lineHeight: '0.9', marginBottom: '40px', letterSpacing: '-4px' }}>
            {selected.theme}
          </h1>
          <p style={{ fontSize: '1.8rem', color: 'rgba(255,255,255,0.6)', maxWidth: '800px', lineHeight: '1.6', fontWeight: 300 }}>
            {selected.trip_summary}
          </p>
        </div>
        <img 
          src={matchingSpots[0]?.images?.[0] || '/images/mall-road/1.jpg'} 
          style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '100%', objectFit: 'cover', opacity: 0.3, maskImage: 'linear-gradient(to left, black, transparent)' }} 
          alt="Focus"
        />
      </header>

      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 5vw' }}>
        
        {/* Landmarks Section - Spaced Out */}
        <section style={{ margin: '200px 0' }}>
          <h2 style={{ fontSize: '4rem', fontFamily: 'var(--font-playfair)', color: 'var(--gold)', marginBottom: '100px', textAlign: 'center' }}>Himalayan Landmarks</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '60px' }}>
            {matchingSpots.map((spot, idx) => (
              <div key={idx} style={{ 
                gridColumn: idx % 2 === 0 ? '1 / 7' : '7 / 13',
                marginTop: idx > 1 ? '100px' : '0',
                display: 'flex',
                flexDirection: idx % 2 === 0 ? 'row' : 'row-reverse',
                gap: '40px',
                alignItems: 'center'
              }} className="animate-in">
                <img src={spot.images?.[0]} style={{ width: '50%', height: '400px', objectFit: 'cover', borderRadius: '20px' }} alt={spot.name} />
                <div style={{ width: '50%' }}>
                  <h4 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{spot.name}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>{spot.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Route Logic */}
        <section style={{ margin: '200px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '60px', alignItems: 'center' }}>
            <div style={{ gridColumn: '1 / 5' }} className="animate-in">
              <h2 style={{ fontSize: '3.5rem', marginBottom: '30px' }}>Cartographic Intelligence</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '2', marginBottom: '40px' }}>
                Our algorithm has analyzed the topography of Shimla to ensure your journey follows the path of least resistance—optimizing for both views and physical comfort.
              </p>
              <div style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '30px' }}>
                 <p style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '2px' }}>SPATIAL LOGIC</p>
                 <p>Minimized elevation friction. Seamless transit threads.</p>
              </div>
            </div>
            <div style={{ gridColumn: '6 / 13' }} className="animate-in">
               <Map day={{ schedule: matchingSpots.map(s => ({ activity: s.name })) }} spots={matchingSpots} />
            </div>
          </div>
        </section>

        {/* The Timeline - Redesigned Editorial Style */}
        <section style={{ margin: '200px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '150px' }}>
             <h2 style={{ fontSize: '6rem', fontFamily: 'var(--font-playfair)', letterSpacing: '-2px' }}>The Daily Anthology</h2>
             <p style={{ letterSpacing: '10px', color: 'var(--gold)', textTransform: 'uppercase' }}>Day by Day Narrative</p>
          </div>

          {selected.days?.map((day, dIdx) => (
            <div key={day.day} style={{ marginBottom: '300px' }} className="animate-in">
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '40px', marginBottom: '100px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '40px' }}>
                <span style={{ fontSize: '10rem', color: 'var(--gold)', lineHeight: '0.8', fontFamily: 'var(--font-playfair)', opacity: 0.2 }}>0{day.day}</span>
                <div>
                   <div style={{ fontWeight: 800, color: 'var(--gold)', letterSpacing: '5px', fontSize: '0.8rem', marginBottom: '10px' }}>CHAPTER</div>
                   <h3 style={{ fontSize: '4rem', margin: 0 }}>{day.theme}</h3>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>
                {day.schedule?.map((slot, sIdx) => {
                  const isLarge = sIdx % 4 === 0;
                  const isRight = sIdx % 2 !== 0;
                  return (
                    <div key={sIdx} style={{ 
                      gridColumn: isLarge ? '2 / 12' : (isRight ? '4 / 11' : '2 / 9'),
                      marginBottom: '100px',
                      position: 'relative',
                      zIndex: 1,
                      textAlign: isLarge ? 'center' : 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isLarge ? 'center' : 'flex-start',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '40px',
                      borderRadius: '30px',
                      borderLeft: isLarge ? 'none' : '2px solid var(--gold)'
                    }} className="animate-in">
                      
                      <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '20px', width: '100%' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold)' }}>{slot.time}</span>
                        <div style={{ height: '1px', flex: 1, background: 'rgba(212, 175, 55, 0.2)' }}></div>
                      </div>
                      <h4 style={{ fontSize: isLarge ? '4rem' : '2.8rem', marginBottom: '20px', lineHeight: '1' }}>{slot.activity}</h4>
                      <p
  style={{
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: '1.8',
    maxWidth: '800px',
    marginBottom: '20px'
  }}
>
  {slot.description}
</p>

<p
  style={{
    color: 'var(--gold)',
    fontSize: '1rem',
    marginBottom: '30px'
  }}
>
  💡 {slot.local_tip}
</p>
                      
                      <div style={{ display: 'flex', gap: '40px' }}>
                        <div style={{ opacity: 0.5, fontSize: '0.9rem' }}>⏱️ {slot.duration}</div>
                        <div style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: 800 }}>💰 {slot.cost}</div>
                      </div>

                      {slot.crowd_warning && (
                        <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(212, 175, 55, 0.05)', borderLeft: '3px solid var(--gold)', fontSize: '0.95rem' }}>
                           <strong style={{ color: 'var(--gold)', marginRight: '10px' }}>PACE ADVISORY:</strong> {slot.crowd_warning}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Final Financials & Action */}
        <section style={{ margin: '200px 0', padding: '100px', background: '#0d0d0d', borderRadius: '80px', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
           <h2 style={{ fontSize: '5rem', marginBottom: '80px', textAlign: 'center', fontFamily: 'var(--font-playfair)' }}>Investment Blueprint</h2>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '60px', marginBottom: '80px' }}>
              {[
  {
    l: 'Accommodation',
    v: selected.budget_breakdown?.accommodation?.range || selected.budget_estimate?.accommodation || '₹1,500 - ₹2,500/night',
    d: selected.budget_breakdown?.accommodation?.description || 'Comfortable and clean local stays appropriate for your chosen budget tier.'
  },
  {
    l: 'Transport',
    v: selected.budget_breakdown?.transport?.range || selected.budget_estimate?.transport || '₹500 - ₹1,000/day',
    d: selected.budget_breakdown?.transport?.description || 'Convenient local transit including walking, shared cabs, and local buses.'
  },
  {
    l: 'Gastronomy',
    v: selected.budget_breakdown?.food?.range || selected.budget_estimate?.food || '₹600 - ₹1,200/day',
    d: selected.budget_breakdown?.food?.description || 'A delightful mix of local cafes, casual diners, and authentic street food.'
  },
  {
    l: 'Total Investment',
    v: selected.budget_estimate?.total || '₹2,500 - ₹4,500/day',
    highlight: true
  }
].map((item, i) => (
                <div key={i} style={{ 
                  padding: '50px', 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '30px', 
                  border: item.highlight ? '1px solid var(--gold)' : '1px solid transparent',
                  gridColumn: item.highlight ? '1 / 3' : 'auto',
                  textAlign: item.highlight ? 'center' : 'left'
                }}>
                   <p style={{ color: 'var(--gold)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '15px', fontSize: '0.9rem', fontWeight: 800 }}>{item.l}</p>
                   <p style={{ fontSize: item.highlight ? '5rem' : '2.5rem', fontWeight: 900, marginBottom: '20px' }}>{item.v}</p>
                   {item.d && <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>{item.d}</p>}
                </div>
              ))}
           </div>

           <div style={{ textAlign: 'center' }}>
              <button onClick={onBack} style={{ 
                padding: '30px 100px', 
                background: 'white', 
                color: 'black', 
                fontSize: '1.3rem', 
                fontWeight: 900, 
                border: 'none', 
                borderRadius: '0', 
                letterSpacing: '8px', 
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}>RE-ARCHITECT JOURNEY</button>
           </div>
        </section>

      </div>
    </div>
  );
}