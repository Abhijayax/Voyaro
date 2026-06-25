import './globals.css';
import { Playfair_Display, Inter, Cinzel } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Voyaro | AI-Powered Travel Planning',
  description: 'Experience Shimla with personalized, AI-optimized itineraries. Smart route optimization and local insights at your fingertips.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${cinzel.variable}`}>
      <body style={{ paddingTop: '100px', background: 'var(--background)', color: 'var(--text)' }}>
        <header className="glass nav-header" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 80px',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <a href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: '30px', fontWeight: 900, color: 'var(--gold)', letterSpacing: '3px', fontFamily: 'var(--font-cinzel)' }}>
                VOYARO
              </span>
            </a>
          </div>
          <nav className="nav-menu" style={{ display: 'flex', gap: '60px', fontWeight: 600, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            <a href="/" style={{ color: 'var(--text)', textDecoration: 'none' }}>Planner</a>
            <a href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About</a>
          </nav>
          <div className="nav-spacer" style={{ width: '150px' }}></div>
        </header>

        {children}

        <footer className="footer-container" style={{
          padding: '80px 60px',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          marginTop: '120px'
        }}>
          <div className="footer-inner" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '60px' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <h3 style={{ color: 'white', marginBottom: '24px', fontSize: '24px' }}>VOYARO</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', fontSize: '16px', lineHeight: '1.8' }}>
                An AI-driven bridge between local Shimla wisdom and your travel aspirations. Crafted for those who seek more than just a destination.
              </p>
            </div>
            <div className="footer-links-col" style={{ display: 'flex', gap: '80px' }}>
              <div>
                <h4 style={{ color: 'white', marginBottom: '20px', fontSize: '18px' }}>Voyage</h4>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', lineHeight: '2.5' }}>
                  <li><a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>AI Planner</a></li>
                  <li><a href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>Shimla Gallery</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: '1200px', margin: '60px auto 0', paddingTop: '30px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            © 2026 Voyaro AI. Experience the Queen of Hills differently.
          </div>
        </footer>
      </body>
    </html>
  );
}
