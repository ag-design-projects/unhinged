export function FinalRound() {
  return (
    <div
      className="min-h-screen w-full overflow-hidden flex flex-col items-center"
      style={{
        backgroundColor: '#0D0D1F',
        fontFamily: 'system-ui, sans-serif',
        border: '4px solid #FFE500',
        boxSizing: 'border-box',
      }}
    >
      {/* Corner accents */}
      <div style={{ position: 'absolute', top: 16, left: 16, width: 24, height: 24, backgroundColor: '#FF3DBA', border: '2px solid #000' }} />
      <div style={{ position: 'absolute', top: 16, right: 16, width: 24, height: 24, backgroundColor: '#3DFFFF', border: '2px solid #000' }} />

      {/* Header label */}
      <div className="w-full px-6 pt-14 pb-2 text-center">
        <p className="font-black uppercase tracking-widest text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          ★ ★ ★ LAST CHANCE ★ ★ ★
        </p>
      </div>

      {/* Main text */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 w-full">
        {/* FINAL ROUND text */}
        <div className="text-center">
          <h1
            className="font-black uppercase tracking-tight leading-none"
            style={{
              fontSize: '4.5rem',
              color: '#FFE500',
              textShadow: '5px 5px 0 #FF3DBA, 10px 10px 0 #000',
              lineHeight: 0.9,
            }}
          >
            FINAL<br />ROUND
          </h1>
        </div>

        {/* Progress dots — all filled */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: '#FFE500',
                border: '2px solid #000',
                boxShadow: '2px 2px 0 #000',
              }}
            />
          ))}
        </div>

        {/* Subtitle */}
        <h2
          className="text-white font-black uppercase text-center"
          style={{ fontSize: '1.4rem', letterSpacing: '0.05em' }}
        >
          EVERYONE ANSWERS
        </h2>

        {/* Prompt card */}
        <div
          className="border-2 border-black p-5 w-full"
          style={{ backgroundColor: '#FFF9E8', boxShadow: '6px 6px 0 #FFE500' }}
        >
          <p className="font-black uppercase text-xs tracking-widest text-black mb-3" style={{ color: '#888' }}>
            Final Prompt
          </p>
          <p className="font-black text-black text-base leading-snug">
            "Convince the board that your team's biggest failure was actually a strategic success."
          </p>
        </div>

        {/* Timer */}
        <div
          className="font-black text-5xl tracking-tight px-6 py-2 border-2 border-black"
          style={{ color: '#00FF85', textShadow: '3px 3px 0 #000', backgroundColor: 'rgba(0,255,133,0.05)', boxShadow: '4px 4px 0 #fff' }}
        >
          00:45
        </div>

        {/* Everyone answers note */}
        <p className="text-white font-bold text-center text-sm">
          Everyone answers now.
        </p>
      </div>

      {/* Sticky bottom */}
      <div className="px-6 pb-10 pt-4 w-full">
        <button
          className="w-full bg-[#FFE500] text-black font-black uppercase tracking-wide py-5 text-xl border-2 border-black"
          style={{ boxShadow: '4px 4px 0 #000', letterSpacing: '0.05em' }}
        >
          LET'S GO →
        </button>
      </div>
    </div>
  );
}

export default FinalRound;
