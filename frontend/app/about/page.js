'use client';

import styles from '../page.module.css';

const images = [
  '/images/kali-bari.jpg', '/images/state-museum.jpg', '/images/mall-road/2.jpg',
  '/images/mall-road/3.jpg', '/images/chadwick.jpg', '/images/ridge/2.jpg',
  '/images/ridge/3.jpg', '/images/ridge/1.jpg', '/images/sankat-mochan.jpg',
  '/images/mashobra.jpg', '/images/scandal-point.jpg', '/images/tattapani.jpg',
  '/images/annandale.jpg', '/images/tara-devi.jpg', '/images/glen-forest.jpg',
  '/images/summer-hill.jpg', '/images/christ-church/2.jpg', '/images/christ-church/3.jpg',
  '/images/christ-church/1.jpg', '/images/iias/2.jpg', '/images/iias/3.jpg',
  '/images/iias/1.jpg', '/images/gaiety-theatre.jpg', '/images/green-valley.jpg',
  '/images/naldehra.jpg', '/images/narkanda/2.jpg', '/images/narkanda/3.jpg',
  '/images/narkanda/1.jpg', '/images/fagu.jpg', '/images/chail/2.jpg',
  '/images/chail/3.jpg', '/images/chail/1.jpg', '/images/jakhu/2.jpg',
  '/images/jakhu/3.jpg', '/images/jakhu/1.jpg', '/images/kufri/2.jpg',
  '/images/kufri/3.jpg', '/images/kufri/1.jpg'
];

export default function About() {
  return (
    <main style={{ background: '#0a0a0a', color: 'white', minHeight: '100vh', paddingBottom: '200px' }}>
      
      {/* Cinematic Hero */}
      <section style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/images/iias/1.jpg" alt="Shimla" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }} className="animate-in">
           <h1 style={{ fontSize: '10vw', fontFamily: 'var(--font-playfair)', color: 'var(--gold)', letterSpacing: '-5px', margin: 0, lineHeight: 1 }}>The Journal</h1>
           <p style={{ letterSpacing: '8px', textTransform: 'uppercase', fontSize: '1.2rem', marginTop: '20px' }}>Shimla through the lens of Voyaro</p>
        </div>
      </section>

      {/* Sprawling Layout */}
      <div style={{ padding: '200px 80px', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>
        
        <div style={{ gridColumn: '1 / 7' }} className="animate-in">
          <img src={images[0]} style={{ width: '100%', borderRadius: '20px', border: '1px solid var(--border)' }} alt="Shimla" />
        </div>

        <div style={{ gridColumn: '8 / 13', alignSelf: 'center' }} className="animate-in">
          <h2 style={{ fontSize: '4rem', marginBottom: '30px' }}>A Vision of Silence</h2>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', lineHeight: '2' }}>
            In the heart of the Himalayas, we found more than just a destination. We found a frequency. 
            Voyaro was built to capture that frequency—merging the surgical precision of intelligence 
            with the timeless allure of the mountains.
          </p>
        </div>

        <div style={{ gridColumn: '1 / 6', marginTop: '100px' }} className="animate-in">
          <img src={images[1]} style={{ width: '100%', borderRadius: '20px' }} alt="Shimla" />
          <p style={{ marginTop: '40px', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--gold)' }}>
             "Every winding road tells a story of a thousand departures."
          </p>
        </div>

        <div style={{ gridColumn: '7 / 13' }} className="animate-in">
          <img src={images[2]} style={{ width: '100%', borderRadius: '20px' }} alt="Shimla" />
        </div>

        {/* Narrative Flow */}
        <div style={{ gridColumn: '2 / 12', margin: '200px 0', textAlign: 'center' }} className="animate-in">
          <h3 style={{ fontSize: '6vw', color: 'white' }}>Intelligence Meets Intuition.</h3>
        </div>

        <div style={{ gridColumn: '1 / 5' }} className="animate-in">
           <img src={images[3]} style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '15px' }} alt="Shimla" />
        </div>
        <div style={{ gridColumn: '5 / 9', marginTop: '50px' }} className="animate-in">
           <img src={images[4]} style={{ width: '100%', height: '600px', objectFit: 'cover', borderRadius: '15px' }} alt="Shimla" />
        </div>
        <div style={{ gridColumn: '9 / 13', marginTop: '100px' }} className="animate-in">
           <img src={images[5]} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '15px' }} alt="Shimla" />
        </div>

        <div style={{ gridColumn: '4 / 10', padding: '100px 0' }} className="animate-in">
           <p style={{ fontSize: '1.8rem', lineHeight: '2', color: 'var(--text-muted)', textAlign: 'center' }}>
             Built with <strong>Next.js</strong> for speed, powered by <strong>AI Narratives</strong> for soul, 
             and optimized via <strong>Cartographic Algorithms</strong> for precision. 
             Voyaro is the first of its kind—the architect of your Himalayan odyssey.
           </p>
        </div>

        {/* Dynamic Image Spread */}
        {images.slice(6, 36).map((img, i) => (
          <div key={i} style={{ 
            gridColumn: `span ${[4, 3, 5, 6, 2, 4][i % 6]}`,
            height: `${[400, 300, 500, 450, 350, 600][i % 6]}px`,
            marginTop: `${(i % 3) * 40}px`
          }} className="animate-in">
            <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px', border: '1px solid var(--border)' }} alt="Shimla" />
          </div>
        ))}

        <div style={{ gridColumn: '1 / 13', textAlign: 'center', marginTop: '200px' }} className="animate-in">
           <h2 style={{ fontSize: '5rem', color: 'var(--gold)' }}>Explore Beyond.</h2>
           <div style={{ marginTop: '50px' }}>
              <a href="/" style={{ 
                padding: '24px 60px', 
                background: 'var(--gold)', 
                color: 'black', 
                textDecoration: 'none', 
                fontSize: '1.2rem', 
                fontWeight: 900, 
                borderRadius: '50px',
                letterSpacing: '4px'
              }}>PLAN YOUR VOYAGE</a>
           </div>
        </div>

      </div>
    </main>
  );
}
