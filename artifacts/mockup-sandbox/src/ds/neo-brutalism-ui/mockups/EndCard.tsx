export function EndCard() {
  // Confetti pieces data
  const confetti = [
    { x: 10, y: 8, w: 20, h: 10, color: '#FF3DBA', rotate: 25 },
    { x: 75, y: 5, w: 14, h: 14, color: '#FFE500', rotate: -15 },
    { x: 85, y: 15, w: 10, h: 20, color: '#3DFFFF', rotate: 45 },
    { x: 5, y: 20, w: 12, h: 12, color: '#00FF85', rotate: 10 },
    { x: 90, y: 35, w: 16, h: 8, color: '#FF3DBA', rotate: -30 },
    { x: 15, y: 45, w: 8, h: 16, color: '#FFE500', rotate: 60 },
    { x: 70, y: 55, w: 18, h: 9, color: '#00FF85', rotate: -20 },
    { x: 20, y: 70, w: 12, h: 20, color: '#3DFFFF', rotate: 35 },
    { x: 80, y: 72, w: 20, h: 10, color: '#FF3DBA', rotate: -45 },
    { x: 50, y: 85, w: 14, h: 14, color: '#FFE500', rotate: 15 },
    { x: 8, y: 88, w: 10, h: 10, color: '#00FF85', rotate: -10 },
    { x: 88, y: 90, w: 12, h: 8, color: '#3DFFFF', rotate: 50 },
  ];

  return (
    <div
      className="min-h-screen w-full overflow-hidden flex flex-col"
      style={{ backgroundColor: '#0D0D1F', fontFamily: 'system-ui, sans-serif', position: 'relative' }}
    >
      {/* Confetti shapes */}
      {confetti.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: c.w,
            height: c.h,
            backgroundColor: c.color,
            border: '2px solid #000',
            transform: `rotate(${c.rotate}deg)`,
            opacity: 0.85,
            zIndex: 0,
          }}
        />
      ))}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 gap-4">
        {/* Star decoration */}
        <div className="flex items-center gap-4">
          <span style={{ color: '#FF3DBA', fontSize: '2rem', fontWeight: 900 }}>✦</span>
          <span style={{ color: '#3DFFFF', fontSize: '1.4rem', fontWeight: 900 }}>✦</span>
          <span style={{ color: '#00FF85', fontSize: '1.8rem', fontWeight: 900 }}>✦</span>
        </div>

        {/* Main text */}
        <div className="text-center">
          <h1
            className="font-black uppercase tracking-tight leading-none"
            style={{
              fontSize: '4rem',
              color: '#fff',
              textShadow: '4px 4px 0 #000',
            }}
          >
            SAME CHAOS.
          </h1>
          <h1
            className="font-black uppercase tracking-tight leading-none"
            style={{
              fontSize: '4rem',
              color: '#FFE500',
              textShadow: '4px 4px 0 #000',
            }}
          >
            NEW MEETING.
          </h1>
        </div>

        {/* Score summary */}
        <div
          className="border-2 border-black px-6 py-3 flex items-center gap-3"
          style={{ backgroundColor: '#FF3DBA', boxShadow: '4px 4px 0 #000' }}
        >
          <span style={{ fontSize: '1.5rem' }}>🏆</span>
          <span className="font-black uppercase text-black text-base">PRIYA WINS WITH 2,840 PTS</span>
        </div>

        {/* Decorative row */}
        <div className="flex gap-2 mt-2">
          {['#FF3DBA', '#FFE500', '#3DFFFF', '#00FF85', '#FF3DBA'].map((c, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                backgroundColor: c,
                border: '2px solid #000',
                transform: `rotate(${i * 18}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="px-6 pb-12 flex flex-col gap-4 relative z-10">
        <button
          className="w-full bg-[#FFE500] text-black font-black uppercase tracking-wide py-5 text-xl border-2 border-black"
          style={{ boxShadow: '4px 4px 0 #000', letterSpacing: '0.05em' }}
        >
          PLAY AGAIN →
        </button>
        <button
          className="w-full font-black uppercase tracking-wide py-5 text-xl border-2 border-black text-black"
          style={{ backgroundColor: '#FFF9E8', boxShadow: '4px 4px 0 #fff', letterSpacing: '0.05em' }}
        >
          SHARE GAME
        </button>
      </div>
    </div>
  );
}

export default EndCard;
