export function PowerReveal() {
  return (
    <div
      className="min-h-screen w-full overflow-hidden flex flex-col"
      style={{ backgroundColor: '#0D0D1F', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="px-6 pt-14 pb-4">
        <p className="font-black uppercase tracking-widest text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          YOUR POWER
        </p>
      </div>

      {/* Dramatic reveal card */}
      <div className="px-6 flex-1 flex items-center">
        <div
          className="border-2 border-black p-6 w-full flex flex-col items-center gap-5"
          style={{ backgroundColor: '#FFF9E8', boxShadow: '6px 6px 0 #fff' }}
        >
          {/* Top accent */}
          <div
            className="w-full flex items-center justify-center gap-3 border-b-2 border-black pb-4"
          >
            <span style={{ fontSize: '2.5rem' }}>🎭</span>
            <div>
              <p
                className="font-black uppercase tracking-wide text-xl"
                style={{ color: '#FF3DBA' }}
              >
                ANSWER AS A...
              </p>
              <p className="font-bold text-xs uppercase tracking-widest text-black" style={{ color: '#888' }}>
                Personality modifier active
              </p>
            </div>
          </div>

          {/* Divider */}
          <p className="font-black uppercase text-xs tracking-widest text-black" style={{ color: '#888' }}>
            YOUR TARGET MUST ANSWER AS:
          </p>

          {/* The big reveal */}
          <div
            className="w-full text-center border-2 border-black p-4"
            style={{ backgroundColor: '#FFE500', boxShadow: '4px 4px 0 #000' }}
          >
            <h2
              className="font-black uppercase tracking-tight leading-tight"
              style={{ fontSize: '2rem', color: '#000' }}
            >
              DESPERATELY OPTIMISTIC CEO
            </h2>
          </div>

          {/* Timer note */}
          <div className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, backgroundColor: '#FF3DBA', border: '2px solid #000', borderRadius: '50%' }} />
            <p className="font-bold italic text-sm text-black" style={{ color: '#555' }}>
              You have 30 seconds.
            </p>
          </div>

          {/* Decorative shapes */}
          <div className="flex gap-3">
            {['#FF3DBA', '#3DFFFF', '#00FF85'].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: c,
                  border: '2px solid #000',
                  transform: `rotate(${i * 20}deg)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sticky bottom */}
      <div className="px-6 pb-10 pt-6">
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

export default PowerReveal;
