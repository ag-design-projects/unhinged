export function Home() {
  return (
    <div
      className="min-h-screen w-full overflow-hidden flex flex-col"
      style={{ backgroundColor: '#0D0D1F', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Top spacer */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16">
        {/* Doodle accents */}
        <div className="relative flex flex-col items-center w-full">
          <span
            style={{ color: '#FF3DBA', fontSize: '2rem', position: 'absolute', top: '-2.5rem', right: '2rem', transform: 'rotate(15deg)' }}
            className="font-black select-none"
          >✦</span>
          <span
            style={{ color: '#3DFFFF', fontSize: '1.4rem', position: 'absolute', top: '-1rem', left: '1rem', transform: 'rotate(-10deg)' }}
            className="font-black select-none"
          >!</span>

          {/* Logo */}
          <div
            style={{ transform: 'rotate(-1.5deg)' }}
            className="text-center"
          >
            <h1
              className="font-black uppercase tracking-tight leading-none"
              style={{
                fontSize: '5rem',
                color: '#FFE500',
                WebkitTextStroke: '2px #000',
                textShadow: '5px 5px 0 #000',
                letterSpacing: '-0.02em',
              }}
            >
              UNHINGED
            </h1>
          </div>

          {/* Pink underline accent */}
          <div
            style={{ height: '5px', backgroundColor: '#FF3DBA', width: '80%', marginTop: '0.25rem', boxShadow: '3px 3px 0 #000' }}
          />

          {/* Subtitle */}
          <p
            className="text-white font-bold uppercase tracking-wide mt-4 text-lg"
          >The corporate roast game</p>

          {/* Tagline */}
          <p
            className="font-bold mt-1 text-base"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Say what you can't say at work
          </p>

          {/* Decorative element */}
          <div className="flex gap-3 mt-6">
            {['#FF3DBA', '#3DFFFF', '#00FF85', '#FFE500'].map((c, i) => (
              <div
                key={i}
                style={{ width: '12px', height: '12px', backgroundColor: c, border: '2px solid #000', transform: `rotate(${i * 15}deg)` }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Bottom buttons */}
      <div className="px-6 pb-12 flex flex-col gap-4 w-full">
        <button
          className="w-full bg-[#FFE500] text-black font-black uppercase tracking-wide py-5 text-xl border-2 border-black"
          style={{ boxShadow: '4px 4px 0 #000', letterSpacing: '0.05em' }}
        >
          CREATE GAME →
        </button>
        <button
          className="w-full font-black uppercase tracking-wide py-5 text-xl border-2 border-black"
          style={{
            backgroundColor: '#FFF9E8',
            color: '#000',
            boxShadow: '4px 4px 0 #fff',
            letterSpacing: '0.05em',
          }}
        >
          JOIN GAME
        </button>
      </div>
    </div>
  );
}

export default Home;
